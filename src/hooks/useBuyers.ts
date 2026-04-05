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

  const createBuyers = useMutation({
    mutationFn: async (newBuyers: Partial<Buyer>[]) => {
      const { data, error } = await supabase
        .from('buyers')
        .insert(newBuyers)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
    },
  })

  const importWithAllocations = useMutation({
    mutationFn: async (rows: any[]) => {
      // Basic manual transaction-like loop
      for (const row of rows) {
        // 1. Insert buyer
        const { data: newBuyer, error: buyerErr } = await supabase
          .from('buyers')
          .insert([{ 
            org_id: row.org_id, 
            full_name: row.full_name, 
            email: row.email, 
            id_number: row.id_number,
            phone: row.phone,
            onboarding_complete: false
          }])
          .select()
          .single()
        
        if (buyerErr) continue

        // 2. If stand specs exist, insert or find development -> stand
        if (row.stand_number && row.development_id && row.size_sqm) {
          const { data: newStand, error: standErr } = await supabase
            .from('stands')
            .insert([{
              development_id: row.development_id,
              stand_number: row.stand_number.toString(),
              size_sqm: Number(row.size_sqm),
              price_usd: Number(row.price_usd || 0),
              status: 'allocated'
            }])
            .select()
            .single()

          if (!standErr && newStand) {
            // 3. Create allocation
            const { data: alloc } = await supabase
               .from('allocations')
               .insert([{
                  stand_id: newStand.id,
                  buyer_id: newBuyer.id,
                  purchase_price: newStand.price_usd || 0,
                  deposit_amount: Number(row.deposit_amount || 0),
                  currency: 'USD',
                  status: 'active'
               }])
               .select()
               .single()

            // 4. Record deposit payment if applicable
            if (alloc && Number(row.deposit_amount || 0) > 0) {
                await supabase.from('payments').insert([{
                    allocation_id: alloc.id,
                    buyer_id: newBuyer.id,
                    amount: alloc.deposit_amount,
                    currency: 'USD',
                    payment_method: 'bank_transfer',
                    status: 'verified',
                    submitted_by: 'admin'
                }])
            }
          }
        }
      }
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      queryClient.invalidateQueries({ queryKey: ['stands'] })
    }
  })

  return {
    buyers,
    isLoading,
    error,
    createBuyer,
    createBuyers,
    importWithAllocations
  }
}
