import {
  createTeam,
  getBookmarkFields,
  getMyTeams,
  getTags,
  getWebsiteFields,
  getWebsiteTypes,
  updateTeam,
} from '@/api/teams.api'
import { useToast } from '@/components/ui/use-toast'
import { currentTeamAtom } from '@/states'
import { AxiosErrorInterface } from '@/types/global.types'
import { TeamCreateRequest } from '@/types/request.types'
import { createClient } from '@/utils/supabase/client'
import { getErrorToastMessage } from '@/utils/validation'
import {
  team_bookmark_fields,
  team_tags,
  team_website_fields,
  team_website_types,
  teams as TeamsInterface,
} from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'

export const TEAM_KEY = 'teams'
export const TEAM_TAGS_KEY = 'team_tags'
export const TEAM_WEBSITE_TYPES_KEY = 'team_websiteTypes'
export const TEAM_WEBSITE_FIELDS_KEY = 'team_websiteFields'

export const useMyTeamsList = () => {
  return useQuery({
    queryKey: [TEAM_KEY],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      return data.user ? await getMyTeams() : []
    },
    select: (data) => data as TeamsInterface[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useAddTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [TEAM_KEY],
    mutationFn: (req: TeamCreateRequest) => createTeam(req),
    onSuccess: (data, newTeam) => {
      const oldTeamsList = queryClient.getQueryData<TeamsInterface[]>([
        TEAM_KEY,
      ]) as TeamsInterface[]

      const newAddedTeam = {
        ...JSON.parse(JSON.stringify(newTeam)),
      }

      queryClient.setQueryData<TeamsInterface[]>(
        [TEAM_KEY],
        [...oldTeamsList, newAddedTeam]
      )
    },
  })
}

export const useUpdateTeam = (teamId: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Recoil
  const [currentTeam, setCurrentTeam] = useRecoilState(currentTeamAtom)

  return useMutation({
    mutationKey: [TEAM_KEY],
    mutationFn: (req: any) => updateTeam(teamId, req),
    onSuccess: (updatedTeam) => {
      const oldTeamsList = queryClient.getQueryData<TeamsInterface[]>([
        TEAM_KEY,
      ]) as TeamsInterface[]

      setCurrentTeam(updatedTeam)

      queryClient.setQueryData(
        [TEAM_KEY],
        oldTeamsList?.map((space) =>
          space.id === updatedTeam.id ? updatedTeam : space
        ) as TeamsInterface[]
      )
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}

export const useTeamTagsList = (teamId: string) => {
  return useQuery({
    queryKey: [TEAM_TAGS_KEY],
    queryFn: async () => {
      return getTags(teamId)
    },
    select: (data) => data as team_tags[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useTeamWebsiteTypesList = (teamId: string) => {
  return useQuery({
    queryKey: [TEAM_WEBSITE_TYPES_KEY],
    queryFn: async () => {
      return getWebsiteTypes(teamId)
    },
    select: (data) => data as team_website_types[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useTeamWebsiteFieldsList = (teamId: string) => {
  return useQuery({
    queryKey: [TEAM_WEBSITE_FIELDS_KEY],
    queryFn: async () => {
      return getWebsiteFields(teamId)
    },
    select: (data) => data as team_website_fields[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useTeamBookmarkFieldsList = (teamId: string) => {
  return useQuery({
    queryKey: [TEAM_WEBSITE_FIELDS_KEY],
    queryFn: async () => {
      return getBookmarkFields(teamId)
    },
    select: (data) => data as team_bookmark_fields[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}
