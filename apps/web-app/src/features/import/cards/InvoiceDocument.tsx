'use client'

interface LineItem {
    description?: string
    name?: string
    details?: string
    amount?: string | number
    unit_price?: string | number
    price?: string | number
    quantity?: number
}

interface InvoiceDocumentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>
    className?: string
}

export function InvoiceDocument({ data, className = '' }: InvoiceDocumentProps) {
    const currency = data.currency || 'USD'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatAmount = (amount: any) => {
        if (!amount && amount !== 0) return '—'
        const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount
        if (isNaN(num)) return String(amount)
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(num)
    }

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return null
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
            })
        } catch {
            return dateStr
        }
    }

    const lineItems = Array.isArray(data.line_items) && data.line_items.length > 0
        ? data.line_items
        : data.artwork_title
            ? [{ description: data.artwork_title, amount: data.amount, quantity: 1 }]
            : []

    return (
        <div className={`bg-[#f0eeea] rounded-lg p-10 md:p-14 max-w-3xl mx-auto ${className}`}>
            {/* Vendor Name */}
            {data.vendor_name && (
                <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-inter mb-1">
                    {data.vendor_name}
                </p>
            )}

            {/* Title */}
            <h1 className="font-playfair text-[56px] md:text-[68px] font-bold text-[#2A2121] leading-none mb-8">
                Invoice
            </h1>

            {/* Metadata Row */}
            <div className="border-t border-b border-neutral-300 py-3 mb-8 flex flex-wrap gap-x-10 gap-y-2 text-sm font-inter">
                {data.date && (
                    <div>
                        <span className="text-neutral-500 mr-2">Date:</span>
                        <span className="text-neutral-800 tabular-nums">{formatDate(data.date)}</span>
                    </div>
                )}
                {data.invoice_number && (
                    <div>
                        <span className="text-neutral-500 mr-2">#</span>
                        <span className="text-neutral-800 tabular-nums">{data.invoice_number}</span>
                    </div>
                )}
                {data.type && (
                    <div>
                        <span className="text-neutral-500 mr-2">Type:</span>
                        <span className="text-neutral-800 capitalize">{data.type}</span>
                    </div>
                )}
            </div>

            {/* Client Info */}
            {(data.client_name || data.client_address) && (
                <div className="mb-8">
                    <p className="text-xs tracking-[0.15em] uppercase text-neutral-400 font-inter mb-1">Bill To</p>
                    {data.client_name && (
                        <p className="text-sm font-medium text-neutral-900 font-inter">{data.client_name}</p>
                    )}
                    {data.client_email && (
                        <p className="text-sm text-neutral-600 font-inter">{data.client_email}</p>
                    )}
                    {data.client_address && (
                        <p className="text-sm text-neutral-600 font-inter whitespace-pre-line">{data.client_address}</p>
                    )}
                </div>
            )}

            {/* Line Items Table */}
            {lineItems.length > 0 && (
                <div className="mb-8">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_100px_60px_100px] gap-4 pb-2 border-b-2 border-neutral-400 text-xs tracking-[0.1em] uppercase text-neutral-500 font-inter">
                        <span>Item Description</span>
                        <span className="text-right">Price</span>
                        <span className="text-center">QTY</span>
                        <span className="text-right">Amount</span>
                    </div>

                    {/* Rows */}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {lineItems.map((item: any, i: number) => {
                        const qty = item.quantity || 1
                        const price = item.unit_price || item.price || item.amount
                        const amount = item.amount || (price ? price * qty : null)

                        return (
                            <div
                                key={i}
                                className="grid grid-cols-[1fr_100px_60px_100px] gap-4 py-3 border-b border-neutral-200 text-sm font-inter"
                            >
                                <span className="text-neutral-900">
                                    {item.description || item.name}
                                    {item.details && (
                                        <span className="block text-xs text-neutral-500 mt-0.5">{item.details}</span>
                                    )}
                                </span>
                                <span className="text-right text-neutral-700 tabular-nums">
                                    {formatAmount(price)}
                                </span>
                                <span className="text-center text-neutral-700 tabular-nums">{qty}</span>
                                <span className="text-right text-neutral-900 tabular-nums">
                                    {formatAmount(amount)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Totals */}
            <div className="flex justify-end mb-10">
                <div className="w-64 space-y-2 font-inter text-sm">
                    {data.subtotal && (
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="text-neutral-800 tabular-nums">{formatAmount(data.subtotal)}</span>
                        </div>
                    )}
                    {(data.tax_rate || data.tax_amount) && (
                        <div className="flex justify-between">
                            <span className="text-neutral-500">
                                Tax{data.tax_rate ? ` (${data.tax_rate})` : ''}
                            </span>
                            <span className="text-neutral-800 tabular-nums">
                                {data.tax_amount ? formatAmount(data.tax_amount) : '—'}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-neutral-400">
                        <span className="font-medium text-neutral-900">Total Due</span>
                        <span className="font-bold text-neutral-900 tabular-nums text-base">
                            {formatAmount(data.amount)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            {(data.vendor_name || data.vendor_address || data.vendor_phone || data.vendor_email) && (
                <div className="border-t border-neutral-300 pt-6 flex justify-between items-start">
                    <div>
                        {data.vendor_name && (
                            <p className="text-sm font-medium text-neutral-800 font-inter">{data.vendor_name}</p>
                        )}
                    </div>
                    <div className="text-right text-xs text-neutral-500 font-inter space-y-0.5">
                        {data.vendor_address && <p className="whitespace-pre-line">{data.vendor_address}</p>}
                        {data.vendor_phone && <p>{data.vendor_phone}</p>}
                        {data.vendor_email && <p>{data.vendor_email}</p>}
                    </div>
                </div>
            )}

            {/* Notes */}
            {data.notes && (
                <div className="mt-6 pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500 font-inter italic">{data.notes}</p>
                </div>
            )}
        </div>
    )
}
