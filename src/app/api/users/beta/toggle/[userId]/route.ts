import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { checkUser } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Toggle Beta Test Approved
 */
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // User check
  const user = await checkUser(Number(params.userId))

  if (!user || !user.users || !user.beta) {
    return showErrorJsonResponse('notFound')
  }

  await prisma.beta_users.update({
    where: {
      email: user.users.email || '',
      deleted_at: null,
    },
    data: {
      is_approved: !user.beta.is_approved,
    },
  })

  return NextResponse.json(params.userId)
}
