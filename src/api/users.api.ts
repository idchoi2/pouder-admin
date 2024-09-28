import { axiosInstance } from '@/configs/axios.config'
import { UsersListSearchParamsInterface } from '@/types/users.types'

/**
 * 유저 목록 조회
 * @returns
 */
export const getUsers = (params: UsersListSearchParamsInterface | null) => {
  return axiosInstance
    .get(`/api/users?page=${params?.page}&sort=${params?.sort}&q=${params?.q}`)
    .then((res) => res.data)
}

/**
 * 베타 유저 승인/거부 토글
 * @param userId
 * @returns
 */
export const toggleBetaUser = (userId: string) => {
  return axiosInstance
    .put(`/api/users/beta/toggle/${userId}`)
    .then((res) => res.data)
}
