import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Development } from '../types'

export function useDevelopments() {
  const queryClient = useQueryClient()

  const { data: developments, isLoading, error } = useQuery({
    queryKey: ['developments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Development[]
    },
  })

  const createDevelopment = useMutation({
    mutationFn: async (newDevelopment: Partial<Development>) => {
      const { data, error } = await supabase
        .from('developments')
        .insert([newDevelopment])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developments'] })
    },
  })

  return {
    developments,
    isLoading,
    error,
    createDevelopment,
  }
}
