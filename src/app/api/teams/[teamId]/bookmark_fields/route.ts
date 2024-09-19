import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read list of teams' bookmark fields
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

  // Get team's website fields
  const fields = await prisma.team_bookmark_fields.findMany({
    where: {
      team_id: team.id,
      quantity: {
        gt: 0,
      },
    },
    select: {
      bookmark_field: true,
      quantity: true,
    },
    orderBy: {
      bookmark_field: 'asc',
    },
    distinct: ['bookmark_field'],
  })

  return NextResponse.json(fields)
}
