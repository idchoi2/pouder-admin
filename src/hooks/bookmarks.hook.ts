import {
  generateChunksForBookmark,
  generateKeywordsForBookmark,
  getBookmarks,
} from '@/api/bookmarks.api'
import { BookmarksInterface } from '@/types'
import {
  BookmarksListSearchInterface,
  BookmarksListSearchParamsInterface,
} from '@/types/bookmarks.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const BOOKMARK_KEY = 'bookmarks'

export const useBookmarksList = (
  params: BookmarksListSearchParamsInterface | null
) => {
  return useQuery({
    queryKey: [BOOKMARK_KEY, params],
    queryFn: async () => {
      return params ? await getBookmarks(params) : []
    },
    select: (data) => data as BookmarksListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}

export const useUpdateKeywordsBookmarks = (
  params: BookmarksListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [BOOKMARK_KEY, params],
    mutationFn: async (bookmarkId: string) => {
      return await generateKeywordsForBookmark(bookmarkId)
    },
    onSuccess: (updatedBookmark: BookmarksInterface) => {
      const oldBookmarksPagination =
        queryClient.getQueryData<BookmarksListSearchInterface>([
          BOOKMARK_KEY,
          params,
        ]) as BookmarksListSearchInterface

      queryClient.setQueryData([BOOKMARK_KEY, params], {
        ...oldBookmarksPagination,
        list: oldBookmarksPagination.list.map((bookmark) =>
          bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
        ),
      })
    },
  })
}

export const useUpdateChunksBookmarks = (
  params: BookmarksListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [BOOKMARK_KEY, params],
    mutationFn: async (bookmarkId: string) => {
      return await generateChunksForBookmark(bookmarkId)
    },
    onSuccess: (generatedChunksCount: number, bookmarkId: string) => {
      const oldBookmarksPagination =
        queryClient.getQueryData<BookmarksListSearchInterface>([
          BOOKMARK_KEY,
          params,
        ]) as BookmarksListSearchInterface

      queryClient.setQueryData([BOOKMARK_KEY, params], {
        ...oldBookmarksPagination,
        list: oldBookmarksPagination.list.map((bookmark) =>
          bookmark.id === bookmarkId
            ? {
                ...bookmark,
                _count: {
                  bookmark_chunks: generatedChunksCount,
                },
              }
            : bookmark
        ),
      })
    },
  })
}
