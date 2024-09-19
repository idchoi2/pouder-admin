import { axiosInstance } from '@/configs/axios.config'
import { SearchRequest } from '@/types/request.types'

/**
 * 채팅 내역 조회
 * @param teamId
 * @returns
 */
export const getChatsOfTeam = (teamId: string, lastId: string | null) => {
  return axiosInstance
    .get(`/api/teams/${teamId}/chats?lastId=${lastId ? lastId : ''}`)
    .then((res) => res.data)
}

/*
 * 검색 채팅 추가
 * @param teamId
 * @param req
 * @returns
 */
export const searchBookmarkForTeam = (teamId: string, req: SearchRequest) => {
  return axiosInstance
    .post(`/api/teams/${teamId}/chats`, req)
    .then((res) => res.data)
}

/**
 * 채팅 삭제
 * @param teamId
 * @param chatId
 * @returns
 */
export const deleteChat = (teamId: string, chatId: string) => {
  return axiosInstance
    .delete(`/api/teams/${teamId}/chats/${chatId}`)
    .then((res) => res.data)
}
