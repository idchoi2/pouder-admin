import { axiosInstance } from '@/configs/axios.config'
import { TeamCreateRequest } from '@/types/request.types'

/**
 * 내 팀 조회
 * @returns
 */
export const getMyTeams = () => {
  return axiosInstance.get(`/api/teams`).then((res) => res.data)
}

/*
 * 팀 추가
 * @param req
 * @returns
 */
export const createTeam = (req: TeamCreateRequest) => {
  return axiosInstance.post(`/api/teams`, req).then((res) => res.data)
}

/**
 * 팀 수정
 * @param teamId
 * @param req
 * @returns
 */
export const updateTeam = (teamId: string, req: any) => {
  return axiosInstance.put(`/api/teams/${teamId}`, req).then((res) => res.data)
}

/**
 * 팀 수정
 * @param teamId
 * @returns
 */
export const deleteTeam = (teamId: string) => {
  return axiosInstance.delete(`/api/teams/${teamId}`)
}

/**
 * 팀의 태그 목록 조회
 * @param teamId
 * @returns
 */
export const getTags = (teamId: string) => {
  return axiosInstance.get(`/api/teams/${teamId}/tags`).then((res) => res.data)
}

/**
 * 팀의 웹사이트 타입 조회
 * @param teamId
 * @returns
 */
export const getWebsiteTypes = (teamId: string) => {
  return axiosInstance
    .get(`/api/teams/${teamId}/website_types`)
    .then((res) => res.data)
}

/**
 * 팀의 웹사이트 필드 조회
 * @param teamId
 * @returns
 */
export const getWebsiteFields = (teamId: string) => {
  return axiosInstance
    .get(`/api/teams/${teamId}/website_fields`)
    .then((res) => res.data)
}

/**
 * 팀의 북마크 필드 조회
 * @param teamId
 * @returns
 */
export const getBookmarkFields = (teamId: string) => {
  return axiosInstance
    .get(`/api/teams/${teamId}/bookmark_fields`)
    .then((res) => res.data)
}
