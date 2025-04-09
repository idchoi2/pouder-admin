import { axiosInstance } from '@/configs/axios.config'
import { FoldersListSearchParamsInterface } from '@/types/folders.types'

/**
 * 폴더 목록 조회
 * @returns
 */
export const getFolders = (params: FoldersListSearchParamsInterface | null) => {
  return axiosInstance
    .get(
      `/api/folders?page=${params?.page}&sort=${params?.sort}&q=${params?.q}`
    )
    .then((res) => res.data)
}
