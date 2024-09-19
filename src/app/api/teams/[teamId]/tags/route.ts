import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read list of teams' tags
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

  // Get team's tags
  const tags = await prisma.team_tags.findMany({
    where: {
      team_id: team.id,
      quantity: {
        gt: 0,
      },
    },
    select: {
      tag: true,
      quantity: true,
    },
    orderBy: {
      tag: 'asc',
    },
  })

  return NextResponse.json(tags)
}
