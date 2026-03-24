import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Payment } from '../types'

export function usePayments() {
  const queryClient = useQueryClient()

  const { data: pendingPayments, isLoading: isLoadingPending } = useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          buyer:buyers (full_name, email),
          allocation:allocations (
            stand:stands (stand_number, development:developments (name))
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const verifyPayment = useMutation({
    mutationFn: async ({ id, status, note }: { id: string, status: 'verified' | 'rejected', note?: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          status, 
          rejection_note: note, 
          verified_at: new Date().toISOString(),
          // verified_by should come from auth.uid() in RLS/Trigger
        })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })

  return {
    pendingPayments,
    isLoadingPending,
    verifyPayment,
  }
}
