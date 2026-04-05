import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Mail, User, CreditCard, Phone, Loader2 } from 'lucide-react'

const buyerSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  id_number: z.string().min(5, 'ID Number is required'),
  phone: z.string().optional(),
})

type BuyerFormValues = z.infer<typeof buyerSchema>

interface BuyerFormProps {
  onSubmit: (data: BuyerFormValues) => void
  isLoading?: boolean
}

export const BuyerForm: React.FC<BuyerFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              {...register('full_name')}
              placeholder="John Doe"
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {errors.full_name && <p className="text-xs text-danger ml-1">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">ID Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              {...register('id_number')}
              placeholder="63-123456-X-42"
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {errors.id_number && <p className="text-xs text-danger ml-1">{errors.id_number.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {errors.email && <p className="text-xs text-danger ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('phone')}
                placeholder="+263 771 234 567"
                className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {errors.phone && <p className="text-xs text-danger ml-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full py-6" isLoading={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            'Register Buyer'
          )}
        </Button>
      </div>
    </form>
  )
}
