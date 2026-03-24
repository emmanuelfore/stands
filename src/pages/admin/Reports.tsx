import React from 'react'
import { 
  FileDown, 
  BarChart, 
  TrendingUp, 
  AlertCircle, 
  FileText,
  Building2,
  Users,
  CreditCard,
  ChevronRight
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

const reportItems = [
  { 
    title: 'Aged Debt Report', 
    description: 'Breakdown of outstanding payments by overdue buckets (30, 60, 90+ days).',
    icon: AlertCircle,
    color: 'text-danger'
  },
  { 
    title: 'Collection Rate', 
    description: 'Monthly actual vs expected revenue collection trends across all developments.',
    icon: TrendingUp,
    color: 'text-success'
  },
  { 
    title: 'Development Summary', 
    description: 'Executive summary of stands sold, inventory value, and project progress.',
    icon: Building2,
    color: 'text-primary'
  },
  { 
    title: 'Sales Agent Commission', 
    description: 'Sales performance tracking and calculated commission per assigned agent.',
    icon: Users,
    color: 'text-accent'
  },
  { 
    title: 'Projected Cashflow', 
    description: '12-month forward-looking revenue projections based on active schedules.',
    icon: BarChart,
    color: 'text-trophy'
  },
  { 
    title: 'Month-end Management', 
    description: 'Consolidated report for finance directors and board management.',
    icon: FileText,
    color: 'text-text-primary'
  },
]

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Financial Reports</h1>
          <p className="text-text-secondary mt-1">Export high-precision intelligence for your developments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileDown className="w-4 h-4" />
            Export All (Excel)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportItems.map((item) => (
              <div key={item.title} className="premium-card group cursor-pointer hover:border-primary/50 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6">
                      <div className={cn("w-12 h-12 rounded-xl bg-bg-elevated border border-border flex items-center justify-center", item.color)}>
                          <item.icon className="w-6 h-6" />
                      </div>
                      <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors">
                          <FileDown className="w-5 h-5" />
                      </Button>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">{item.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">PDF • XLSX • CSV</span>
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
              </div>
          ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="premium-card bg-primary-muted/10 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Collection Trend</h4>
              </div>
              <div className="h-48 bg-bg-elevated/50 rounded-xl flex items-center justify-center italic text-text-muted text-xs">
                  Chart visualization (Recharts) will render here
              </div>
          </div>
          <div className="premium-card bg-accent-muted/10 border-accent/20">
              <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <h4 className="text-sm font-bold text-accent uppercase tracking-widest">Overdue Alerts</h4>
              </div>
              <div className="h-48 bg-bg-elevated/50 rounded-xl flex items-center justify-center italic text-text-muted text-xs">
                  Aged debt breakdown will render here
              </div>
          </div>
      </div>
    </div>
  )
}
