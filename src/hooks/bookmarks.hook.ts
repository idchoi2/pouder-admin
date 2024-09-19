import {
  deleteBookmark,
  getBookmarksFields,
  getBookmarksOfTeam,
} from '@/api/bookmarks.api'
import { useToast } from '@/components/ui/use-toast'
import { TEAM_TAGS_KEY, TEAM_WEBSITE_FIELDS_KEY } from '@/hooks/teams.hook'
import { newGeneratedBookmarkAtom } from '@/states/atoms/bookmark.atoms'
import { AxiosErrorInterface } from '@/types'
import {
  BookmarksInterface,
  BookmarksPaginationInterface,
} from '@/types/database.types'
import { BookmarkListParamsInterface } from '@/types/request.types'
import { getErrorToastMessage } from '@/utils/validation'
import { bookmark_fields } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'

export const BOOKMARK_KEY = 'bookmarks'
export const BOOKMARK_FIELDS_KEY = 'bookmarks_fields'

export const useBookmarksFieldsList = () => {
  return useQuery({
    queryKey: [BOOKMARK_FIELDS_KEY],
    queryFn: async () => {
      return getBookmarksFields()
    },
    select: (data) => data as bookmark_fields[],
    refetchOnWindowFocus: false,
  })
}

export const useBookmarksList = (
  bookmarkListParams: BookmarkListParamsInterface
) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: [BOOKMARK_KEY, bookmarkListParams],
    queryFn: async () => {
      const oldBookmarksPagination =
        queryClient.getQueryData<BookmarksPaginationInterface>([
          BOOKMARK_KEY,
          bookmarkListParams,
        ]) as BookmarksPaginationInterface

      const hasMore = oldBookmarksPagination.hasMore

      const lastId =
        oldBookmarksPagination.list && oldBookmarksPagination.list.length > 0
          ? oldBookmarksPagination.list[oldBookmarksPagination.list.length - 1]
              .id
          : null

      if (!hasMore || !bookmarkListParams.teamId) return oldBookmarksPagination

      const newBookmarsPagination = await getBookmarksOfTeam(
        bookmarkListParams.teamId,
        lastId,
        bookmarkListParams.bookmarkField,
        bookmarkListParams.tag
      )

      newBookmarsPagination.list = [
        ...oldBookmarksPagination.list,
        ...newBookmarsPagination.list,
      ]

      return newBookmarsPagination
    },
    initialData: {
      hasMore: true,
      list: [],
    },
    select: (data) => data as BookmarksPaginationInterface,
    refetchOnWindowFocus: false,
  })
}

export const useCreateBookmark = (
  bookmarkListParams: BookmarkListParamsInterface
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [newGeneratedBookmark, setNewGeneratedBookmark] = useRecoilState(
    newGeneratedBookmarkAtom
  )

  return useMutation({
    mutationKey: [BOOKMARK_KEY, bookmarkListParams],
    mutationFn: async (req: BookmarksInterface) => {
      return req
    },
    onSuccess: (newBookmark: BookmarksInterface) => {
      const oldBookmarksPagination =
        queryClient.getQueryData<BookmarksPaginationInterface>([
          BOOKMARK_KEY,
          bookmarkListParams,
        ]) as BookmarksPaginationInterface

      if (
        !bookmarkListParams.bookmarkField ||
        bookmarkListParams.bookmarkField === newBookmark.website_field
      ) {
        queryClient.setQueryData([BOOKMARK_KEY, bookmarkListParams], {
          ...oldBookmarksPagination,
          list: [newBookmark, ...oldBookmarksPagination.list],
        })
      }

      setNewGeneratedBookmark(null)
      queryClient.invalidateQueries({ queryKey: [TEAM_TAGS_KEY] })
      queryClient.invalidateQueries({ queryKey: [TEAM_WEBSITE_FIELDS_KEY] })
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}

export const useUpdateBookmark = (
  bookmarkListParams: BookmarkListParamsInterface
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [BOOKMARK_KEY, bookmarkListParams],
    mutationFn: async (req: BookmarksInterface) => {
      return req
    },
    onSuccess: (updatedBookmark: BookmarksInterface) => {
      const oldBookmarksPagination =
        queryClient.getQueryData<BookmarksPaginationInterface>([
          BOOKMARK_KEY,
          bookmarkListParams,
        ]) as BookmarksPaginationInterface

      queryClient.setQueryData([BOOKMARK_KEY, bookmarkListParams], {
        ...oldBookmarksPagination,
        list: oldBookmarksPagination.list.map((bookmark) =>
          bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
        ),
      })

      // queryClient.invalidateQueries({ queryKey: [TEAM_TAGS_KEY] })
      // queryClient.invalidateQueries({ queryKey: [TEAM_WEBSITE_FIELDS_KEY] })
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}

export const useDeleteBookmark = (
  bookmarkListParams: BookmarkListParamsInterface
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [BOOKMARK_KEY, bookmarkListParams],
    mutationFn: async (bookmarkId: string) => {
      return await deleteBookmark(bookmarkListParams.teamId, bookmarkId)
    },
    onSuccess: (res) => {
      const bookmarkId = res.data
      const oldBookmarksPagination =
        queryClient.getQueryData<BookmarksPaginationInterface>([
          BOOKMARK_KEY,
          bookmarkListParams,
        ]) as BookmarksPaginationInterface

      queryClient.setQueryData([BOOKMARK_KEY, bookmarkListParams], {
        ...oldBookmarksPagination,
        list: oldBookmarksPagination.list.filter(
          (bookmark) => bookmark.id !== bookmarkId
        ),
      })

      queryClient.invalidateQueries({ queryKey: [TEAM_TAGS_KEY] })
      queryClient.invalidateQueries({ queryKey: [TEAM_WEBSITE_FIELDS_KEY] })
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}
