import { getTeams } from '@/api'
import {
  TeamsListSearchInterface,
  TeamsListSearchParamsInterface,
} from '@/types'
import { useQuery } from '@tanstack/react-query'

export const TEAM_KEY = 'teams'

export const useTeamsList = (params: TeamsListSearchParamsInterface | null) => {
  return useQuery({
    queryKey: [TEAM_KEY, params],
    queryFn: async () => {
      return params ? await getTeams(params) : []
    },
    select: (data) => data as TeamsListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}
