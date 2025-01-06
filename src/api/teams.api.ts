import { axiosInstance } from '@/configs/axios.config'
import { TeamsListSearchParamsInterface } from '@/types/teams.types'

/**
 * 팀 목록 조회
 * @returns
 */
export const getTeams = (params: TeamsListSearchParamsInterface | null) => {
  return axiosInstance
    .get(
      `/api/teams?page=${params?.page}&sort=${params?.sort}&q=${params?.q}&plan=${params?.plan}`
    )
    .then((res) => res.data)
}

/**
 * 팀 카테고리 갯수 재계산
 * @param teamId
 * @returns
 */
export const recalculateTeamsBookmarkFields = (teamId: string) => {
  return axiosInstance
    .put(`/api/teams/${teamId}/bookmark_fields`)
    .then((res) => res.data)
}
