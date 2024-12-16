import prisma from '@/app/prisma'
import { CHAT_LIST_SIZE } from '@/configs'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of chats
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

  const chatConversations = await prisma.chat_conversations.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      teams: true,
      chats: {
        include: {
          chat_bookmarks: {
            include: {
              bookmarks: {
                select: {
                  id: true,
                  title: true,
                  url: true,
                  favicon: true,
                  tld: true,
                },
              },
            },
          },
        },
      },
      accounts: true,
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    skip: (page - 1) * CHAT_LIST_SIZE,
    take: CHAT_LIST_SIZE,
  })

  const allChatsCount = await prisma.chat_conversations.count({
    where: {
      deleted_at: null,
    },
  })

  const pagination = {
    page,
    size: CHAT_LIST_SIZE,
    total: allChatsCount,
    totalPages: Math.ceil(allChatsCount / CHAT_LIST_SIZE),
  }

  return NextResponse.json({
    list: chatConversations,
    pagination,
  })
}
