import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { differenceInDays, parseISO } from 'date-fns'

export function usePenalties() {
  const queryClient = useQueryClient()

  const { data: overdueItems, isLoading } = useQuery({
    queryKey: ['penalties', 'overdue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_schedule_items')
        .select(`
          *,
          allocation:allocations (
            id,
            buyer:buyers (full_name),
            stand:stands (
                stand_number, 
                development:developments (
                    name, 
                    penalty_type, 
                    penalty_value, 
                    penalty_grace_days
                )
            )
          )
        `)
        .eq('status', 'overdue')
      
      if (error) throw error

      // Calculate penalty for each overdue item
      const today = new Date()
      return data.map((item: any) => {
        const dueDate = parseISO(item.due_date)
        const daysOverdue = differenceInDays(today, dueDate)
        const graceDays = item.allocation.stand.development.penalty_grace_days || 0
        
        let penaltyAmount = 0
        if (daysOverdue > graceDays) {
          const effectiveDays = daysOverdue
          const type = item.allocation.stand.development.penalty_type
          const value = item.allocation.stand.development.penalty_value || 0
          
          if (type === 'percent') {
            penaltyAmount = (item.amount_due * (value / 100)) * effectiveDays
          } else {
            penaltyAmount = value * effectiveDays
          }
        }

        return {
          ...item,
          daysOverdue,
          calculatedPenalty: penaltyAmount
        }
      })
    }
  })

  const applyPenalties = useMutation({
    mutationFn: async (penalties: any[]) => {
      const { error } = await supabase
        .from('penalties')
        .insert(penalties.map(p => ({
          allocation_id: p.allocation_id,
          amount: p.calculatedPenalty,
          currency: 'USD',
          reason: `Late payment penalty for due date ${p.due_date} (${p.daysOverdue} days overdue)`,
          status: 'approved',
          applied_at: new Date().toISOString()
        })))
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penalties'] })
    }
  })

  return {
    overdueItems,
    isLoading,
    applyPenalties
  }
}
