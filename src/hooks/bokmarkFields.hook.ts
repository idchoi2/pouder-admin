import { getBookmarkFields } from '@/api/bookmarkFields.api'
import { BookmarkFieldsInterface } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const BOOKMARK_FIELD_KEY = 'bokmarkFields'

export const useBookmarkFieldsList = () => {
  return useQuery({
    queryKey: [BOOKMARK_FIELD_KEY],
    queryFn: async () => {
      return await getBookmarkFields()
    },
    select: (data) => data as BookmarkFieldsInterface[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}
