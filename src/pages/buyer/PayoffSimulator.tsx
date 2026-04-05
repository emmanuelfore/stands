import React, { useState } from 'react'
import { useBuyerPortal } from '../../hooks/useBuyerPortal'
import { Button } from '../../components/ui/Button'
import { formatCurrency, cn } from '../../lib/utils'
import { 
    Calculator, 
    ArrowRight, 
    TrendingDown, 
    Calendar,
    Sparkles,
    Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import { addMonths, format } from 'date-fns'

export const PayoffSimulator: React.FC = () => {
  const { stats, allocation } = useBuyerPortal()
  const [extraPayment, setExtraPayment] = useState(20)
  
  const currentBalance = stats.totalDue - stats.totalPaid
  const monthlyPayment = allocation?.instalment_plan?.monthly_amount || 150
  
  const simulatePayoff = () => {
    const newMonthly = monthlyPayment + extraPayment
    const monthsCurrent = Math.ceil(currentBalance / monthlyPayment)
    const monthsNew = Math.ceil(currentBalance / newMonthly)
    const monthsSaved = monthsCurrent - monthsNew
    const totalNewAmount = monthsNew * newMonthly
    
    return {
        monthsSaved,
        newPayoffDate: format(addMonths(new Date(), monthsNew), 'MMMM yyyy'),
        currentPayoffDate: format(addMonths(new Date(), monthsCurrent), 'MMMM yyyy')
    }
  }

  const result = simulatePayoff()

  return (
    <div className="space-y-6">
      <section className="animate-fade-in-up">
        <h1 className="text-2xl font-display font-bold">Payoff Simulator</h1>
        <p className="text-text-secondary text-sm">See how small changes speed up your journey.</p>
      </section>

      <div className="premium-card space-y-8 animate-fade-in-up delay-75">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Extra Monthly Payment</label>
              <span className="text-2xl font-mono font-bold text-primary">{formatCurrency(extraPayment)}</span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max="500" 
            step="10"
            value={extraPayment}
            onChange={(e) => setExtraPayment(parseInt(e.target.value))}
            className="w-full h-2 bg-bg-elevated rounded-full appearance-none cursor-pointer accent-primary"
          />
          
          <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase">
              <span>$0</span>
              <span>$500</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6 border-t border-border">
            <motion.div 
                key={result.monthsSaved}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-success/10 border border-success/20 p-4 rounded-xl"
            >
                <div className="p-2 bg-success/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-success" />
                </div>
                <div>
                    <p className="text-sm font-bold text-success">Save {result.monthsSaved} Months</p>
                    <p className="text-xs text-text-secondary">Finish by {result.newPayoffDate}</p>
                </div>
                <div className="ml-auto">
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                </div>
            </motion.div>

            <div className="flex items-center gap-4 bg-bg-elevated/50 border border-border p-4 rounded-xl">
                <div className="p-2 bg-bg-surface rounded-lg">
                    <Calendar className="w-6 h-6 text-text-muted" />
                </div>
                <div>
                    <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Standard Payoff</p>
                    <p className="text-sm font-bold text-text-primary italic opacity-60 line-through">{result.currentPayoffDate}</p>
                </div>
            </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-xl flex gap-3 border border-primary/10">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-text-secondary leading-relaxed">
                By paying an extra <span className="font-bold text-text-primary">{formatCurrency(extraPayment)}</span> every month, you clear your balance <span className="font-bold text-primary">{result.monthsSaved} months faster</span> than planned.
            </p>
        </div>

        <Button className="w-full py-6">
            Update My Regular Payment
            <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center px-6">
          <p className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em]">Live Simulation Engine</p>
      </div>
    </div>
  )
}
