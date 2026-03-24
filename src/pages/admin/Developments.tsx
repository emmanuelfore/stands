import React, { useState } from 'react'
import { Plus, Building2, MapPin, BarChart, ChevronRight, Search } from 'lucide-react'
import { useDevelopments } from '../../hooks/useDevelopments'
import { Button } from '../../components/ui/Button'
import { cn, formatCurrency } from '../../lib/utils'
import { Modal } from '../../components/ui/Modal'

export const DevelopmentsPage: React.FC = () => {
  const { developments, isLoading, createDevelopment } = useDevelopments()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Developments</h1>
          <p className="text-text-secondary mt-1">Manage your property portfolios and phases.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          New Development
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: developments?.length || 0, icon: Building2, color: 'text-primary' },
          { label: 'Total Stands', value: '1,240', icon: BarChart, color: 'text-accent' },
          { label: 'Sold Rate', value: '68%', icon: BarChart, color: 'text-success' },
          { label: 'Total Value', value: '$4.2M', icon: BarChart, color: 'text-trophy' },
        ].map((stat) => (
          <div key={stat.label} className="premium-card flex items-center gap-4">
            <div className={cn("p-3 rounded-lg bg-bg-elevated", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            placeholder="Search developments..." 
            className="w-full bg-bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-bg-surface border border-border rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developments?.map((dev) => (
            <div key={dev.id} className="premium-card group cursor-pointer hover:border-primary/50">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-bg-elevated border border-border flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold tracking-widest uppercase">
                  ACTIVE
                </div>
              </div>
              
              <h3 className="text-xl font-display font-bold mb-1 group-hover:text-primary transition-colors">{dev.name}</h3>
              <div className="flex items-center gap-1 text-text-muted text-sm mb-6">
                <MapPin className="w-4 h-4" />
                {dev.location}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Collection Rate</span>
                  <span className="text-text-primary font-bold">84%</span>
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[84%] rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Stands Sold</p>
                    <p className="text-lg font-display font-bold">142 / 200</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Outstanding</p>
                    <p className="text-lg font-display font-bold text-danger">$12k</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <Button variant="ghost" size="sm" className="group/btn">
                  Manage Project
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}

          {/* Empty State / Add New */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold">Add New Development</p>
          </button>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Development"
      >
        <div className="text-text-secondary text-sm italic">
          Development creation form would go here. This confirms modal integration across admin pages.
        </div>
      </Modal>
    </div>
  )
}
