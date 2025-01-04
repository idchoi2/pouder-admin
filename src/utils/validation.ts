import prisma from '@/app/prisma'
import { AxiosErrorInterface, TeamUserRoleType } from '@/types'
import { User } from '@supabase/supabase-js'
import { z } from 'zod'
/**
 * Validate request
 * @param req
 * @param schema
 * @returns
 */
export const validateRequest = async (
  req: Request,
  schema: z.ZodObject<any, any>
) => {
  const validation = schema.safeParse(req)

  if (!validation.success) {
    const { errors } = validation.error
    return errors
  } else {
    return false
  }
}

/**
 * Show error toast message
 * @param e
 * @returns
 */
export const getErrorToastMessage = (e: AxiosErrorInterface, t?: any) => {
  if (process.env.NODE_ENV === 'development') console.log(e)

  const type = e.response?.data.type || 'error'

  return {
    variant: 'destructive' as 'default' | 'destructive' | null | undefined,
    title:
      t && type ? t(`Error.${type}.title`) : e.response?.data.title || 'Error',
    description:
      t && type
        ? t(`Error.${type}.message`)
        : e.response?.data.message || 'Please try again in few minutes',
  }
}

/**
 * Check if the url is valid
 * @param url
 * @returns
 */
export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check if the user has an account
 * @param user
 * @returns
 */
export const checkAccount = async (user: User) => {
  const account = await prisma.accounts.findFirst({
    where: {
      user_id: user.id,
      deleted_at: null,
      is_admin: true,
    },
  })

  return account
}

/**
 * Check if the user has an account
 * @param user
 * @returns
 */
export const checkUser = async (userId: number) => {
  const account = await prisma.accounts.findFirst({
    where: {
      id: userId,
      deleted_at: null,
    },
    include: {
      users: true,
    },
  })

  return account
}

/**
 * Check if the user is a member of the team
 * @param teamId
 * @param account
 * @param allowedRoles
 * @returns
 */
export const checkTeam = async (
  teamId: string,
  allowedRoles?: TeamUserRoleType[]
) => {
  const team = await prisma.teams.findFirst({
    where: {
      id: teamId,
      deleted_at: null,
    },
  })

  return team
}

/**
 * Check if the bookmark exists
 * @param bookmarkId
 * @returns
 */
export const checkBookmark = async (bookmarkId: string) => {
  const bookmark = await prisma.bookmarks.findFirst({
    where: {
      id: bookmarkId,
      deleted_at: null,
    },
  })

  return bookmark
}

/**
 * Check if the chat exists
 * @param chatId
 * @param teamId
 * @returns
 */
export const checkChat = async (chatId: string, teamId: string) => {
  const chat = await prisma.chats.findFirst({
    where: {
      id: chatId,
      team_id: teamId,
      deleted_at: null,
    },
  })

  return chat
}

/**
 * Check if the feedback exists
 * @param feedbackId
 * @returns
 */
export const checkFeedback = async (feedbackId: number) => {
  const feedback = await prisma.feedbacks.findFirst({
    where: {
      id: feedbackId,
      deleted_at: null,
    },
  })

  return feedback
}
