import { createSite, deleteSite, getSites, updateSite } from '@/api/sites.api'
import { useToast } from '@/components/ui/use-toast'
import { sitesFormAtom } from '@/states/atoms/sites.atoms'
import {
  SitesFormInterface,
  SitesListSearchInterface,
  SitesListSearchParamsInterface,
} from '@/types'
import { sites } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetRecoilState } from 'recoil'

export const SITE_KEY = 'sites'

export const useSitesList = (params: SitesListSearchParamsInterface | null) => {
  return useQuery({
    queryKey: [SITE_KEY, params],
    queryFn: async () => {
      return params ? await getSites(params) : []
    },
    select: (data) => data as SitesListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}

export const useCreateSite = (
  params: SitesListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const setSitesForm = useSetRecoilState(sitesFormAtom)

  return useMutation({
    mutationKey: [SITE_KEY, params],
    mutationFn: async (req: SitesFormInterface) => {
      return await createSite(req)
    },
    onSuccess: (newSite: sites) => {
      queryClient.invalidateQueries({ queryKey: [SITE_KEY, params] })

      toast({
        title: 'Success',
        description: 'Site created successfully',
      })

      setSitesForm(false)
    },
  })
}

export const useUpdateSite = (
  params: SitesListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const setSitesForm = useSetRecoilState(sitesFormAtom)

  return useMutation({
    mutationKey: [SITE_KEY, params],
    mutationFn: async (req: SitesFormInterface) => {
      return await updateSite(req)
    },
    onSuccess: (newSite: sites) => {
      queryClient.invalidateQueries({ queryKey: [SITE_KEY, params] })

      toast({
        title: 'Success',
        description: 'Site updated successfully',
      })
      setSitesForm(false)
    },
  })
}

export const useDeleteSite = (
  params: SitesListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [SITE_KEY, params],
    mutationFn: async (id: number) => {
      return await deleteSite(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SITE_KEY, params] })

      toast({
        title: 'Success',
        description: 'Site deleted successfully',
      })
    },
  })
}
