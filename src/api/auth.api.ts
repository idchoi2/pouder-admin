import { axiosInstance } from '@/configs/axios.config'
import { UserAccountUpdateRequest } from '@/types/request.types'

/**
 * Update my account information
 * @returns
 */
export const startAccount = (req: UserAccountUpdateRequest) => {
  return axiosInstance.post(`/api/start`, req).then((res) => res.data)
}

/**
 * Check my account information
 * @returns
 */
export const checkAccount = () => {
  return axiosInstance.get(`/api/account`).then((res) => res.data)
}

/**
 * Update my account information
 * @returns
 */
export const updateAccount = (req: UserAccountUpdateRequest) => {
  return axiosInstance.put(`/api/account`, req).then((res) => res.data)
}

/**
 * Delete my account
 * @returns
 */
export const deleteAcocunt = () => {
  return axiosInstance.delete(`/api/account`).then((res) => res.data)
}
