import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Stand } from '../types'

export function useStands(developmentId?: string) {
  const queryClient = useQueryClient()

  const { data: stands, isLoading, error } = useQuery({
    queryKey: ['stands', developmentId],
    queryFn: async () => {
      let query = supabase
        .from('stands')
        .select(`
          *,
          development:developments (name)
        `)
        .order('stand_number', { ascending: true })
      
      if (developmentId) {
        query = query.eq('development_id', developmentId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Stand[]
    },
  })

  const updateStandStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('stands')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stands'] })
    },
  })

  const createStand = useMutation({
    mutationFn: async (newStand: Partial<Stand>) => {
      const { data, error } = await supabase
        .from('stands')
        .insert([newStand])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stands'] })
    },
  })

  const createStands = useMutation({
    mutationFn: async (newStands: Partial<Stand>[]) => {
      const { data, error } = await supabase
        .from('stands')
        .insert(newStands)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stands'] })
    },
  })

  return {
    stands,
    isLoading,
    error,
    updateStandStatus,
    createStand,
    createStands,
  }
}
