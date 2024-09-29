import { ChatsListSearchParamsInterface } from '@/types'
import { atom } from 'recoil'

/**
 * 채팅 목록 파라미터
 */
export const chatsListParamsAtom = atom<ChatsListSearchParamsInterface | null>({
  key: 'chatsListParams',
  default: null,
})
