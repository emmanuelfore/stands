import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Organization } from '../types'

export function useOrganization() {
  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      // For now, we fetch the first organization. 
      // In a real multi-tenant app, this would be based on the logged-in admin's profile.
      let { data, error } = await supabase
        .from('organizations')
        .select('*')
        .limit(1)
        .maybeSingle()
      
      if (error) throw error

      if (!data) {
        // Create default org if not exists
        const { data: newOrg, error: createError } = await supabase
          .from('organizations')
          .insert([{ name: 'StandVault Inc', logo_url: '' }])
          .select()
          .single()
        
        if (createError) throw createError
        return newOrg as Organization
      }

      return data as Organization
    }
  })

  return {
    organization,
    isLoading,
    error
  }
}
