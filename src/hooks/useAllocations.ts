import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { generatePaymentSchedule } from '../utils/finance'

export function useAllocations() {
  const queryClient = useQueryClient()

  const { data: allocations, isLoading } = useQuery({
    queryKey: ['allocations', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allocations')
        .select(`
          *,
          buyer:buyers (full_name, id_number),
          stand:stands (stand_number, development:developments (name))
        `)
        .eq('status', 'active')
      if (error) throw error
      return data
    },
  })

  const allocateStand = useMutation({
    mutationFn: async ({ 
      standId, 
      buyerId, 
      price, 
      deposit, 
      installments,
      startDate
    }: { 
      standId: string, 
      buyerId: string, 
      price: number, 
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
          currency: 'USD',
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
        currency: 'USD',
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

  const transferAllocation = useMutation({
    mutationFn: async ({ 
      allocationId, 
      newBuyerId, 
    }: { 
      allocationId: string, 
      newBuyerId: string, 
    }) => {
      // 1. Get existing allocation details
      const { data: oldAlloc, error: fetchError } = await supabase
        .from('allocations')
        .select('*, stands(*)')
        .eq('id', allocationId)
        .single()
      
      if (fetchError) throw fetchError

      // 2. Mark old allocation as transferred
      const { error: updateError } = await supabase
        .from('allocations')
        .update({ status: 'transferred' })
        .eq('id', allocationId)
      
      if (updateError) throw updateError

      // 3. Create new allocation for new buyer
      // We start a fresh schedule for the new buyer based on the same price/deposit 
      // OR we carry over the balance. Let's start fresh for now as per typical cession.
      const { data: newAlloc, error: createError } = await supabase
        .from('allocations')
        .insert([{
          stand_id: oldAlloc.stand_id,
          buyer_id: newBuyerId,
          purchase_price: oldAlloc.purchase_price,
          currency: oldAlloc.currency,
          deposit_amount: oldAlloc.deposit_amount,
          status: 'active'
        }])
        .select()
        .single()
      
      if (createError) throw createError

      return newAlloc
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
    }
  })

  return { allocations, isLoading, allocateStand, transferAllocation }
}
