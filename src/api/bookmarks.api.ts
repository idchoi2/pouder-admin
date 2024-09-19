import { axiosInstance } from '@/configs/axios.config'
import {
  BookmarkCheckRequest,
  BookmarkCreateRequest,
} from '@/types/request.types'

/**
 * 북마크 필드 조회
 * @param teamId
 * @returns
 */
export const getBookmarksFields = () => {
  return axiosInstance.get(`/api/fields`, {}).then((res) => res.data)
}

/**
 * 팀내 북마크 조회
 * @param teamId
 * @returns
 */
export const getBookmarksOfTeam = (
  teamId: string,
  lastId: string | null,
  bookmarkField: string,
  tag: string
) => {
  return axiosInstance
    .get(
      `/api/teams/${teamId}/bookmarks?lastId=${
        lastId ? lastId : ''
      }&bookmarkField=${bookmarkField}&tag=${tag}`,
      {
        headers: {
          cache: 'no-cache',
        },
      }
    )
    .then((res) => res.data)
}

/*
 * 북마크 확인
 * @param teamId
 * @param req
 * @returns
 */
export const checkBookmarkForTeam = (
  teamId: string,
  req: BookmarkCheckRequest
) => {
  return axiosInstance
    .post(`/api/teams/${teamId}/bookmarks/check`, req)
    .then((res) => res.data)
}

/*
 * 팀내 새 북마크 추가
 * @param teamId
 * @param req
 * @returns
 */
export const createBookmarkForTeam = (
  teamId: string,
  req: BookmarkCreateRequest
) => {
  return axiosInstance
    .post(`/api/teams/${teamId}/bookmarks`, req)
    .then((res) => res.data)
}

/**
 * 북마크 삭제
 * @param teamId
 * @param bookmarkId
 * @returns
 */
export const deleteBookmark = (teamId: string, bookmarkId: string) => {
  return axiosInstance.delete(`/api/teams/${teamId}/bookmarks/${bookmarkId}`)
}
