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

export const TransferWorkflow: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)

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
                           <div className="p-4 bg-bg-surface border border-border rounded-xl flex items-center gap-3">
                               <UserMinus className="w-5 h-5 text-danger" />
                               <div>
                                   <p className="text-sm font-bold">John Doe</p>
                                   <p className="text-[10px] text-text-muted">ID: 63-123456-A-42</p>
                               </div>
                           </div>
                       </div>
                       <div className="space-y-2 text-right">
                           <label className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-1">New Transferee</label>
                           <div className="p-4 bg-bg-surface border border-border rounded-xl flex items-center justify-end gap-3 text-right">
                               <div>
                                   <p className="text-sm font-bold">Tinashe Murambiwa</p>
                                   <p className="text-[10px] text-text-muted">ID: 08-987654-K-11</p>
                               </div>
                               <UserPlus className="w-5 h-5 text-success" />
                           </div>
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

                   <Button className="w-full py-6">
                       Generate Cession Certificates
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
