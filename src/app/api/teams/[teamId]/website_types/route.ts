import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read list of teams' website types
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

  // Get team's website types
  const types = await prisma.team_website_types.findMany({
    where: {
      team_id: team.id,
      quantity: {
        gt: 0,
      },
    },
    select: {
      type: true,
      quantity: true,
    },
    orderBy: {
      type: 'asc',
    },
    distinct: ['type'],
  })

  return NextResponse.json(types)
}
