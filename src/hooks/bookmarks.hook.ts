import { getBookmarks } from '@/api/bookmarks.api'
import {
  BookmarksListSearchInterface,
  BookmarksListSearchParamsInterface,
} from '@/types/bookmarks.types'
import { useQuery } from '@tanstack/react-query'

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
