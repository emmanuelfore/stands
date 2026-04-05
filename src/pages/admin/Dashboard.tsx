import React from 'react'
import { 
  Users, 
  Building2, 
  CreditCard, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  ChevronRight,
  TrendingDown
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { cn, formatCurrency } from '../../lib/utils'
import { useAdminStats } from '../../hooks/useAdminStats'
import { useReports } from '../../hooks/useReports'
import { formatDistanceToNow } from 'date-fns'

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useAdminStats()
  const { collectionRate, isLoading: isLoadingReports } = useReports()

  if (isLoadingStats || isLoadingReports) {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-16 bg-bg-surface rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-bg-surface rounded-lg"></div>)}
            </div>
        </div>
    )
  }

  const chartData = collectionRate?.map(m => ({
    name: m.month.split(' ')[0], 
    revenue: m.actual
  })) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Executive Overview</h1>
        <p className="text-text-secondary">Real-time performance metrics across all active developments.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Verified Revenue" 
          value={formatCurrency(stats?.totalRevenue || 0)} 
          trend="Real-time" 
          trendType="up" 
          icon={CreditCard} 
        />
        <StatCard 
          title="Active Buyers" 
          value={(stats?.activeBuyers || 0).toString()} 
          trend="Registered" 
          trendType="up" 
          icon={Users} 
        />
        <StatCard 
          title="Available Stands" 
          value={(stats?.availableStands || 0).toString()} 
          trend="Inventory" 
          trendType="neutral" 
          icon={Building2} 
        />
        <StatCard 
          title="Pending Verification" 
          value={(stats?.pendingVerification || 0).toString()} 
          trend={stats?.pendingVerification ? 'Action Needed' : 'All Clear'} 
          trendType={stats?.pendingVerification ? 'down' : 'up'} 
          icon={AlertCircle} 
          isAlert={!!stats?.pendingVerification && stats.pendingVerification > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 premium-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold mb-1">Collection Trend</h3>
              <p className="text-sm text-text-muted">Monthly payment volume across the portfolio over the last 6 months.</p>
            </div>
            <div className="flex items-center gap-2 bg-bg-elevated p-1 rounded-md text-xs font-medium">
               <button className="px-2 py-1 bg-bg-surface rounded text-text-primary">6 Months</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2E3D" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8B92A8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8B92A8', fontSize: 12 }} 
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141720', border: '1px solid #2A2E3D', borderRadius: '8px' }}
                  itemStyle={{ color: '#F0F2F8' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Queue Preview */}
        <div className="premium-card">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Verification Queue</h3>
              <a href="/admin/payments" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 uppercase tracking-wider">
                 View All <ChevronRight className="w-3 h-3" />
              </a>
           </div>
           
           <div className="space-y-4">
              {stats?.queue && stats.queue.length > 0 ? (
                  stats.queue.map((item: any) => (
                      <QueueItem 
                        key={item.id}
                        name={item.buyer?.full_name || 'Unknown Buyer'} 
                        amount={formatCurrency(item.amount)} 
                        time={formatDistanceToNow(new Date(item.created_at), { addSuffix: true })} 
                        project={`${item.allocation?.stand?.development?.name} - Stand ${item.allocation?.stand?.stand_number}`}
                      />
                  ))
              ) : (
                  <div className="text-center py-8 opacity-60">
                      <TrendingDown className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-sm font-bold text-text-muted">Queue is empty!</p>
                  </div>
              )}
           </div>
           
           <div className="mt-8 pt-6 border-t border-border">
              <div className="bg-bg-elevated/50 p-4 rounded-lg flex items-center gap-4 border border-border/50">
                 <div className="w-10 h-10 bg-trophy/20 rounded-full flex items-center justify-center text-trophy">
                    <Clock className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-text-muted mb-0.5">Efficiency Score</div>
                    <div className="text-sm font-medium text-text-primary">Avg 2.4h verification time</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

const StatCard: React.FC<{ 
  title: string, 
  value: string, 
  trend: string, 
  trendType: 'up' | 'down' | 'neutral', 
  icon: any,
  isAlert?: boolean
}> = ({ title, value, trend, trendType, icon: Icon, isAlert }) => (
  <div className={cn("premium-card group", isAlert && "border-danger/30 bg-danger/5")}>
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
        isAlert ? "bg-danger/20 text-danger" : "bg-bg-elevated text-text-secondary group-hover:bg-primary group-hover:text-white"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold",
        trendType === 'up' ? "text-success" : trendType === 'down' ? "text-danger" : "text-text-muted"
      )}>
        {trendType === 'up' && <ArrowUpRight className="w-3 h-3" />}
        {trendType === 'down' && <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </div>
    </div>
    <div className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">{title}</div>
    <div className="text-2xl font-display font-bold">{value}</div>
  </div>
)

const QueueItem: React.FC<{ name: string, amount: string, time: string, project: string }> = ({ name, amount, time, project }) => (
  <div className="flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer group">
    <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/20 transition-all shrink-0">
       {name.split(' ').slice(0,2).map(n => n?.[0]).join('')}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold truncate">{name}</div>
      <div className="text-xs text-text-muted truncate">{project}</div>
    </div>
    <div className="text-right shrink-0">
       <div className="text-sm font-bold text-success">{amount}</div>
       <div className="text-[10px] text-text-muted uppercase font-bold">{time}</div>
    </div>
  </div>
)
