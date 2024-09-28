import { UsersListSearchParamsInterface } from '@/types'
import { atom } from 'recoil'

/**
 * 유저 목록 파라미터
 */
export const usersListParamsAtom = atom<UsersListSearchParamsInterface | null>({
  key: 'usersListParams',
  default: null,
})
