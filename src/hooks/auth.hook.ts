import { checkAccount } from '@/api/auth.api'
import { meAtom } from '@/states'
import { AccountInterface } from '@/types'
import { useQuery } from '@tanstack/react-query'
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
