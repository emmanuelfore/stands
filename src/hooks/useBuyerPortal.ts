import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useBuyerPortal() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['buyer', 'profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('buyers')
        .select(`
          *,
          allocations (
            *,
            stand:stands (
                stand_number,
                development:developments (*)
            ),
            schedule:payment_schedule_items (*)
          )
        `)
        .eq('email', user.email)
        .single()
      
      if (error) throw error
      return data
    }
  })

  // Calculate Status & Progress
  const allocation = profile?.allocations?.[0]
  const schedule = allocation?.schedule || []
  
  const totalDue = schedule.reduce((sum: number, item: any) => sum + item.amount_due, 0)
  const totalPaid = schedule
    .filter((item: any) => item.status === 'paid')
    .reduce((sum: number, item: any) => sum + item.amount_due, 0)
  
  const progressPercent = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0
  
  const overdueCount = schedule.filter((item: any) => item.status === 'overdue').length
  const upcomingDueCount = schedule.filter((item: any) => {
    if (item.status !== 'pending') return false
    const duedate = new Date(item.due_date)
    const in7Days = new Date()
    in7Days.setDate(in7Days.getDate() + 7)
    return duedate <= in7Days
  }).length

  let status: 'behind' | 'at-risk' | 'on-track' | 'ahead' = 'on-track'
  if (overdueCount > 0) status = 'behind'
  else if (upcomingDueCount > 0) status = 'at-risk'
  else if (progressPercent > 50) status = 'ahead' // Simplified logic for demo

  return {
    profile,
    allocation,
    schedule,
    isLoadingProfile,
    stats: {
        totalDue,
        totalPaid,
        progressPercent,
        status
    }
  }
}
