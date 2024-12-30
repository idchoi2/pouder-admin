import prisma from '@/app/prisma'
import { BOOKMARK_LIST_SIZE } from '@/configs'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of bookmarks
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

  const bookmarks = await prisma.bookmarks.findMany({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
      OR: [
        {
          url: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          summary: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          keywords: {
            hasSome: [keyword],
          },
        },
      ],
    },
    /* include: {
      teams: true,
      bookmark_fields: true,
      accounts: true,
    }, */
    select: {
      id: true,
      title: true,
      url: true,
      teams: true,
      bookmark_field: true,
      bookmark_fields: true,
      accounts: true,
      summary: true,
      keywords: true,
      tags: true,
      created_at: true,
      favicon: true,
      application_type: true,
      body_contents: true,
      _count: {
        select: { bookmark_chunks: true },
      },
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    skip: (page - 1) * BOOKMARK_LIST_SIZE,
    take: BOOKMARK_LIST_SIZE,
  })

  const allBookmarksCount = await prisma.bookmarks.count({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
      OR: [
        {
          url: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          summary: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          keywords: {
            hasSome: [keyword],
          },
        },
      ],
    },
  })

  const pagination = {
    page,
    size: BOOKMARK_LIST_SIZE,
    total: allBookmarksCount,
    totalPages: Math.ceil(allBookmarksCount / BOOKMARK_LIST_SIZE),
  }

  return NextResponse.json({
    list: bookmarks,
    pagination,
  })
}
