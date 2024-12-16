import { axiosInstance } from '@/configs/axios.config'
import { BookmarksListSearchParamsInterface } from '@/types/bookmarks.types'

/**
 * 채팅 대화 목록 조회
 * @returns
 */
export const getChatConversations = (
  params: BookmarksListSearchParamsInterface | null
) => {
  return axiosInstance
    .get(
      `/api/chat_conversations?page=${params?.page}&sort=${params?.sort}&q=${params?.q}`
    )
    .then((res) => res.data)
}

/**
 * 채팅 대화 상세 조회
 * @returns
 */
export const getChats = (chatConversationId: string) => {
  return axiosInstance
    .get(`/api/chat_conversations/${chatConversationId}/chats`)
    .then((res) => res.data)
}
