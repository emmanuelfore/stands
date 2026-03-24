import React from 'react'
import { useBuyerPortal } from '../../hooks/useBuyerPortal'
import { cn, formatCurrency, formatDate } from '../../lib/utils'
import { CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react'

export const PaymentSchedule: React.FC = () => {
  const { schedule, allocation } = useBuyerPortal()

  return (
    <div className="space-y-6">
      <section className="animate-fade-in-up">
        <h1 className="text-2xl font-display font-bold">Payment Schedule</h1>
        <p className="text-text-secondary text-sm">Your roadmap to full ownership.</p>
      </section>

      <div className="premium-card p-0 overflow-hidden animate-fade-in-up delay-75">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-bg-elevated/50">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Due Date</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Amount</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedule.map((item: any, i: number) => {
                const isOverdue = item.status === 'overdue'
                const isPaid = item.status === 'paid'
                
                return (
                  <tr 
                    key={item.id} 
                    className={cn(
                        "transition-colors",
                        isOverdue ? "bg-danger/5" : "hover:bg-bg-elevated/30"
                    )}
                  >
                    <td className="px-5 py-4">
                      <p className={cn("text-sm font-bold", isPaid ? "text-text-muted line-through" : "text-text-primary")}>
                        {formatDate(item.due_date)}
                      </p>
                      {isOverdue && <p className="text-[10px] text-danger font-bold uppercase mt-0.5">Overdue</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className={cn("text-sm font-mono font-bold", isPaid ? "text-success/50" : "text-text-primary")}>
                        {formatCurrency(item.amount_due, item.currency)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {isPaid ? (
                        <div className="text-success flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Paid</span>
                        </div>
                      ) : isOverdue ? (
                        <div className="text-danger flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Pending</span>
                        </div>
                      ) : (
                        <div className="text-text-muted flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Future</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
              <p className="text-xs font-bold text-text-primary">Struggling this month?</p>
              <p className="text-[10px] text-text-secondary">Request a 7-day grace period extension.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-text-muted" />
      </div>
    </div>
  )
}
