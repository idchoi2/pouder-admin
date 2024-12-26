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

/**
 * 북마크 키워드 생성
 * @param bookmarkId
 * @returns
 */
export const generateKeywordsForBookmark = (bookmarkId: string) => {
  return axiosInstance
    .put(`/api/bookmarks/${bookmarkId}/keywords`)
    .then((res) => res.data)
}

/**
 * 북마크 Chunks 생성
 * @param bookmarkId
 * @returns
 */
export const generateChunksForBookmark = (bookmarkId: string) => {
  return axiosInstance
    .put(`/api/bookmarks/${bookmarkId}/chunks`)
    .then((res) => res.data)
}
