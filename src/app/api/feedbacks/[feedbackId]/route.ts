import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkFeedback } from '@/utils/validation'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { feedbackId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const feedbackId = Number(params.feedbackId)
  const feedback = await checkFeedback(feedbackId)

  if (!feedback) {
    return showErrorJsonResponse('notFound')
  }

  const { answer } = await req.json()

  const updatedFeedback = await prisma.feedbacks.update({
    where: {
      id: feedbackId,
    },
    data: {
      answer,
    },
  })

  return NextResponse.json(updatedFeedback)
}
