import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Recalculate bookmark fields of team
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const team = await checkTeam(params.teamId)

  if (!team) {
    return showErrorJsonResponse('notFound')
  }

  // Recalculate bookmark fields
  const bookmarks = await prisma.bookmarks.findMany({
    where: {
      team_id: params.teamId,
      deleted_at: null,
    },
    select: {
      bookmark_field: true,
    },
  })

  return NextResponse.json(bookmarks)
}
