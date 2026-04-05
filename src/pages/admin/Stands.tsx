import React, { useState } from 'react'
import { 
  Building2, 
  Map as MapIcon, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Table as TableIcon, 
  Grid 
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { useStands } from '../../hooks/useStands'
import { Modal } from '../../components/ui/Modal'
import { StandForm } from '../../components/admin/StandForm'
import { ImportWizard } from '../../components/admin/ImportWizard'

type StandStatus = 'available' | 'reserved' | 'allocated' | 'transferred' | 'on_hold'

const statusConfig: Record<StandStatus, { label: string, color: string }> = {
  available: { label: 'Available', color: 'bg-primary/10 text-primary border-primary/20' },
  reserved: { label: 'Reserved', color: 'bg-accent/10 text-accent border-accent/20' },
  allocated: { label: 'Allocated', color: 'bg-success/10 text-success border-success/20' },
  transferred: { label: 'Transferred', color: 'bg-trophy/10 text-trophy border-trophy/20' },
  on_hold: { label: 'On Hold', color: 'bg-text-muted/10 text-text-muted border-text-muted/20' },
}

export const StandsPage: React.FC = () => {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const { stands, isLoading, createStand, createStands } = useStands()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const handleCreateStand = async (data: any) => {
    try {
        await createStand.mutateAsync(data)
        setIsModalOpen(false)
    } catch (err) {
        console.error('Failed to create stand:', err)
    }
  }

  const handleBulkImport = async (data: any[]) => {
    try {
        await createStands.mutateAsync(data)
        setIsImportOpen(false)
    } catch (err) {
        console.error('Failed to import stands:', err)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Stands Management</h1>
          <p className="text-text-secondary mt-1">Allocation, status tracking, and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <TableIcon className="w-4 h-4" />
            Bulk Import
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Add Stand
          </Button>
        </div>
      </div>

      {/* Visual Map / Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bg-surface border border-border rounded-xl">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              placeholder="Search stand number..." 
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="flex items-center bg-bg-elevated rounded-lg p-1 border border-border">
          <button 
            onClick={() => setView('grid')}
            className={cn(
              "p-2 rounded-md transition-all",
              view === 'grid' ? "bg-bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('table')}
            className={cn(
              "p-2 rounded-md transition-all",
              view === 'table' ? "bg-bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
            )}
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
        {isLoading ? (
          Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-bg-elevated animate-pulse" />
          ))
        ) : (
          stands?.map((stand) => {
            const config = statusConfig[stand.status as StandStatus] || statusConfig.available

            return (
              <div 
                key={stand.id} 
                className={cn(
                  "aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group relative text-center px-1",
                  config.color
                )}
              >
                <span className="text-xs font-bold leading-none">{stand.stand_number}</span>
                <span className="text-[8px] uppercase font-bold tracking-tighter mt-0.5 opacity-60">{stand.size_sqm}m²</span>
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-bg-elevated border border-border rounded-lg p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Stand {stand.stand_number}</p>
                  <p className="text-xs text-text-primary font-bold">{config.label}</p>
                  <p className="text-[10px] text-text-muted mt-1">{stand.development?.name}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Stand"
      >
        <StandForm 
            onSubmit={handleCreateStand} 
            isLoading={createStand.isPending} 
        />
      </Modal>

      {isImportOpen && (
          <ImportWizard 
            type="stands"
            onClose={() => setIsImportOpen(false)}
            onImport={handleBulkImport}
          />
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full border", config.color.split(' ')[0])} />
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
