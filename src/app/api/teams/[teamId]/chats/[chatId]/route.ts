import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkChat, checkTeam } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read chat
 * @returns
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string; chatId: string } }
) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  // Chat check
  const chat = await checkChat(params.chatId, params.teamId)

  if (!team || !chat || !account) {
    return showErrorJsonResponse('notFound')
  }

  return NextResponse.json(chat)
}

/**
 * Delete chat
 */
export async function DELETE(
  request: Request,
  { params }: { params: { teamId: string; chatId: string } }
) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  // Chat check
  const chat = await checkChat(params.chatId, params.teamId)

  if (!team || !chat || !account) {
    return showErrorJsonResponse('notFound')
  }

  await prisma.chats.update({
    where: {
      id: chat.id,
    },
    data: {
      deleted_at: new Date(),
    },
  })

  return NextResponse.json(params.chatId)
}
