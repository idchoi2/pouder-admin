import { createFolderForTeam, getFoldersOfTeam } from '@/api'
import { useToast } from '@/components/ui/use-toast'
import { FoldersInterface } from '@/types/database.types'
import { AxiosErrorInterface } from '@/types/global.types'
import { FolderCreateRequest } from '@/types/request.types'
import { getErrorToastMessage } from '@/utils/validation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const FOLDER_KEY = 'folders'

export const useFoldersList = (teamId: string) => {
  return useQuery({
    queryKey: [FOLDER_KEY],
    queryFn: async () => {
      return await getFoldersOfTeam(teamId)
    },
    select: (data) => data as FoldersInterface[],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useCreateFolder = (teamId: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [FOLDER_KEY],
    mutationFn: async (req: FolderCreateRequest) => {
      return await createFolderForTeam(teamId, req)
    },
    onSuccess: (data, newFolder) => {
      const oldFoldersList = queryClient.getQueryData<FoldersInterface[]>([
        FOLDER_KEY,
      ]) as FoldersInterface[]

      const newAddedFolder = {
        ...JSON.parse(JSON.stringify(newFolder)),
      }

      queryClient.setQueryData<FoldersInterface[]>(
        [FOLDER_KEY],
        oldFoldersList ? [...oldFoldersList, newAddedFolder] : [newAddedFolder]
      )

      toast({
        title: 'Success',
        description: newFolder.name + ' is added',
      })
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}
