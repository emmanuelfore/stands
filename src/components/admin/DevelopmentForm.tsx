import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Building2, MapPin, DollarSign, Percent, Clock, Loader2 } from 'lucide-react'

const developmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  location: z.string().min(3, 'Location is required'),
  penalty_type: z.enum(['flat', 'percent']),
  penalty_value: z.number().min(0),
  penalty_grace_days: z.number().int().min(0),
  min_deposit_percent: z.number().min(0).max(100),
})

type DevelopmentFormValues = z.infer<typeof developmentSchema>

interface DevelopmentFormProps {
  onSubmit: (data: DevelopmentFormValues) => void
  isLoading?: boolean
}

export const DevelopmentForm: React.FC<DevelopmentFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DevelopmentFormValues>({
    resolver: zodResolver(developmentSchema),
    defaultValues: {
        penalty_type: 'percent',
        penalty_value: 0.1,
        penalty_grace_days: 7,
        min_deposit_percent: 20
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Development Name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              {...register('name')}
              placeholder="Hogerty Hill Phase 2"
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {errors.name && <p className="text-xs text-danger ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              {...register('location')}
              placeholder="Harare, Zimbabwe"
              className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {errors.location && <p className="text-xs text-danger ml-1">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Min Deposit (%)</label>
            <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                    {...register('min_deposit_percent', { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
            </div>
        </div>

        <div className="p-4 bg-bg-base border border-border rounded-xl space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Penalty Configuration</h4>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Type</label>
                    <select
                        {...register('penalty_type')}
                        className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    >
                        <option value="flat">Flat Amount/Day</option>
                        <option value="percent">Percentage/Day</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Value</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            {...register('penalty_value', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Grace Period (Days)</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        {...register('penalty_grace_days', { valueAsNumber: true })}
                        type="number"
                        className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full py-6" isLoading={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            'Launch Development'
          )}
        </Button>
      </div>
    </form>
  )
}
