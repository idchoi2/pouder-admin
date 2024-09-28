import { showErrorJsonResponse } from '@/lib/utils'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { setLogout } from './utils/auth'

/**
 * 로그인 상태가 필요한 페이지
 */
const authUrls = ['/', '/users', '/teams', '/bookmarks', '/searchHistories']

/**
 * 로그아웃 상태가 필요한 페이지
 */
const nonAuthUrls = ['/login']

export async function middleware(request: NextRequest) {
  // URL
  const url = request.nextUrl.pathname

  // Auth
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const isLogin = !(!data || error)

  // Check if user account is admin
  const { data: myAccount } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', data.user?.id)
    .is('is_admin', true)
    .is('deleted_at', null)
    .single()

  // 로그아웃 상태 페이지
  if (nonAuthUrls.includes(url) && isLogin) {
    return NextResponse.redirect(new URL('/', request.url).toString())
  }
  // 로그인 필요 페이지 (/teams)
  else if (authUrls.includes(url) && (!isLogin || !myAccount)) {
    if (isLogin) {
      console.log('로그아웃')
      await setLogout()
      await supabase.auth.signOut()
    }

    return NextResponse.redirect(new URL('/login', request.url))
  }
  // API 로그인 확인
  else if (url.startsWith('/api') && !isLogin) {
    return showErrorJsonResponse('unauthorized')
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
