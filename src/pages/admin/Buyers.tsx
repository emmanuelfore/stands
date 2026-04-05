import React, { useState } from 'react'
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar,
  ChevronRight,
  UserCheck,
  Download
} from 'lucide-react'
import { useBuyers } from '../../hooks/useBuyers'
import { useOrganization } from '../../hooks/useOrganization'
import { Button } from '../../components/ui/Button'
import { cn, formatDate } from '../../lib/utils'
import { Modal } from '../../components/ui/Modal'
import { BuyerForm } from '../../components/admin/BuyerForm'
import { ImportWizard } from '../../components/admin/ImportWizard'

export const BuyersPage: React.FC = () => {
  const { buyers, isLoading, createBuyer, importWithAllocations } = useBuyers()
  const { organization } = useOrganization()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const handleAddBuyer = async (data: any) => {
    if (!organization) return
    
    try {
        await createBuyer.mutateAsync({
            ...data,
            org_id: organization.id,
            onboarding_complete: false
        })
        setIsModalOpen(false)
    } catch (err) {
        console.error('Failed to create buyer:', err)
    }
  }

  const handleBulkImport = async (data: any[]) => {
    if (!organization) return
    
    try {
        const buyersWithOrg = data.map(b => ({
            ...b,
            org_id: organization.id,
        }))
        await importWithAllocations.mutateAsync(buyersWithOrg)
        setIsImportOpen(false)
    } catch (err) {
        console.error('Failed to import buyers:', err)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Buyers</h1>
          <p className="text-text-secondary mt-1">Manage allocations, onboarding, and profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Download className="w-5 h-5" />
            Bulk Import
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-5 h-5" />
            Add New Buyer
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-bg-surface p-4 border border-border rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            placeholder="Search by name, email, or stand..." 
            className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Tables/List */}
      <div className="premium-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-bg-elevated/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Buyer Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Stand/Project</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Join Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 bg-bg-surface/50"></td>
                  </tr>
                ))
              ) : (
                buyers?.map((buyer: any) => (
                  <tr key={buyer.id} className="hover:bg-bg-elevated/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-display font-bold text-primary">
                          {buyer.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{buyer.full_name}</p>
                          <p className="text-xs text-text-muted">ID: {buyer.id_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Mail className="w-3 h-3" />
                          {buyer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Phone className="w-3 h-3" />
                          {buyer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {buyer.allocations?.[0] ? (
                        <div>
                            <p className="text-sm font-bold text-text-primary">Stand {buyer.allocations[0].stand.stand_number}</p>
                            <p className="text-xs text-text-muted">{buyer.allocations[0].stand.development.name}</p>
                        </div>
                      ) : (
                        <span className="text-xs italic text-text-muted">Unallocated</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {buyer.onboarding_complete ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase border border-success/20">
                          <UserCheck className="w-3 h-3" />
                          Verified
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase border border-warning/20">
                          <Calendar className="w-3 h-3" />
                          Onboarding
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {formatDate(buyer.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-border bg-bg-elevated/20 flex items-center justify-between text-xs text-text-muted">
          <p>Showing 1 to {buyers?.length || 0} of {buyers?.length || 0} buyers</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Buyer"
      >
        <BuyerForm 
            onSubmit={handleAddBuyer} 
            isLoading={createBuyer.isPending} 
        />
      </Modal>
    </div>
  )
}
