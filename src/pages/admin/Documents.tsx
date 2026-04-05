import React, { useState } from 'react'
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
import { useDocuments } from '../../hooks/useDocuments'
import { useOrganization } from '../../hooks/useOrganization'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { DocumentUploadForm } from '../../components/admin/DocumentUploadForm'
import { cn, formatDate } from '../../lib/utils'

export const DocumentsPage: React.FC = () => {
  const { documents, isLoadingDocs, uploadDocument } = useDocuments()
  const { organization } = useOrganization()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  const handleUpload = async (data: any, file: File) => {
    if (!organization) return
    
    try {
        await uploadDocument.mutateAsync({
            ...data,
            file,
            orgId: organization.id
        })
        setIsModalOpen(false)
    } catch (err) {
        console.error('Upload failed:', err)
    }
  }

  const filteredDocs = documents?.filter(doc => 
    categoryFilter === 'All' || doc.category.toLowerCase().includes(categoryFilter.toLowerCase().replace(' ', '_'))
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Document Vault</h1>
          <p className="text-text-secondary mt-1">Secure repository for legal and financial artifacts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="md:col-span-1 space-y-2">
            <h4 className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-4 mb-4">Categories</h4>
            {[
                { name: 'All', count: documents?.length || 0, icon: Folder },
                { name: 'Agreement', count: documents?.filter(d => d.category === 'agreement').length || 0, icon: Shield },
                { name: 'ID Document', count: documents?.filter(d => d.category === 'id_document').length || 0, icon: Clock },
                { name: 'Receipt', count: documents?.filter(d => d.category === 'receipt').length || 0, icon: CreditCard },
                { name: 'Other', count: documents?.filter(d => d.category === 'other').length || 0, icon: Plus },
            ].map(cat => (
                <button
                    key={cat.name}
                    onClick={() => setCategoryFilter(cat.name)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                        categoryFilter === cat.name ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-bg-elevated text-text-muted"
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
                             <th className="px-6 py-4">Association</th>
                             <th className="px-6 py-4">Added</th>
                             <th className="px-6 py-4 text-right">Action</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {isLoadingDocs ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8 bg-bg-surface/50"></td>
                                </tr>
                            ))
                        ) : filteredDocs?.map((doc) => (
                            <tr key={doc.id} className="hover:bg-bg-elevated/30 transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-bg-elevated rounded-lg text-primary">
                                            <File className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{doc.name}</p>
                                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{doc.category.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {doc.stand ? (
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-text-primary">Stand {doc.stand.stand_number}</span>
                                            <span className="text-[10px] text-text-muted uppercase">{doc.stand.development.name}</span>
                                        </div>
                                    ) : doc.buyer ? (
                                        <span className="text-xs font-bold text-text-primary">{doc.buyer.full_name}</span>
                                    ) : (
                                        <span className="text-xs italic text-text-muted">General</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-xs text-text-muted">{formatDate(doc.created_at)}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a 
                                            href={doc.file_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-bg-elevated text-text-muted hover:text-primary transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Document"
      >
        <DocumentUploadForm 
            onSubmit={handleUpload} 
            isLoading={uploadDocument.isPending} 
        />
      </Modal>
    </div>
  )
}
