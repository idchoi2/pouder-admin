import prisma from '@/app/prisma'
import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS } from '@/configs'
import { ENABLE_FOLDER_GENERATING } from '@/configs/ai.config'
import { LANGUAGE_KEY_BY_LOCALES } from '@/configs/languages.config'
import { saveTokenUsage } from '@/lib/utils'
import { getUserLocale } from '@/locales'
import { defaultLocale } from '@/locales/locale.config'
import { getAccountWithUser, getMe } from '@/utils/auth'
import { checkAccount, validateRequest } from '@/utils/validation'
import { CoreMessage, generateObject } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Start by creating a new team
 * @returns
 */
export async function POST(request: Request) {
  const req = await request.json()

  // Validation
  const schema = z.object({
    name: z.string(),
  })

  const validError = await validateRequest(req, schema)
  if (validError) {
    return NextResponse.json(validError, { status: 400 })
  }

  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Get user locale
  const locale = await getUserLocale()
  const preferred_language =
    LANGUAGE_KEY_BY_LOCALES[locale ? locale : defaultLocale]

  // Update account
  const updatedAccount = !account
    ? await prisma.accounts.create({
        data: {
          user_id: me.id,
          name: req.name,
          bio: req.bio,
          avatar: me.user_metadata?.avatar_url,
          preferred_language,
        },
      })
    : await prisma.accounts.update({
        where: { id: account.id },
        data: {
          name: req.name,
          bio: req.bio,
          avatar: me.user_metadata?.avatar_url,
          preferred_language,
        },
      })

  // Create a my team if not exists
  const newTeam = await prisma.teams.create({
    data: {
      account_id: updatedAccount.id,
      name: `${req.name}'s Team`,
      plan: 'FREE',
    },
  })

  if (newTeam) {
    await prisma.team_account_roles.create({
      data: {
        team_id: newTeam.id,
        account_id: updatedAccount.id,
        user_role_type: 'OWNER',
      },
    })
  }

  // Generate recommended folders if new account
  if (ENABLE_FOLDER_GENERATING && !account) {
    // Generate recommended list of folders based on user's prompt
    const folderRecommendationsCommand = AI_COMMAND_OPTIONS.find(
      (p) => p.command === 'folder_recommendations'
    )

    if (
      newTeam &&
      folderRecommendationsCommand &&
      folderRecommendationsCommand.prompts &&
      folderRecommendationsCommand.prompts.length > 0
    ) {
      // Set messages
      const messages: CoreMessage[] = []
      messages.push({
        role: 'system',
        content: folderRecommendationsCommand.prompts[0] || '',
      })

      messages.push({
        role: 'user',
        content: req.bio,
      })

      // Generate auto-categorized information from AI
      const { object, usage, finishReason } = await generateObject({
        model: registry.languageModel(
          `${folderRecommendationsCommand.provider}:${folderRecommendationsCommand.model}`
        ),
        schema: z.object({
          list: z.array(z.string()),
        }),
        mode: 'json',
        messages,
        temperature: folderRecommendationsCommand.temperature || 1,
      })

      const listOfFolders: string[] = object.list

      // Remove duplicate folder name
      const uniqueFolders = listOfFolders.filter(
        (item, index) => listOfFolders.indexOf(item) === index
      )

      // Create new folders
      await prisma.folders.createMany({
        data: uniqueFolders.map((name, fIdx) => ({
          team_id: newTeam.id,
          account_id: updatedAccount.id,
          name,
          order: fIdx + 1,
        })),
      })

      // 토큰 사용량 저장
      await saveTokenUsage(
        folderRecommendationsCommand,
        'complete',
        usage,
        finishReason,
        JSON.stringify(messages),
        newTeam,
        updatedAccount,
        null
      )
    }
  }

  const accountObj = await getAccountWithUser(me, updatedAccount)

  return NextResponse.json(
    newTeam
      ? {
          ...accountObj,
          teams: [newTeam],
        }
      : {
          ...accountObj,
        }
  )
}
