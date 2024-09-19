import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read list of bookmark fields
 * @returns
 */
export async function GET() {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('notFound')
  }

  const bookmarkFields = await prisma.bookmark_fields.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      label: true,
      emoji: true,
      label_ko: true,
      label_en: true,
    },
  })

  return NextResponse.json(bookmarkFields)
}
