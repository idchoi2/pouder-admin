import prisma from '@/app/prisma'
import { FOLDER_LIST_SIZE } from '@/configs'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of folders
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

  const folders = await prisma.folders.findMany({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
      OR: [
        {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
      created_at: true,
      accounts: true,
      teams: true,
      folder_bookmarks: {
        select: {
          id: true,
          bookmarks: {
            select: {
              id: true,
              title: true,
              url: true,
              favicon: true,
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
    skip: (page - 1) * FOLDER_LIST_SIZE,
    take: FOLDER_LIST_SIZE,
  })

  const allFoldersCount = await prisma.folders.count({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
      OR: [
        {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ],
    },
  })

  const pagination = {
    page,
    size: FOLDER_LIST_SIZE,
    total: allFoldersCount,
    totalPages: Math.ceil(allFoldersCount / FOLDER_LIST_SIZE),
  }

  return NextResponse.json({
    list: folders,
    pagination,
  })
}
