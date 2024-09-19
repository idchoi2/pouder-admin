import { AccountInterface } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { accounts } from '@prisma/client'
import { User } from '@supabase/supabase-js'

/**
 * 로그인 사용자 정보 (null 확인은 middleware 에서 처리)
 * @returns
 */
export const getMe = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user as User
}

/**
 * 로그아웃
 * @param isRefresh
 * @param url
 */
export const setLogout = (isRefresh: boolean = true, url: string = '') => {
  if (typeof window !== 'undefined') {
    if (isRefresh) {
      location.reload()
    } else if (url) {
      location.href = url || '/'
    }
  }
}

/**
 * 계정 정보
 * @param user
 * @param account
 * @returns
 */
export const getAccountWithUser = (user: User, account: accounts) => {
  const accountObj: AccountInterface = {
    email: user.email as string,
    name: account.name,
    bio: account.bio,
    avatar: account.avatar,
    location: account.location,
    preferred_language: account.preferred_language,
  }

  return accountObj
}
