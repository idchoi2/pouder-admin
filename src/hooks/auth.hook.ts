import {
  checkAccount,
  deleteAcocunt,
  startAccount,
  updateAccount,
} from '@/api/auth.api'
import { useToast } from '@/components/ui/use-toast'
import { meAtom } from '@/states'
import { AccountInterface } from '@/types'
import { AxiosErrorInterface } from '@/types/global.types'
import { getErrorToastMessage } from '@/utils/validation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'

export const ACCOUNT_KEY = 'account'

export const useMyAccount = () => {
  // Recoil
  const [me, setMe] = useRecoilState(meAtom)

  return useQuery({
    queryKey: [ACCOUNT_KEY],
    queryFn: async () => {
      const myAccount = await checkAccount()

      if (myAccount) {
        setMe(myAccount)
      }

      return myAccount
    },
    select: (data) => data as AccountInterface | null,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Recoil
  const [me, setMe] = useRecoilState(meAtom)

  return useMutation({
    mutationKey: [ACCOUNT_KEY],
    mutationFn: (req: any) => updateAccount(req),
    onSuccess: (updatedMe) => {
      setMe(updatedMe)
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}

export const useStartAccount = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Recoil
  const [me, setMe] = useRecoilState(meAtom)

  return useMutation({
    mutationKey: [ACCOUNT_KEY],
    mutationFn: (req: any) => startAccount(req),
    onSuccess: (account: AccountInterface) => {
      setMe(account)
      location.href =
        account.teams && account.teams[0]
          ? `/teams/${account.teams[0].id}`
          : '/'
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Recoil
  const [me, setMe] = useRecoilState(meAtom)

  return useMutation({
    mutationKey: [ACCOUNT_KEY],
    mutationFn: () => deleteAcocunt(),
    onSuccess: () => {
      setTimeout(() => {
        location.href = '/'
      }, 3000)
    },
    onError: (e) => {
      toast(getErrorToastMessage(e as AxiosErrorInterface))
    },
  })
}
