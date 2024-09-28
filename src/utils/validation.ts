import prisma from '@/app/prisma'
import { AxiosErrorInterface, TeamUserRoleType } from '@/types'
import { accounts } from '@prisma/client'
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

  if (!account) return null

  const betaUsers = await prisma.beta_users.findFirst({
    where: {
      email: account?.users?.email,
      deleted_at: null,
    },
  })

  return {
    ...account,
    beta: betaUsers,
  }
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
  account: accounts | null,
  allowedRoles?: TeamUserRoleType[]
) => {
  if (!account) return null

  const team =
    allowedRoles && allowedRoles.length > 0
      ? await prisma.teams.findFirst({
          where: {
            id: teamId,
            deleted_at: null,
            team_account_roles: {
              some: {
                OR: allowedRoles.map((role) => ({
                  account_id: account.id,
                  user_role_type: role,
                })),
              },
            },
          },
        })
      : await prisma.teams.findFirst({
          where: {
            id: teamId,
            deleted_at: null,
            team_account_roles: {
              some: {
                account_id: account.id,
              },
            },
          },
        })

  return team
}

/**
 * Check if the bookmark exists
 * @param bookmarkId
 * @param teamId
 * @returns
 */
export const checkBookmark = async (bookmarkId: string, teamId: string) => {
  const bookmark = await prisma.bookmarks.findFirst({
    where: {
      id: bookmarkId,
      team_id: teamId,
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
    },
  })

  return chat
}
