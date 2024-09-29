import { getUsers, sendApprovalEmail, toggleBetaUser } from '@/api/users.api'
import { useToast } from '@/components/ui/use-toast'
import {
  UsersListSearchInterface,
  UsersListSearchParamsInterface,
} from '@/types/users.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const USER_KEY = 'users'

export const useUsersList = (params: UsersListSearchParamsInterface | null) => {
  return useQuery({
    queryKey: [USER_KEY, params],
    queryFn: async () => {
      return params ? await getUsers(params) : []
    },
    select: (data) => data as UsersListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}

export const useToggleBetaUser = (
  params: UsersListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [USER_KEY, params],
    mutationFn: (userId: string) => toggleBetaUser(userId),
    onSuccess: (userId: string) => {
      const oldUsersList = queryClient.getQueryData<UsersListSearchInterface>([
        USER_KEY,
        params,
      ])

      queryClient.setQueryData([USER_KEY, params], {
        ...oldUsersList,
        list: oldUsersList?.list.map((user) =>
          user.id === userId
            ? {
                ...user,
                beta: {
                  ...user.beta,
                  is_approved: !user.beta?.is_approved,
                },
              }
            : user
        ),
      })
    },
  })
}

export const useSendBetaApprovalEmail = (
  params: UsersListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationKey: [USER_KEY, params],
    mutationFn: (userId: string) => sendApprovalEmail(userId),
    onSuccess: (userId: string) => {
      const oldUsersList = queryClient.getQueryData<UsersListSearchInterface>([
        USER_KEY,
        params,
      ])

      queryClient.setQueryData([USER_KEY, params], {
        ...oldUsersList,
        list: oldUsersList?.list.map((user) =>
          user.id === userId
            ? {
                ...user,
                beta: {
                  ...user.beta,
                  is_sent: true,
                },
              }
            : user
        ),
      })

      toast({
        title: 'Success',
        description: '승인 메일을 발송하였습니다.',
      })
    },
  })
}
