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
export async function GET(
  request: NextRequest,
  { params }: { params: { chatConversationId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  // Get params
  const searchParams = request.nextUrl.searchParams
  const lastId = searchParams.get('lastId')

  // Get chats
  const chats = await prisma.chats.findMany({
    where: {
      chat_conversation_id: params.chatConversationId,
      deleted_at: null,
    },
    orderBy: {
      created_at: 'asc',
    },
    take: CHAT_LIST_SIZE + 1,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { id: lastId } }),
    select: {
      id: true,
      user_prompt: true,
      answer: true,
      chat_bookmarks: {
        where: {
          bookmarks: {
            deleted_at: null,
          },
        },
        select: {
          bookmarks: {
            where: {
              deleted_at: null,
            },
            select: {
              id: true,
              title: true,
              url: true,
              favicon: true,
              description: true,
              created_at: true,
              bookmark_fields: true,
              tld: true,
              hostname: true,
            },
          },
        },
        orderBy: {
          bookmarks: {
            created_at: 'desc',
          },
        },
      },
      accounts: {
        select: {
          name: true,
          avatar: true,
        },
      },
      created_at: true,
    },
  })

  // Determine if there are more chats
  const hasMore = chats.length > CHAT_LIST_SIZE

  return NextResponse.json({
    list: chats.slice(0, CHAT_LIST_SIZE),
    hasMore,
  })
}
