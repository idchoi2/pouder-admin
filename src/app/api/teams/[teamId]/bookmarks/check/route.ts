import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam, validateRequest } from '@/utils/validation'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Create a new bookmark
 * @returns
 */
export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const req = await request.json()

  // Validation
  const schema = z.object({
    url: z.string().url(),
  })

  const validError = await validateRequest(req, schema)
  if (validError) {
    return NextResponse.json(validError, { status: 400 })
  }

  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  if (!team || !account) {
    return showErrorJsonResponse('notFound')
  }

  // Remove last slas / from url string
  const urlParsed = req.url.replace(/\/$/, '')

  // Duplicate bookmark check
  const existBookmark = await prisma.bookmarks.findFirst({
    where: {
      team_id: team.id,
      url: urlParsed,
      deleted_at: null,
    },
  })

  if (existBookmark) {
    return showErrorJsonResponse('duplicateBookmark')
  }

  return NextResponse.json('ok')
}
