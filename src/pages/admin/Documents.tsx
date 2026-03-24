import React from 'react'
import { 
  Folder, 
  File, 
  Search, 
  Upload, 
  MoreVertical, 
  Clock, 
  Shield, 
  Download,
  Plus,
  CreditCard,
  X
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn, formatDate } from '../../lib/utils'

const documents = [
  { name: 'Deed of Sale - Stand 402.pdf', type: 'contract', size: '2.4 MB', date: '2026-03-20', status: 'signed' },
  { name: 'ID Copy - John Doe.jpg', type: 'identity', size: '1.1 MB', date: '2026-03-18', status: 'verified' },
  { name: 'Proof of Residence.pdf', type: 'utility', size: '840 KB', date: '2026-03-18', status: 'pending' },
  { name: 'Agreement of Sale - Stand 405.pdf', type: 'contract', size: '3.1 MB', date: '2026-03-22', status: 'unsigned' },
  { name: 'Bank Statement Jan 2026.pdf', type: 'financial', size: '5.2 MB', date: '2026-01-15', status: 'archived' },
]

export const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Document Vault</h1>
          <p className="text-text-secondary mt-1">Secure repository for legal and financial artifacts.</p>
        </div>
        <Button>
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="md:col-span-1 space-y-2">
            <h4 className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-4 mb-4">Categories</h4>
            {[
                { name: 'All Documents', count: 42, icon: Folder, active: true },
                { name: 'Contracts', count: 12, icon: Shield, active: false },
                { name: 'Identity Docs', count: 18, icon: Clock, active: false },
                { name: 'Receipts', count: 8, icon: CreditCard, active: false },
                { name: 'Templates', count: 4, icon: Plus, active: false },
            ].map(cat => (
                <button
                    key={cat.name}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                        cat.active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-bg-elevated text-text-muted"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <cat.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-60">{cat.count}</span>
                </button>
            ))}
        </div>

        {/* File List */}
        <div className="md:col-span-3 premium-card p-0">
             <div className="p-4 border-b border-border bg-bg-elevated/20 flex items-center gap-4">
                 <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                     <input 
                        placeholder="Search files..." 
                        className="w-full bg-bg-base border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
                     />
                 </div>
                 <Button variant="secondary" size="sm">Filters</Button>
             </div>

             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead>
                         <tr className="border-b border-border text-[10px] font-bold uppercase tracking-widest text-text-muted">
                             <th className="px-6 py-4">Name</th>
                             <th className="px-6 py-4">Size</th>
                             <th className="px-6 py-4">Added</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4 text-right">Action</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {documents.map((doc, i) => (
                            <tr key={i} className="hover:bg-bg-elevated/30 transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-bg-elevated rounded-lg">
                                            <File className="w-5 h-5 text-text-primary/70" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{doc.name}</p>
                                            <p className="text-[10px] text-text-muted uppercase font-bold">{doc.type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-text-muted font-mono">{doc.size}</td>
                                <td className="px-6 py-4 text-xs text-text-muted">{formatDate(doc.date)}</td>
                                <td className="px-6 py-4">
                                     <span className={cn(
                                         "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                                         doc.status === 'signed' || doc.status === 'verified' ? "bg-success/10 border-success/20 text-success" : 
                                         doc.status === 'pending' ? "bg-warning/10 border-warning/20 text-warning" :
                                         "bg-bg-elevated border-border text-text-muted"
                                     )}>
                                         {doc.status}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-danger">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
             </div>
        </div>
      </div>
    </div>
  )
}
