import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Buyer } from '../types'

export function useBuyers() {
  const queryClient = useQueryClient()

  const { data: buyers, isLoading, error } = useQuery({
    queryKey: ['buyers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buyers')
        .select(`
          *,
          allocations (
            id,
            stand:stands (stand_number, development:developments (name))
          )
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const createBuyer = useMutation({
    mutationFn: async (newBuyer: Partial<Buyer>) => {
      const { data, error } = await supabase
        .from('buyers')
        .insert([newBuyer])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
    },
  })

  return {
    buyers,
    isLoading,
    error,
    createBuyer,
  }
}
