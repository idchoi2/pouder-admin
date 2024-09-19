import { axiosInstance } from '@/configs/axios.config'
import { FolderCreateRequest } from '@/types/request.types'

/**
 * 팀내 폴더 조회
 * @param teamId
 * @returns
 */
export const getFoldersOfTeam = (teamId: string) => {
  return axiosInstance
    .get(`/api/teams/${teamId}/folders`)
    .then((res) => res.data)
}

/*
 * 팀내 새 폴더 추가
 * @param teamId
 * @param req
 * @returns
 */
export const createFolderForTeam = (
  teamId: string,
  req: FolderCreateRequest
) => {
  return axiosInstance
    .post(`/api/teams/${teamId}/folders`, req)
    .then((res) => res.data)
}
