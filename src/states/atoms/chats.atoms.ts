import {
  ChatConversationsInterface,
  ChatsListSearchParamsInterface,
} from '@/types'
import { atom } from 'recoil'

/**
 * 채팅 목록 파라미터
 */
export const chatsListParamsAtom = atom<ChatsListSearchParamsInterface | null>({
  key: 'chatsListParams',
  default: null,
})

export const openChatConversationModalAtom = atom<boolean>({
  key: 'openChatConversationModal',
  default: false,
})

export const chatConversationInfoAtom = atom<ChatConversationsInterface | null>(
  {
    key: 'chatConversationInfo',
    default: null,
  }
)
