import { differenceInDays, parseISO } from 'date-fns'

export interface PenaltyResult {
    daysOverdue: number
    penaltyAmount: number
    isPenaltyApplied: boolean
}

export function calculatePenalty(
    dueDate: string | Date,
    amountDue: number,
    paidDate: string | Date = new Date(),
    dailyRate: number = 0.001 // 0.1% per day as default
): PenaltyResult {
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
    const paid = typeof paidDate === 'string' ? parseISO(paidDate) : paidDate
    
    const daysOverdue = differenceInDays(paid, due)
    
    if (daysOverdue <= 0) {
        return { daysOverdue: 0, penaltyAmount: 0, isPenaltyApplied: false }
    }

    const penaltyAmount = Number((amountDue * dailyRate * daysOverdue).toFixed(2))

    return {
        daysOverdue,
        penaltyAmount,
        isPenaltyApplied: penaltyAmount > 0
    }
}

/**
 * Bulk Matcher Logic
 * Matches bank statement rows to pending PoPs based on Amount and Reference substring
 */
export function matchBankStatement(
    statementRows: any[],
    pendingPayments: any[]
) {
    return statementRows.map(row => {
        const amount = parseFloat(row.amount || row.Amount)
        const reference = (row.reference || row.Reference || '').toString().toLowerCase()
        
        const match = pendingPayments.find(p => {
            const amountMatch = Math.abs(p.amount - amount) < 0.01
            const refMatch = reference.includes(p.reference_number.toLowerCase()) || 
                             p.reference_number.toLowerCase().includes(reference)
            return amountMatch && refMatch
        })

        return {
            ...row,
            matchStatus: match ? 'matched' : 'unmatched',
            matchedPaymentId: match?.id,
            matchedBuyer: match?.buyer?.full_name
        }
    })
}
