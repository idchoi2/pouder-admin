import prisma from '@/app/prisma'
import { USER_LIST_SIZE } from '@/configs/user.config'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of users
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
  const keyword = searchParams.get('q') || ''

  const users = await prisma.accounts.findMany({
    where: {
      deleted_at: null,
      AND: [
        {
          OR: [
            {
              users: {
                email: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        },
      ],
    },
    include: {
      users: true,
      team_account_roles: {
        include: {
          teams: true,
        },
      },
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    skip: (page - 1) * USER_LIST_SIZE,
    take: USER_LIST_SIZE,
  })

  const allUsersCount = await prisma.accounts.count({
    where: {
      deleted_at: null,
      AND: [
        {
          OR: [
            {
              users: {
                email: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        },
      ],
    },
  })

  const pagination = {
    page,
    size: USER_LIST_SIZE,
    total: allUsersCount,
    totalPages: Math.ceil(allUsersCount / USER_LIST_SIZE),
  }

  return NextResponse.json({
    list: users,
    pagination,
  })
}
