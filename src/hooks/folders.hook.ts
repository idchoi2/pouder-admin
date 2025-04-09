import { getFolders } from '@/api/folders.api'
import {
  FoldersListSearchInterface,
  FoldersListSearchParamsInterface,
} from '@/types/folders.types'
import { useQuery } from '@tanstack/react-query'

export const FOLDER_KEY = 'folders'

export const useFoldersList = (
  params: FoldersListSearchParamsInterface | null
) => {
  return useQuery({
    queryKey: [FOLDER_KEY, params],
    queryFn: async () => {
      return params ? await getFolders(params) : []
    },
    select: (data) => data as FoldersListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}
