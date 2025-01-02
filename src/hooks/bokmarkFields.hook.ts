import {
  getBookmarkFields,
  getBookmarkFieldsFromEdgeConbfig,
} from '@/api/bookmarkFields.api'
import { BookmarkFieldsInterface } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const BOOKMARK_FIELD_KEY = 'bokmarkFields'
export const BOOKMARK_FIELD_FROM_EDGE_CONFIG_KEY = 'bokmarkFieldsFromEdgeConfig'

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

export const useBookmarkFieldsFromEdgeConfig = () => {
  return useQuery({
    queryKey: [BOOKMARK_FIELD_FROM_EDGE_CONFIG_KEY],
    queryFn: async () => {
      return await getBookmarkFieldsFromEdgeConbfig()
    },
    select: (data) => data as BookmarkFieldsInterface[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}
