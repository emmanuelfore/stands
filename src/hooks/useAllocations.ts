import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { generatePaymentSchedule } from '../utils/finance'

export function useAllocations() {
  const queryClient = useQueryClient()

  const allocateStand = useMutation({
    mutationFn: async ({ 
      standId, 
      buyerId, 
      price, 
      currency, 
      deposit, 
      installments,
      startDate
    }: { 
      standId: string, 
      buyerId: string, 
      price: number, 
      currency: 'USD' | 'ZWG',
      deposit: number,
      installments: number,
      startDate: string
    }) => {
      // 1. Create Allocation
      const { data: allocation, error: allocError } = await supabase
        .from('allocations')
        .insert([{
          stand_id: standId,
          buyer_id: buyerId,
          purchase_price: price,
          currency,
          deposit_amount: deposit,
          status: 'active'
        }])
        .select()
        .single()

      if (allocError) throw allocError

      // 2. Update Stand Status
      const { error: standError } = await supabase
        .from('stands')
        .update({ status: 'allocated' })
        .eq('id', standId)
      
      if (standError) throw standError

      // 3. Generate and insert schedule items
      const schedule = generatePaymentSchedule(price, deposit, installments, startDate)
      const scheduleItems = schedule.map(item => ({
        allocation_id: allocation.id,
        due_date: item.due_date,
        amount_due: item.amount_due,
        currency,
        status: 'pending'
      }))

      const { error: scheduleError } = await supabase
        .from('payment_schedule_items')
        .insert(scheduleItems)
      
      if (scheduleError) throw scheduleError

      return allocation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stands'] })
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
    }
  })

  return { allocateStand }
}
