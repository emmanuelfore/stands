import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { startOfMonth, endOfMonth, subMonths, format, isWithinInterval, parseISO } from 'date-fns'

export function useReports() {
  const { data: agedDebt, isLoading: isLoadingDebt } = useQuery({
    queryKey: ['reports', 'aged-debt'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_schedule_items')
        .select(`
          *,
          allocation:allocations (
            buyer:buyers (full_name),
            stand:stands (stand_number, development:developments (name))
          )
        `)
        .eq('status', 'overdue')
      
      if (error) throw error

      // Group by 30, 60, 90+ days
      const today = new Date()
      const buckets: Record<string, number> = {
        '0-30': 0,
        '31-60': 0,
        '61-90': 0,
        '90+': 0
      }

      data.forEach((item: any) => {
        const days = Math.floor((today.getTime() - new Date(item.due_date).getTime()) / (1000 * 60 * 60 * 24))
        if (days <= 30) buckets['0-30'] += item.amount_due
        else if (days <= 60) buckets['31-60'] += item.amount_due
        else if (days <= 90) buckets['61-90'] += item.amount_due
        else buckets['90+'] += item.amount_due
      })

      return buckets
    }
  })

  const { data: collectionRate, isLoading: isLoadingCollection } = useQuery({
    queryKey: ['reports', 'collection-rate'],
    queryFn: async () => {
       // Last 6 months collection trend
       const months = Array.from({ length: 6 }).map((_, i) => {
           const date = subMonths(new Date(), i)
           return {
               month: format(date, 'MMM yyyy'),
               start: startOfMonth(date),
               end: endOfMonth(date),
               expected: 0,
               actual: 0
           }
       }).reverse()

       const { data: schedule, error: sError } = await supabase
        .from('payment_schedule_items')
        .select('*')
       
       if (sError) throw sError

       schedule.forEach(item => {
           const itemDate = parseISO(item.due_date)
           months.forEach(m => {
               if (isWithinInterval(itemDate, { start: m.start, end: m.end })) {
                   m.expected += item.amount_due
                   if (item.status === 'paid') m.actual += item.amount_due
               }
           })
       })

       return months.map(m => ({
           month: m.month,
           expected: m.expected,
           actual: m.actual,
           rate: m.expected > 0 ? (m.actual / m.expected) * 100 : 0
       }))
    }
  })

  return {
    agedDebt,
    collectionRate,
    isLoading: isLoadingDebt || isLoadingCollection
  }
}
