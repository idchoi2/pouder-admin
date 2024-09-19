import { AccountInterface } from '@/types'
import { User } from '@supabase/supabase-js'
import { atom } from 'recoil'

export const authAtom = atom<User | null>({
  key: 'auth',
  default: null,
})

export const meAtom = atom<AccountInterface | null>({
  key: 'me',
  default: null,
})
