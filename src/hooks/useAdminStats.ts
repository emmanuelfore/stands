import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // 1. Get total revenue (sum of all verified payments)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('status', 'verified');
      
      const totalRevenue = payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 2. Get active buyers count
      const { count: buyersCount } = await supabase
        .from('buyers')
        .select('*', { count: 'exact', head: true });

      // 3. Get available stands
      const { count: standsCount } = await supabase
        .from('stands')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // 4. Pending Verification
      const { count: pendingCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // 5. Verification Queue (fetch limited pending items)
      const { data: queue } = await supabase
        .from('payments')
        .select(`
            id, amount, created_at, status, 
            buyer:buyers(full_name),
            allocation:allocations(stand:stands(development:developments(name)))
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalRevenue,
        activeBuyers: buyersCount || 0,
        availableStands: standsCount || 0,
        pendingVerification: pendingCount || 0,
        queue: queue || []
      };
    }
  });
}
