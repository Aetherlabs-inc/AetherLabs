import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase-server'
import Anthropic from '@anthropic-ai/sdk'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const EXTRACTION_PROMPT = `You are a document data extraction specialist for an art business. Analyze the provided data and extract structured records.

Your task: Identify and extract records from the data. Each record should be classified as one of:
- "artwork" — inventory items (title, artist, year, medium, dimensions, price, location, notes)
- "transaction" — sales/purchases/invoices (client_name, client_email, client_address, artwork_title, type, amount, currency, date, invoice_number, notes, line_items, vendor_name, vendor_address, vendor_phone, vendor_email, subtotal, tax_rate, tax_amount)
- "quotation" — price quotes (client_name, client_email, client_address, artwork_title, amount, currency, date, valid_until, quotation_number, status, notes, line_items, vendor_name, vendor_address, vendor_phone, vendor_email, subtotal, tax_rate, tax_amount)
- "client" — contact information (name, email, phone, company, type, notes)

For each record, provide:
1. "record_type": one of the above categories
2. "extracted_data": an object with the relevant fields filled in from the data
3. "confidence": a number from 0.0 to 1.0 indicating how confident you are in the extraction accuracy

CRITICAL — Document-level grouping rules:
- A single quotation document = ONE quotation record. Do NOT create a separate quotation record for each line item/service in the document.
- A single invoice document = ONE transaction record. Do NOT create a separate transaction record for each line item in the invoice.
- When a quotation or invoice contains multiple items/services, include them ALL in a "line_items" array inside extracted_data:
  "line_items": [{ "description": "...", "amount": 123.45, "quantity": 1, "details": "..." }, ...]
- The top-level "amount" field must be the TOTAL across all line items.
- Only create MULTIPLE quotation or transaction records if the document contains clearly SEPARATE, UNRELATED quotations/invoices (different clients, different quotation/invoice numbers, different dates).
- Also extract a separate "client" record for each unique client found in the document.

General rules:
- Extract ALL records you can identify
- For prices/amounts, extract the numeric value only (no currency symbols in the amount field)
- For dates, use ISO format (YYYY-MM-DD) when possible
- If a field is ambiguous, still extract your best guess but lower the confidence
- If a row has very little usable data, skip it
- For artwork dimensions, preserve the original format (e.g. "24 x 36 in")

Respond with ONLY valid JSON in this exact format:
{
  "document_type": "inventory" | "invoice" | "quotation" | "mixed",
  "records": [
    {
      "record_type": "artwork" | "transaction" | "quotation" | "client",
      "extracted_data": { ... },
      "confidence": 0.95,
      "row_index": 0
    }
  ]
}`;

const MAX_TEXT_LENGTH = 100000 // ~100KB text limit for Claude

async function parseFile(fileBuffer: Buffer, fileType: string, fileName: string): Promise<string> {
    if (fileType === 'xlsx' || fileType === 'csv') {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
        const sheets: Record<string, any[]> = {}

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName]
            sheets[sheetName] = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        }

        const text = JSON.stringify(sheets, null, 2)
        if (text.length > MAX_TEXT_LENGTH) {
            // Truncate to first N rows per sheet
            const truncatedSheets: Record<string, any[]> = {}
            for (const [name, rows] of Object.entries(sheets)) {
                truncatedSheets[name] = (rows as any[]).slice(0, 100)
            }
            return JSON.stringify(truncatedSheets, null, 2) +
                '\n\n[NOTE: Data truncated. Original file had more rows.]'
        }
        return text
    }

    if (fileType === 'docx') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer })
        const text = result.value
        if (text.length > MAX_TEXT_LENGTH) {
            return text.slice(0, MAX_TEXT_LENGTH) +
                '\n\n[NOTE: Text truncated due to length.]'
        }
        return text
    }

    throw new Error(`Unsupported file type: ${fileType}`)
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        const supabase = await createClient()

        // Auth check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify session belongs to user and is in 'uploaded' status
        const { data: session, error: sessionError } = await supabase
            .from('import_sessions')
            .select('*')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single()

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Import session not found' }, { status: 404 })
        }

        if (session.status !== 'uploaded' && session.status !== 'failed') {
            return NextResponse.json(
                { error: `Session is already ${session.status}` },
                { status: 400 }
            )
        }

        // Set status to processing
        await supabase
            .from('import_sessions')
            .update({ status: 'processing' })
            .eq('id', sessionId)

        // Download file from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
            .from('imports')
            .download(session.file_url)

        if (downloadError || !fileData) {
            await supabase
                .from('import_sessions')
                .update({ status: 'failed', error_message: 'Failed to download file' })
                .eq('id', sessionId)
            return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
        }

        // Parse file
        const buffer = Buffer.from(await fileData.arrayBuffer())
        let parsedText: string

        try {
            parsedText = await parseFile(buffer, session.file_type, session.file_name)
        } catch (parseError: any) {
            await supabase
                .from('import_sessions')
                .update({ status: 'failed', error_message: `Parse error: ${parseError.message}` })
                .eq('id', sessionId)
            return NextResponse.json({ error: `Failed to parse file: ${parseError.message}` }, { status: 500 })
        }

        // Send to Claude for extraction
        let claudeResponse: any
        try {
            const message = await anthropic.messages.create({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 8192,
                messages: [
                    {
                        role: 'user',
                        content: `${EXTRACTION_PROMPT}\n\n--- FILE: ${session.file_name} ---\n\n${parsedText}`,
                    },
                ],
            })

            const textBlock = message.content.find((b) => b.type === 'text')
            if (!textBlock || textBlock.type !== 'text') {
                throw new Error('No text response from Claude')
            }

            // Parse the JSON from Claude's response
            const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                throw new Error('No JSON found in Claude response')
            }

            claudeResponse = JSON.parse(jsonMatch[0])
        } catch (aiError: any) {
            await supabase
                .from('import_sessions')
                .update({ status: 'failed', error_message: `AI extraction error: ${aiError.message}` })
                .eq('id', sessionId)
            return NextResponse.json({ error: `AI extraction failed: ${aiError.message}` }, { status: 500 })
        }

        // Insert extracted records
        const records = claudeResponse.records || []
        if (records.length > 0) {
            const recordsToInsert = records.map((record: any, index: number) => ({
                session_id: sessionId,
                record_type: record.record_type,
                extracted_data: record.extracted_data,
                confidence: Math.min(1, Math.max(0, record.confidence || 0)),
                status: 'pending',
                row_index: record.row_index ?? index,
            }))

            const { error: insertError } = await supabase
                .from('extracted_records')
                .insert(recordsToInsert)

            if (insertError) {
                await supabase
                    .from('import_sessions')
                    .update({ status: 'failed', error_message: `Failed to save records: ${insertError.message}` })
                    .eq('id', sessionId)
                return NextResponse.json({ error: 'Failed to save extracted records' }, { status: 500 })
            }
        }

        // Update session
        await supabase
            .from('import_sessions')
            .update({
                status: 'extracted',
                document_type: claudeResponse.document_type || 'mixed',
                total_records: records.length,
            })
            .eq('id', sessionId)

        return NextResponse.json({ success: true, recordCount: records.length })
    } catch (error: any) {
        console.error('Extract API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
