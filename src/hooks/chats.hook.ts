import { getChatConversations, getChats } from '@/api'
import { ChatsListSearchParamsInterface } from '@/types'
import {
  ChatConversationsListSearchInterface,
  ChatsListSearchInterface,
} from '@/types/chats.types'
import { useQuery } from '@tanstack/react-query'

export const CHAT_CONVERSATION_KEY = 'chat_conversations'
export const CHAT_KEY = 'chats'

export const useChatConversationsList = (
  params: ChatsListSearchParamsInterface | null
) => {
  return useQuery({
    queryKey: [CHAT_CONVERSATION_KEY, params],
    queryFn: async () => {
      return params ? await getChatConversations(params) : []
    },
    select: (data) => data as ChatConversationsListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}

export const useChatsList = (chatConvewrsationId: string) => {
  return useQuery({
    queryKey: [CHAT_KEY, chatConvewrsationId],
    queryFn: async () => {
      return chatConvewrsationId ? await getChats(chatConvewrsationId) : []
    },
    select: (data) => data as ChatsListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}

export const useResetChatsList = () => {
  return useQuery({
    queryKey: [CHAT_KEY],
    queryFn: async () => {
      return {
        hasMore: true,
        list: [],
      }
    },
    initialData: {
      hasMore: true,
      list: [],
    },
    refetchOnWindowFocus: false,
    enabled: false,
  })
}
