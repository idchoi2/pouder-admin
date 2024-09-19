import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read team
 * @returns
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  if (!team || !account) {
    return showErrorJsonResponse('notFound')
  }

  return NextResponse.json(team)
}
