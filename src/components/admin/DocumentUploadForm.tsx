import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { File, Tag, User, Building2, Loader2, Upload } from 'lucide-react'
import { useStands } from '../../hooks/useStands'
import { useBuyers } from '../../hooks/useBuyers'
import { DocumentCategory } from '../../types'

const documentSchema = z.object({
  name: z.string().min(3, 'Document name is required'),
  category: z.enum(['offer_letter', 'agreement', 'receipt', 'title_deed', 'id_document', 'other']),
  stand_id: z.string().uuid().optional().or(z.literal('')),
  buyer_id: z.string().uuid().optional().or(z.literal('')),
})

type DocumentFormValues = z.infer<typeof documentSchema>

interface DocumentUploadFormProps {
  onSubmit: (data: DocumentFormValues, file: File) => void
  isLoading?: boolean
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onSubmit, isLoading }) => {
  const { stands } = useStands()
  const { buyers } = useBuyers()
  const [file, setFile] = React.useState<File | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
        category: 'other'
    }
  })

  const onFormSubmit = (data: DocumentFormValues) => {
    if (!file) {
        alert('Please select a file')
        return
    }
    onSubmit(data, file)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* File Dropzone */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">File Attachment</label>
            <label className="group relative h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                {file ? (
                    <div className="flex flex-col items-center">
                        <File className="w-8 h-8 text-primary mb-2" />
                        <span className="text-xs font-medium text-text-primary">{file.name}</span>
                        <span className="text-[10px] text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors mb-2" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-primary">Click or drag to upload</span>
                        <span className="text-[10px] text-text-muted/60 uppercase font-bold mt-1">PDF, JPG, PNG up to 10MB</span>
                    </div>
                )}
                <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                />
            </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Document Name</label>
          <div className="relative">
            <File className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              {...register('name')}
              placeholder="Signed Offer Letter - S402"
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {errors.name && <p className="text-xs text-danger ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Category</label>
            <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <select
                    {...register('category')}
                    className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                    <option value="offer_letter">Offer Letter</option>
                    <option value="agreement">Agreement of Sale</option>
                    <option value="receipt">Payment Receipt</option>
                    <option value="title_deed">Title Deed</option>
                    <option value="id_document">ID Document</option>
                    <option value="other">Other/Miscellaneous</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Link to Stand</label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <select
                        {...register('stand_id')}
                        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-[10px] text-text-primary focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                        <option value="">(Optional)</option>
                        {stands?.map(stand => (
                            <option key={stand.id} value={stand.id}>Stand {stand.stand_number} - {stand.development?.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Link to Buyer</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <select
                        {...register('buyer_id')}
                        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-[10px] text-text-primary focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                        <option value="">(Optional)</option>
                        {buyers?.map(buyer => (
                            <option key={buyer.id} value={buyer.id}>{buyer.full_name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full py-6" isLoading={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            'Upload to Vault'
          )}
        </Button>
      </div>
    </form>
  )
}
