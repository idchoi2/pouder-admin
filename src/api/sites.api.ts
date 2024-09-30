import { axiosInstance } from '@/configs/axios.config'
import { SitesListSearchParamsInterface } from '@/types'
import { SitesFormInterface } from '@/types/sites.types'

/**
 * 사이트 목록 조회
 * @returns
 */
export const getSites = (params: SitesListSearchParamsInterface | null) => {
  return axiosInstance
    .get(`/api/sites?page=${params?.page}&sort=${params?.sort}&q=${params?.q}`)
    .then((res) => res.data)
}

/**
 * 사이트 생성
 * @param data
 * @returns
 */
export const createSite = (data: SitesFormInterface) => {
  return axiosInstance.post('/api/sites', data).then((res) => res.data)
}

/**
 * 사이트 수정
 */
export const updateSite = (data: SitesFormInterface) => {
  return axiosInstance
    .put(`/api/sites/${data.id}`, data)
    .then((res) => res.data)
}

/**
 * 사이트 삭제
 */
export const deleteSite = (id: number) => {
  return axiosInstance.delete(`/api/sites/${id}`).then((res) => res.data)
}
