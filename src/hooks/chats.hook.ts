import { getChats } from '@/api'
import {
  ChatsListSearchInterface,
  ChatsListSearchParamsInterface,
} from '@/types'
import { useQuery } from '@tanstack/react-query'

export const CHAT_KEY = 'chats'

export const useChatsList = (params: ChatsListSearchParamsInterface | null) => {
  return useQuery({
    queryKey: [CHAT_KEY, params],
    queryFn: async () => {
      return params ? await getChats(params) : []
    },
    select: (data) => data as ChatsListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}
