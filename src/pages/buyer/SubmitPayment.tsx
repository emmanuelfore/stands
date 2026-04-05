import React, { useState } from 'react'
import { useBuyerPortal } from '../../hooks/useBuyerPortal'
import { Button } from '../../components/ui/Button'
import { 
  Camera, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Hash,
  AlertCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '../../lib/utils'

export const SubmitPayment: React.FC = () => {
  const { allocation, profile } = useBuyerPortal()
  const queryClient = useQueryClient()
  
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [method, setMethod] = useState<'ecocash' | 'zipit' | 'bank_transfer'>('ecocash')
  const [file, setFile] = useState<File | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const submitPayment = useMutation({
    mutationFn: async () => {
      let popUrl = null

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `pops/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)
        
        popUrl = publicUrl
      }

            const { error } = await supabase
        .from('payments')
        .insert([{
          allocation_id: allocation?.id,
          buyer_id: profile?.id,
          amount: parseFloat(amount),
          currency: 'USD',
          payment_method: method,
          reference_number: reference,
          pop_url: popUrl,
          submitted_by: 'buyer',
          status: 'pending'
        }])

      if (error) throw error
    },
    onSuccess: () => {
      setIsSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['buyer', 'profile'] })
    }
  })

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-success/20 border border-success/30 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-2">Payment Submitted</h2>
        <p className="text-text-secondary max-w-xs mx-auto mb-8">
            Your verification is pending. We'll notify you once it's confirmed.
        </p>
        <Button className="w-full" onClick={() => window.history.back()}>
            Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="animate-fade-in-up">
        <h1 className="text-2xl font-display font-bold">Submit Payment</h1>
        <p className="text-text-secondary text-sm">Upload your proof of payment.</p>
      </section>

      <form onSubmit={(e) => { e.preventDefault(); submitPayment.mutate() }} className="space-y-6 animate-fade-in-up delay-75">
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] text-text-muted uppercase font-bold tracking-widest ml-1">Method</label>
                <div className="grid grid-cols-3 gap-2">
                    {(['ecocash', 'zipit', 'bank_transfer'] as const).map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMethod(m)}
                            className={cn(
                                "py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all",
                                method === m 
                                    ? "bg-primary/20 border-primary text-primary" 
                                    : "bg-bg-surface border-border text-text-muted"
                            )}
                        >
                            {m.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] text-text-muted uppercase font-bold tracking-widest ml-1">Amount (USD)</label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-bg-surface border-2 border-border rounded-xl pl-12 pr-4 py-4 text-xl font-mono font-bold focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] text-text-muted uppercase font-bold tracking-widest ml-1">Reference Number</label>
                <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input 
                        type="text" 
                        required
                        placeholder="Transaction ID"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="w-full bg-bg-surface border-2 border-border rounded-xl pl-12 pr-4 py-4 font-mono focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] text-text-muted uppercase font-bold tracking-widest ml-1">Proof of Payment</label>
                {!file ? (
                    <div className="flex gap-4">
                        <label className="flex-1 h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group">
                            <Upload className="w-8 h-8 text-text-muted mb-2 group-hover:text-primary" />
                            <span className="text-[10px] font-bold uppercase text-text-muted">Upload Photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </label>
                        <button type="button" className="flex-1 h-32 bg-bg-surface border-2 border-border rounded-xl flex flex-col items-center justify-center group hover:border-accent">
                            <Camera className="w-8 h-8 text-text-muted mb-2 group-hover:text-accent" />
                            <span className="text-[10px] font-bold uppercase text-text-muted">Take Photo</span>
                        </button>
                    </div>
                ) : (
                    <div className="relative h-48 rounded-xl overflow-hidden border-2 border-primary/30">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                            type="button" 
                            onClick={() => setFile(null)}
                            className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-danger transition-colors"
                        >
                            <AlertCircle className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>

        <Button type="submit" className="w-full py-8 text-lg" isLoading={submitPayment.isPending}>
            Submit Verification
            <ArrowRight className="w-6 h-6" />
        </Button>
      </form>
    </div>
  )
}
