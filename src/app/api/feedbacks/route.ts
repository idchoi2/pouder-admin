import prisma from '@/app/prisma'
import { FEEDBACK_LIST_SIZE } from '@/configs'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of feedbacks
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

  const feedbacks = await prisma.feedbacks.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      accounts: true,
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    skip: (page - 1) * FEEDBACK_LIST_SIZE,
    take: FEEDBACK_LIST_SIZE,
  })

  const allFeedbacksCount = await prisma.feedbacks.count({
    where: {
      deleted_at: null,
    },
  })

  const pagination = {
    page,
    size: FEEDBACK_LIST_SIZE,
    total: allFeedbacksCount,
    totalPages: Math.ceil(allFeedbacksCount / FEEDBACK_LIST_SIZE),
  }

  return NextResponse.json({
    list: feedbacks,
    pagination,
  })
}
