import React, { useState } from 'react'
import { 
  ArrowLeftRight, 
  UserPlus, 
  FileCheck, 
  ShieldAlert, 
  ChevronRight,
  UserMinus,
  ArrowRight,
  Info
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

import { useAllocations } from '../../hooks/useAllocations'
import { useBuyers } from '../../hooks/useBuyers'
import { useDocuments } from '../../hooks/useDocuments'
import { useOrganization } from '../../hooks/useOrganization'
import { Modal } from '../../components/ui/Modal'

export const TransferWorkflow: React.FC = () => {
  const { allocations, isLoading: isLoadingAllocations, transferAllocation } = useAllocations()
  const { buyers, isLoading: isLoadingBuyers } = useBuyers()
  const { organization } = useOrganization()
  const { uploadDocument } = useDocuments()
  
  const [selectedAllocationId, setSelectedAllocationId] = useState('')
  const [selectedBuyerId, setSelectedBuyerId] = useState('')
  const [cessionFee, setCessionFee] = useState(400)
  const [isSuccess, setIsSuccess] = useState(false)

  const selectedAllocation = allocations?.find((a: any) => a.id === selectedAllocationId)
  const selectedBuyer = buyers?.find((b: any) => b.id === selectedBuyerId)

  const handleTransfer = async () => {
    if (!selectedAllocationId || !selectedBuyerId) return
    
    try {
        await transferAllocation.mutateAsync({
            allocationId: selectedAllocationId,
            newBuyerId: selectedBuyerId
        })
        setIsSuccess(true)
    } catch (err) {
        console.error('Transfer failed:', err)
    }
  }

  if (isSuccess) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-full bg-success/20 border border-success/30 flex items-center justify-center mb-6">
                  <FileCheck className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Transfer Successful</h2>
              <p className="text-text-secondary max-w-xs mx-auto mb-8">
                  Property rights have been successfully ceded. New Agreement of Sale generated.
              </p>
              <Button onClick={() => setIsSuccess(false)}>
                  Initiate Another Transfer
              </Button>
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Transfer & Cession</h1>
        <p className="text-text-secondary mt-1">Manage the legal transfer of stand rights between buyers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
              <div className="premium-card space-y-6">
                   <div className="flex items-center gap-4 p-4 bg-bg-elevated/50 rounded-xl border border-border">
                       <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                           <ShieldAlert className="w-6 h-6 text-orange-500" />
                       </div>
                       <div>
                           <p className="text-sm font-bold">Initiating Legal Cession</p>
                           <p className="text-xs text-text-secondary">This process will terminate the existing Agreement of Sale and issue a new one.</p>
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                           <label className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-1">Current Holder</label>
                           <select 
                                className="w-full bg-bg-surface border border-border rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                                value={selectedAllocationId}
                                onChange={(e) => setSelectedAllocationId(e.target.value)}
                           >
                               <option value="">Select Allocation...</option>
                               {allocations?.map((a: any) => (
                                   <option key={a.id} value={a.id}>
                                       {a.buyer.full_name} - Stand {a.stand.stand_number}
                                   </option>
                               ))}
                           </select>
                           {selectedAllocation && (
                               <div className="mt-2 px-2">
                                   <p className="text-[10px] text-text-muted">ID: {selectedAllocation.buyer.id_number}</p>
                               </div>
                           )}
                       </div>
                       <div className="space-y-2">
                           <label className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-1">New Transferee</label>
                           <select 
                                className="w-full bg-bg-surface border border-border rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                                value={selectedBuyerId}
                                onChange={(e) => setSelectedBuyerId(e.target.value)}
                           >
                               <option value="">Select New Buyer...</option>
                               {buyers?.filter(b => b.id !== selectedAllocation?.buyer_id).map(b => (
                                   <option key={b.id} value={b.id}>{b.full_name}</option>
                               ))}
                           </select>
                           {selectedBuyer && (
                               <div className="mt-2 px-2 text-right">
                                   <p className="text-[10px] text-text-muted">ID: {selectedBuyer.id_number}</p>
                               </div>
                           )}
                       </div>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-border">
                       <h4 className="text-xs font-bold uppercase tracking-widest">Required Documents</h4>
                       <div className="space-y-3">
                           {[
                               'Signed Cession Agreement',
                               'New Transferee ID Copy',
                               'Existing Agreement of Sale (Original)',
                               'Proof of Cession Fees Payment'
                           ].map(doc => (
                               <div key={doc} className="flex items-center justify-between p-3 border border-border rounded-lg bg-bg-elevated/20">
                                   <span className="text-sm">{doc}</span>
                                   <Button variant="ghost" size="sm" className="text-primary h-7 px-3">Upload</Button>
                               </div>
                           ))}
                       </div>
                   </div>

                   <Button 
                        className="w-full py-6" 
                        disabled={!selectedAllocationId || !selectedBuyerId}
                        onClick={handleTransfer}
                        isLoading={transferAllocation.isPending}
                   >
                       Execute Ownership Transfer
                       <FileCheck className="w-5 h-5" />
                   </Button>
              </div>
          </div>

          <div className="space-y-6">
               <div className="premium-card bg-primary-muted/10 border-primary/20">
                   <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Cession Fees</h4>
                   <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                           <span className="text-text-secondary">Administrative Fee</span>
                           <span className="font-mono font-bold">$250.00</span>
                       </div>
                       <div className="flex justify-between text-sm">
                           <span className="text-text-secondary">Legal Drafting</span>
                           <span className="font-mono font-bold">$150.00</span>
                       </div>
                       <div className="pt-3 border-t border-primary/20 flex justify-between">
                           <span className="font-bold text-primary">TOTAL DUE</span>
                           <span className="font-mono font-bold text-primary">$400.00</span>
                       </div>
                   </div>
               </div>

               <div className="p-4 bg-bg-elevated/50 border border-border rounded-xl flex gap-3 italic text-xs text-text-muted leading-relaxed">
                   <Info className="w-5 h-5 text-text-muted shrink-0" />
                   Cessions are only permitted for stands where the deposit has been fully cleared.
               </div>
          </div>
      </div>
    </div>
  )
}
