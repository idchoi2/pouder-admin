import prisma from '@/app/prisma'
import { TEAM_LIST_SIZE } from '@/configs'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of teams
 * @returns
 */
export async function GET(request: NextRequest) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  // Get params
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const teams = await prisma.teams.findMany({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
    },
    select: {
      id: true,
      name: true,
      plan: true,
      created_at: true,
      accounts: {
        include: {
          users: true,
        },
      },
      team_account_roles: {
        include: {
          accounts: {
            include: {
              users: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    skip: (page - 1) * TEAM_LIST_SIZE,
    take: TEAM_LIST_SIZE,
  })

  const allTeamsCount = await prisma.teams.count({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
    },
  })

  const pagination = {
    page,
    size: TEAM_LIST_SIZE,
    total: allTeamsCount,
    totalPages: Math.ceil(allTeamsCount / TEAM_LIST_SIZE),
  }

  return NextResponse.json({
    list: teams,
    pagination,
  })
}
