import { axiosInstance } from '@/configs/axios.config'
import { BookmarksListSearchParamsInterface } from '@/types/bookmarks.types'

/**
 * 북마크 목록 조회
 * @returns
 */
export const getBookmarks = (
  params: BookmarksListSearchParamsInterface | null
) => {
  return axiosInstance
    .get(
      `/api/bookmarks?page=${params?.page}&sort=${params?.sort}&q=${params?.q}`
    )
    .then((res) => res.data)
}
