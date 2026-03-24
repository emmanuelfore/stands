import React from 'react'
import { 
  Users, 
  Building2, 
  CreditCard, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  ChevronRight
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
import { cn } from '../../lib/utils'

const data = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
]

export const AdminDashboard: React.FC = () => {
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
          title="Total Revenue" 
          value="$1.24M" 
          trend="+12.5%" 
          trendType="up" 
          icon={CreditCard} 
        />
        <StatCard 
          title="Active Buyers" 
          value="482" 
          trend="+3.2%" 
          trendType="up" 
          icon={Users} 
        />
        <StatCard 
          title="Available Stands" 
          value="24" 
          trend="-2" 
          trendType="neutral" 
          icon={Building2} 
        />
        <StatCard 
          title="Pending Verification" 
          value="15" 
          trend="High" 
          trendType="down" 
          icon={AlertCircle} 
          isAlert
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 premium-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold mb-1">Collection Trend</h3>
              <p className="text-sm text-text-muted">Monthly payment volume across the portfolio.</p>
            </div>
            <div className="flex items-center gap-2 bg-bg-elevated p-1 rounded-md text-xs font-medium">
               <button className="px-2 py-1 bg-bg-surface rounded text-text-primary">6 Months</button>
               <button className="px-2 py-1 text-text-muted hover:text-text-secondary">Year</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <button className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 uppercase tracking-wider">
                 View All <ChevronRight className="w-3 h-3" />
              </button>
           </div>
           
           <div className="space-y-4">
              <QueueItem 
                name="Tinashe Mariga" 
                amount="$1,450.00" 
                time="10m ago" 
                project="Hogerty Hill Ph2"
              />
              <QueueItem 
                name="Sarah Mujuru" 
                amount="$850.00" 
                time="45m ago" 
                project="Charlotte Ph2"
              />
              <QueueItem 
                name="Blessing Ncube" 
                amount="$2,200.00" 
                time="2h ago" 
                project="Borrowdale Estate"
              />
              <QueueItem 
                name="Farai Gumbo" 
                amount="$1,100.00" 
                time="5h ago" 
                project="Hogerty Hill Ph2"
              />
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
    <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
       {name.split(' ').map(n => n[0]).join('')}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold truncate">{name}</div>
      <div className="text-xs text-text-muted truncate">{project}</div>
    </div>
    <div className="text-right">
       <div className="text-sm font-bold text-success">{amount}</div>
       <div className="text-[10px] text-text-muted uppercase font-bold">{time}</div>
    </div>
  </div>
)
