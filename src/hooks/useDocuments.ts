import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Document, DocumentCategory, DocumentRequest } from '../types'

export function useDocuments() {
  const queryClient = useQueryClient()

  const { data: documents, isLoading: isLoadingDocs } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          stand:stands (stand_number, development:developments (name)),
          buyer:buyers (full_name)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Document[]
    },
  })

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['document-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          buyer:buyers (full_name, email)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as DocumentRequest[]
    },
  })

  const uploadDocument = useMutation({
    mutationFn: async ({ 
      file, 
      name, 
      category, 
      orgId, 
      standId, 
      buyerId 
    }: { 
      file: File, 
      name: string, 
      category: DocumentCategory, 
      orgId: string,
      standId?: string,
      buyerId?: string
    }) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `vault/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      const { data, error } = await supabase
        .from('documents')
        .insert([{
          org_id: orgId,
          stand_id: standId || null,
          buyer_id: buyerId || null,
          category,
          name,
          file_url: publicUrl,
          version: 1
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('document_requests')
        .update({ 
            status,
            fulfilled_at: status === 'fulfilled' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-requests'] })
    },
  })

  return {
    documents,
    requests,
    isLoadingDocs,
    isLoadingRequests,
    uploadDocument,
    updateRequestStatus,
  }
}
