import { axiosInstance } from '@/configs/axios.config'

/**
 * Check my account information
 * @returns
 */
export const checkAccount = () => {
  return axiosInstance.get(`/api/account`).then((res) => res.data)
}
