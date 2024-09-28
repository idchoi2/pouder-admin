import prisma from '@/app/prisma'
import { USER_LIST_SIZE } from '@/configs/user.config'
import { showErrorJsonResponse } from '@/lib/utils'
import { UserInterface } from '@/types'
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

  const users = await prisma.accounts.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      users: true,
    },
    orderBy: [
      {
        created_at: 'asc',
      },
    ],
    skip: (page - 1) * USER_LIST_SIZE,
    take: USER_LIST_SIZE,
  })

  const allUsersCount = await prisma.users.count({
    where: {
      deleted_at: null,
    },
  })

  const usersWithBeta = JSON.parse(JSON.stringify(users))

  // Beta users
  const promise = await usersWithBeta.map(async (user: UserInterface) => {
    const betaUsers = await prisma.beta_users.findFirst({
      where: {
        email: user.users?.email,
        deleted_at: null,
      },
    })

    user.beta = betaUsers
  })

  await Promise.all(promise)

  const pagination = {
    page,
    size: USER_LIST_SIZE,
    total: allUsersCount,
    totalPages: Math.ceil(allUsersCount / USER_LIST_SIZE),
  }

  return NextResponse.json({
    list: usersWithBeta,
    pagination,
  })
}
