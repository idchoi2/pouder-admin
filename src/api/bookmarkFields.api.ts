import { axiosInstance } from '@/configs/axios.config'

/**
 * 북마크 필드 목록 조회
 * @returns
 */
export const getBookmarkFields = () => {
  return axiosInstance.get(`/api/bookmark_fields`).then((res) => res.data)
}

/**
 * 북마크 필드 병합
 * @param selectedField
 * @param targetField
 * @returns
 */
export const mergeBookmarkFields = (
  selectedField: string,
  targetField: string
) => {
  return axiosInstance
    .put(`/api/bookmark_fields`, { selectedField, targetField })
    .then((res) => res.data)
}
