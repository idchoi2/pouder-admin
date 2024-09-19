import prisma from '@/app/prisma'
import { BOOKMARK_SIZE } from '@/configs/bookmark.config'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { Website_Field, Website_Type } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read bookmarks
 * @returns
 */
export async function GET(
  request: NextRequest,
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

  // Get params
  const searchParams = request.nextUrl.searchParams
  const sinceId = searchParams.get('sinceId')
  const lastId = searchParams.get('lastId')
  const tag = searchParams.get('tag')
  const websiteType = searchParams.get('websiteType')
  const websiteField = searchParams.get('websiteField')
  const bookmarkField = searchParams.get('bookmarkField')

  // Get bookmarks
  const bookmarks = await prisma.bookmarks.findMany({
    where: {
      team_id: team.id,
      deleted_at: null,
      ...(tag && { tags: { has: tag } }),
      ...(websiteType && { website_type: websiteType as Website_Type }),
      ...(websiteField && { website_field: websiteField as Website_Field }),
      ...(bookmarkField && { bookmark_field: bookmarkField }),
    },
    select: {
      id: true,
      url: true,
      website_field: true,
      bookmark_fields: {
        select: {
          label: true,
          emoji: true,
          label_ko: true,
          label_en: true,
        },
      },
      tags: true,
      title: true,
      description: true,
      favicon: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    distinct: ['url'],
    take: BOOKMARK_SIZE + 1,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { id: lastId } }),
  })

  // Determine if there are more bookmarks
  const hasMore = bookmarks.length > BOOKMARK_SIZE

  return NextResponse.json({
    list: bookmarks.slice(0, BOOKMARK_SIZE),
    hasMore,
  })
}
