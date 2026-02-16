import { createClient } from '@/src/lib/supabase'
import type {
    ImportSession,
    ImportSessionWithRecords,
    ExtractedRecord,
    ExtractedRecordStatus,
    FileType,
} from '@/src/types/database'

const supabase = createClient()

const FILE_TYPE_MAP: Record<string, FileType> = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel': 'xlsx',
    'text/csv': 'csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

const ALLOWED_EXTENSIONS = ['xlsx', 'csv', 'docx']

function getFileType(file: File): FileType {
    const mapped = FILE_TYPE_MAP[file.type]
    if (mapped) return mapped

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext && ALLOWED_EXTENSIONS.includes(ext)) return ext as FileType

    throw new Error(`Unsupported file type: ${file.type || file.name}`)
}

export class ImportService {
    static async uploadFile(file: File): Promise<ImportSession> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const fileType = getFileType(file)
        const timestamp = Date.now()
        const storagePath = `${user.id}/${timestamp}-${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('imports')
            .upload(storagePath, file)

        if (uploadError) {
            throw new Error(`Failed to upload file: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('imports')
            .getPublicUrl(storagePath)

        const { data: session, error } = await supabase
            .from('import_sessions')
            .insert({
                user_id: user.id,
                file_name: file.name,
                file_url: storagePath,
                file_type: fileType,
                file_size: file.size,
                status: 'uploaded',
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create import session: ${error.message}`)
        }

        return session
    }

    static async getSessions(): Promise<ImportSession[]> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data: sessions, error } = await supabase
            .from('import_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch import sessions: ${error.message}`)
        }

        return sessions || []
    }

    static async getSession(sessionId: string): Promise<ImportSessionWithRecords> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data: session, error } = await supabase
            .from('import_sessions')
            .select('*')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single()

        if (error) {
            throw new Error(`Failed to fetch import session: ${error.message}`)
        }

        const { data: records } = await supabase
            .from('extracted_records')
            .select('*')
            .eq('session_id', sessionId)
            .order('row_index', { ascending: true })

        return { ...session, extracted_records: records || [] }
    }

    static async getExtractedRecords(sessionId: string): Promise<ExtractedRecord[]> {
        const { data: records, error } = await supabase
            .from('extracted_records')
            .select('*')
            .eq('session_id', sessionId)
            .order('row_index', { ascending: true })

        if (error) {
            throw new Error(`Failed to fetch extracted records: ${error.message}`)
        }

        return records || []
    }

    static async updateExtractedRecord(
        recordId: string,
        updates: { status?: ExtractedRecordStatus; user_edits?: Record<string, any> }
    ): Promise<ExtractedRecord> {
        const { data: record, error } = await supabase
            .from('extracted_records')
            .update(updates)
            .eq('id', recordId)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update extracted record: ${error.message}`)
        }

        return record
    }

    static async batchUpdateRecordStatus(
        recordIds: string[],
        status: ExtractedRecordStatus
    ): Promise<void> {
        const { error } = await supabase
            .from('extracted_records')
            .update({ status })
            .in('id', recordIds)

        if (error) {
            throw new Error(`Failed to batch update records: ${error.message}`)
        }
    }

    static async updateArtworkMatchDecision(
        recordId: string,
        matchIndex: number,
        decision: 'confirmed' | 'create_new' | 'no_match'
    ): Promise<ExtractedRecord> {
        // Fetch the current record
        const { data: record, error: fetchError } = await supabase
            .from('extracted_records')
            .select('*')
            .eq('id', recordId)
            .single()

        if (fetchError || !record) {
            throw new Error('Record not found')
        }

        const edits = record.user_edits || {}
        const matches = [...(edits.artwork_matches || [])]

        if (matchIndex >= 0 && matchIndex < matches.length) {
            matches[matchIndex] = {
                ...matches[matchIndex],
                status: decision,
            }
        }

        const { data: updated, error } = await supabase
            .from('extracted_records')
            .update({
                user_edits: { ...edits, artwork_matches: matches },
            })
            .eq('id', recordId)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update match decision: ${error.message}`)
        }

        return updated
    }

    static async deleteSession(sessionId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data: session } = await supabase
            .from('import_sessions')
            .select('file_url')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single()

        if (session?.file_url) {
            await supabase.storage.from('imports').remove([session.file_url])
        }

        const { error } = await supabase
            .from('import_sessions')
            .delete()
            .eq('id', sessionId)
            .eq('user_id', user.id)

        if (error) {
            throw new Error(`Failed to delete import session: ${error.message}`)
        }
    }
}
