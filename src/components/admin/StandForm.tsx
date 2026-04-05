import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Hash, Maximize2, DollarSign, Building2, MapPin, Loader2 } from 'lucide-react'
import { useDevelopments } from '../../hooks/useDevelopments'

const standSchema = z.object({
  development_id: z.string().uuid('Please select a development'),
  stand_number: z.string().min(1, 'Stand number is required'),
  size_sqm: z.number().min(1, 'Size must be greater than 0'),
  price_usd: z.number().min(0).optional(),
  price_zwg: z.number().min(0).optional(),
  phase: z.string().optional(),
  zoning: z.string().optional(),
  status: z.enum(['available', 'reserved', 'allocated', 'transferred', 'on_hold']),
})

type StandFormValues = z.infer<typeof standSchema>

interface StandFormProps {
  onSubmit: (data: StandFormValues) => void
  isLoading?: boolean
  initialDevelopmentId?: string
}

export const StandForm: React.FC<StandFormProps> = ({ onSubmit, isLoading, initialDevelopmentId }) => {
  const { developments, isLoading: isLoadingDevs } = useDevelopments()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StandFormValues>({
    resolver: zodResolver(standSchema),
    defaultValues: {
        development_id: initialDevelopmentId,
        status: 'available',
        size_sqm: 400
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Development</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <select
              {...register('development_id')}
              disabled={isLoadingDevs}
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="">Select Development</option>
              {developments?.map(dev => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>
          </div>
          {errors.development_id && <p className="text-xs text-danger ml-1">{errors.development_id.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Stand Number</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        {...register('stand_number')}
                        placeholder="402"
                        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                {errors.stand_number && <p className="text-xs text-danger ml-1">{errors.stand_number.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Size (sqm)</label>
                <div className="relative">
                    <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        {...register('size_sqm', { valueAsNumber: true })}
                        type="number"
                        placeholder="400"
                        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                {errors.size_sqm && <p className="text-xs text-danger ml-1">{errors.size_sqm.message}</p>}
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Price</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                    {...register('price_usd', { valueAsNumber: true })}
                    type="number"
                    placeholder="12000"
                    className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Phase</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        {...register('phase')}
                        placeholder="Phase 1"
                        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Status</label>
                <select
                    {...register('status')}
                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="allocated">Allocated</option>
                    <option value="on_hold">On Hold</option>
                </select>
            </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full py-6" isLoading={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            'Add Stand to Inventory'
          )}
        </Button>
      </div>
    </form>
  )
}
