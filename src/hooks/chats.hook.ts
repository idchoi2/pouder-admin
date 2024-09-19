import {
  deleteChat,
  getChatsOfTeam,
  searchBookmarkForTeam,
} from '@/api/chats.api'
import { useToast } from '@/components/ui/use-toast'
import { addDateLabelToChatsList } from '@/lib/utils'
import { AxiosErrorInterface } from '@/types'
import {
  ChatsInterface,
  ChatsPaginationInterface,
} from '@/types/database.types'
import { SearchRequest } from '@/types/request.types'
import { getErrorToastMessage } from '@/utils/validation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const CHAT_KEY = 'chats'

export const useChatsList = (teamId: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: [CHAT_KEY],
    queryFn: async () => {
      const oldChatsPagination =
        queryClient.getQueryData<ChatsPaginationInterface>([
          CHAT_KEY,
        ]) as ChatsPaginationInterface

      const hasMore = oldChatsPagination.hasMore

      const lastId =
        oldChatsPagination.list && oldChatsPagination.list.length > 0
          ? oldChatsPagination.list[oldChatsPagination.list.length - 1].id
          : null

      if (!hasMore) return oldChatsPagination

      const newBookmarsPagination = await getChatsOfTeam(teamId, lastId)

      newBookmarsPagination.list = addDateLabelToChatsList([
        ...oldChatsPagination.list,
        ...newBookmarsPagination.list,
      ])

      return newBookmarsPagination
    },
    initialData: {
      hasMore: true,
      list: [],
    },
    select: (data) => data as ChatsPaginationInterface,
    refetchOnWindowFocus: false,
  })
}

export const useSearchBookmark = (teamId: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [CHAT_KEY],
    mutationFn: async (req: SearchRequest) => {
      return await searchBookmarkForTeam(teamId, req)
    },
    onSuccess: (newChat: ChatsInterface) => {
      const oldChatsPagination =
        queryClient.getQueryData<ChatsPaginationInterface>([
          CHAT_KEY,
        ]) as ChatsPaginationInterface

      queryClient.setQueryData([CHAT_KEY], {
        ...oldChatsPagination,
        list: addDateLabelToChatsList([newChat, ...oldChatsPagination.list]),
      })
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}

export const useDeleteChat = (teamId: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [CHAT_KEY],
    mutationFn: async (chatId: string) => {
      return await deleteChat(teamId, chatId)
    },
    onSuccess: (chatId: string) => {
      const oldChatsPagination =
        queryClient.getQueryData<ChatsPaginationInterface>([
          CHAT_KEY,
        ]) as ChatsPaginationInterface

      queryClient.setQueryData([CHAT_KEY], {
        ...oldChatsPagination,
        list: addDateLabelToChatsList(
          oldChatsPagination.list.filter((chat) => chat.id !== chatId)
        ),
      })
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}
