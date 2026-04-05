import React from 'react'
import { 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  CreditCard,
  MapPin,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useBuyerPortal } from '../../hooks/useBuyerPortal'
import { Button } from '../../components/ui/Button'
import { formatCurrency, cn } from '../../lib/utils'
import { motion } from 'framer-motion'

export const BuyerDashboard: React.FC = () => {
  const { profile, allocation, stats, isLoadingProfile } = useBuyerPortal()

  if (isLoadingProfile) {
    return <div className="space-y-6">
        <div className="h-48 bg-bg-surface border border-border rounded-2xl animate-pulse" />
        <div className="h-32 bg-bg-surface border border-border rounded-2xl animate-pulse" />
    </div>
  }

  const statusConfig = {
    'behind': { 
        label: 'Action Required', 
        message: "You're behind on payments. Let's get you back on track.",
        icon: AlertTriangle,
        color: 'text-danger',
        bg: 'bg-danger/10',
        border: 'border-danger/20'
    },
    'at-risk': { 
        label: 'Payment Due Soon', 
        message: "Your next payment is due within 7 days.",
        icon: Clock,
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/20'
    },
    'on-track': { 
        label: 'On Track', 
        message: "You're doing great! Your payments are up to date.",
        icon: CheckCircle2,
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20'
    },
    'ahead': { 
        label: 'Elite Plan Holder', 
        message: "You're crushing your goal! Ahead of schedule 🏆",
        icon: Trophy,
        color: 'text-trophy',
        bg: 'bg-trophy/10',
        border: 'border-trophy/20'
    },
  }

  const config = statusConfig[stats.status]

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Status */}
      <section className="animate-fade-in-up">
        <h1 className="text-2xl font-display font-bold">Hello, {profile?.full_name.split(' ')[0]}!</h1>
        <p className="text-text-secondary text-sm">Welcome to your StandVault portal.</p>
      </section>

      {/* Gamification Status Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("p-5 rounded-2xl border-2 flex items-start gap-4 shadow-2xl shadow-black/40", config.bg, config.border)}
      >
        <div className={cn("p-3 rounded-xl bg-bg-base/50", config.color)}>
            <config.icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <h2 className={cn("font-display font-bold text-lg", config.color)}>{config.label}</h2>
            <p className="text-sm text-text-primary/80 mt-1">{config.message}</p>
        </div>
      </motion.div>

      {/* Stand Summary */}
      <div className="premium-card p-0 overflow-hidden">
        <div className="p-5 flex justify-between items-start">
            <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Your Property</p>
                <h3 className="text-xl font-display font-bold">Stand {allocation?.stand.stand_number}</h3>
                <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                    <MapPin className="w-3 h-3" />
                    {allocation?.stand.development.name}
                </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
            </div>
        </div>

        <div className="px-5 pb-6 space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Progress to ownership</p>
                    <p className="text-2xl font-mono font-bold">{stats.progressPercent.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Paid to date</p>
                    <p className="text-lg font-mono font-bold text-success">{formatCurrency(stats.totalPaid)}</p>
                </div>
            </div>
            <div className="h-3 bg-bg-elevated rounded-full overflow-hidden border border-border/50">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={cn("h-full rounded-full shadow-lg", stats.status === 'ahead' ? 'bg-trophy' : 'bg-primary')} 
                />
            </div>
        </div>

        <div className="bg-bg-elevated/40 border-t border-border p-5 grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Remaining</p>
                <p className="text-lg font-mono font-bold">{formatCurrency(stats.totalDue - stats.totalPaid)}</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Next Due</p>
                <p className="text-lg font-mono font-bold text-accent">15 April</p>
            </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="h-20 flex-col gap-1 py-4 justify-center" onClick={() => window.location.href = '/portal/submit-payment'}>
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Submit Proof of Payment</span>
          </Button>
          <Button variant="secondary" className="h-20 border-accent/20 flex-col gap-1 py-4 justify-center" onClick={() => window.location.href = '/portal/simulator'}>
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-xs text-accent">Payoff Simulator</span>
          </Button>
      </div>

      {/* Milestone Badges */}
      <section className="space-y-3">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Your Badges</h4>
          <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 opacity-100 scale-100">
                  <div className="w-12 h-12 rounded-full bg-success/10 border border-success/30 flex items-center justify-center relative shadow-lg">
                      <Trophy className="w-6 h-6 text-success" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-bg-base" />
                  </div>
                  <span className="text-[10px] text-text-secondary font-bold">Deposit</span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-40 grayscale scale-95">
                  <div className="w-12 h-12 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-text-muted" />
                  </div>
                  <span className="text-[10px] text-text-muted font-bold">25% Done</span>
              </div>
          </div>
      </section>

      {/* Support CTA */}
      <div className="premium-card bg-primary-muted/30 border-primary/20 flex items-center justify-between p-4">
          <p className="text-sm font-medium text-primary">Need help with your allocation?</p>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              Query
              <ArrowRight className="w-4 h-4" />
          </Button>
      </div>
    </div>
  )
}
