import React, { useState } from 'react'
import { 
  Percent, 
  AlertTriangle, 
  CheckCircle2, 
  Settings, 
  ArrowRight,
  TrendingUp,
  Clock,
  Save
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn, formatCurrency } from '../../lib/utils'

export const PenaltyManagement: React.FC = () => {
  const [dailyRate, setDailyRate] = useState(0.1) // 0.1%

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Penalty Engine</h1>
          <p className="text-text-secondary mt-1">Configure automated late payment penalty calculations.</p>
        </div>
        <Button>
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
               <div className="premium-card space-y-6">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Settings className="w-5 h-5" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Global Configuration</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Daily Penalty Rate (%)</label>
                            <div className="relative">
                                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={dailyRate}
                                    onChange={(e) => setDailyRate(parseFloat(e.target.value))}
                                    className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-4 py-4 text-xl font-mono font-bold focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Grace Period (Days)</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input 
                                    type="number" 
                                    defaultValue={7}
                                    className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-4 py-4 text-xl font-mono font-bold focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-xs text-text-secondary leading-relaxed">
                            A <span className="font-bold text-text-primary">{dailyRate}%</span> daily rate equals roughly <span className="font-bold text-text-primary">{(dailyRate * 30).toFixed(1)}% per month</span> on overdue balances.
                        </p>
                    </div>
               </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
               <div className="premium-card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Active Penalty Ledger</h3>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-full text-[10px] font-bold">42 OVERDUE</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { buyer: 'John Doe', stand: '402', amount: 150, days: 12, penalty: 18.00 },
                            { buyer: 'Alice Smith', stand: '115', amount: 300, days: 5, penalty: 15.00 },
                            { buyer: 'Bob Wilson', stand: '209', amount: 150, days: 45, penalty: 67.50 },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-bg-elevated/30 border border-border rounded-xl hover:border-danger/30 transition-colors">
                                <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                                         <AlertTriangle className="w-5 h-5 text-danger" />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold">{row.buyer}</p>
                                         <p className="text-[10px] text-text-muted">Stand {row.stand} • {row.days} days overdue</p>
                                     </div>
                                </div>
                                <div className="text-right">
                                     <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Calculated Penalty</p>
                                     <p className="text-lg font-mono font-bold text-danger">+{formatCurrency(row.penalty, 'USD')}</p>
                                </div>
                                <div className="pl-6">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full mt-6 border-dashed">
                        Apply All Calculated Penalties
                    </Button>
               </div>
          </div>
      </div>
    </div>
  )
}
