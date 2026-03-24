import React from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  Search, 
  ArrowUpRight, 
  AlertCircle,
  FileText
} from 'lucide-react'
import { usePayments } from '../../hooks/usePayments'
import { Button } from '../../components/ui/Button'
import { cn, formatCurrency, formatDate } from '../../lib/utils'

export const PaymentsQueue: React.FC = () => {
  const { pendingPayments, isLoadingPending, verifyPayment } = usePayments()

  const handleVerify = (id: string, status: 'verified' | 'rejected') => {
    const note = status === 'rejected' ? prompt('Reason for rejection:') : undefined
    if (status === 'rejected' && note === null) return
    verifyPayment.mutate({ id, status, note: note || undefined })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Verification Queue</h1>
          <p className="text-text-secondary mt-1">Review Proof of Payment (PoP) submissions.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            {pendingPayments?.length || 0} Pending
        </div>
      </div>

      {isLoadingPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-bg-surface border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : pendingPayments?.length === 0 ? (
        <div className="premium-card py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success opacity-40" />
            </div>
            <h3 className="text-xl font-display font-bold">All caught up!</h3>
            <p className="text-text-muted max-w-xs mx-auto mt-2">There are no pending proof of payments to verify at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPayments?.map((payment: any) => (
            <div key={payment.id} className="premium-card flex flex-col p-0 overflow-hidden group">
              <div className="p-5 border-b border-border bg-bg-elevated/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Buyer</p>
                    <p className="font-bold text-text-primary">{payment.buyer.full_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-xl font-mono font-bold text-primary">{formatCurrency(payment.amount, payment.currency)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Stand {payment.allocation.stand.stand_number} — {payment.allocation.stand.development.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <FileText className="w-3.5 h-3.5" />
                        Ref: <span className="font-mono">{payment.reference_number || 'N/A'}</span>
                    </div>
                </div>
              </div>

              <div className="relative aspect-video bg-bg-base overflow-hidden mx-5 mt-5 rounded-lg border border-border group-hover:border-primary/50 transition-colors">
                {payment.pop_url ? (
                  <img src={payment.pop_url} alt="PoP" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted italic gap-2">
                    <AlertCircle className="w-8 h-8 opacity-20" />
                    <span className="text-xs">No screenshot provided</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-bg-base/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                        View Full
                    </Button>
                </div>
              </div>

              <div className="p-5 grid grid-cols-2 gap-3 mt-auto">
                <Button 
                    variant="danger" 
                    className="w-full" 
                    onClick={() => handleVerify(payment.id, 'rejected')}
                >
                    <XCircle className="w-4 h-4" />
                    Reject
                </Button>
                <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => handleVerify(payment.id, 'verified')}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify
                </Button>
              </div>
              
              <div className="px-5 pb-5 flex justify-between items-center text-[10px] text-text-muted uppercase font-bold tracking-widest">
                  <span>Submitted {formatDate(payment.created_at)}</span>
                  <span className="bg-bg-elevated px-2 py-0.5 rounded italic">Method: {payment.payment_method}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
