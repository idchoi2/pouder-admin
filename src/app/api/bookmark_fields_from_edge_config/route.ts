import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { get } from '@vercel/edge-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of bookmark fields from edge config
 * @returns
 */
export async function GET(request: NextRequest) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const bookmark_fields = await get('bookmark_fields')

  return NextResponse.json(bookmark_fields)
}
