import prisma from '@/app/prisma'
import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS } from '@/configs'
import { BOOKMARK_SIZE, MAX_BOOKMARK_SIZE } from '@/configs/bookmark.config'
import { CHAT_SIZE } from '@/configs/chat.config'
import { saveTokenUsage, showErrorJsonResponse } from '@/lib/utils'
import { AxiosErrorInterface } from '@/types'
import { SearchTypeInterface } from '@/types/ai.types'
import { MatchBookmarkChunksInterface } from '@/types/database.types'
import { getMe } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { checkAccount, checkTeam, validateRequest } from '@/utils/validation'
import { Supported_Language } from '@prisma/client'
import { CoreMessage, embedMany, generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Read chats
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
  const lastId = searchParams.get('lastId')

  // Get chats
  const chats = await prisma.chats.findMany({
    where: {
      team_id: team.id,
      deleted_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: CHAT_SIZE + 1,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { id: lastId } }),
    select: {
      id: true,
      user_prompt: true,
      chat_bookmarks: {
        where: {
          bookmarks: {
            team_id: team.id,
            deleted_at: null,
          },
        },
        select: {
          bookmarks: {
            select: {
              id: true,
              title: true,
              url: true,
              favicon: true,
              description: true,
              created_at: true,
              website_field: true,
              folder_id: true,
              tags: true,
            },
            where: {
              deleted_at: null,
            },
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
  const hasMore = chats.length > BOOKMARK_SIZE

  return NextResponse.json({
    list: chats.slice(0, CHAT_SIZE),
    hasMore,
  })
}

/**
 * Create a new search chat
 * @returns
 */
export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const req = await request.json()

  // Validation
  const schema = z.object({
    prompt: z.string(),
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

  try {
    // Generate search types list
    const generateSearchTypeCommand = AI_COMMAND_OPTIONS.find(
      (p) => p.command === 'generate_search_types'
    )

    if (!generateSearchTypeCommand || !generateSearchTypeCommand.prompts) {
      return showErrorJsonResponse('error')
    }

    const SUPPORTED_LANGUAGES = Object.values(Supported_Language)

    // Set messages
    const messages: CoreMessage[] = []

    generateSearchTypeCommand.prompts?.forEach((prompt) => {
      messages.push({
        role: 'system',
        content: prompt
          .replace('#####CURRENT_TIME#####', new Date().toISOString())
          .replace(
            '#####SUPPORTED_LANGUAGES#####',
            SUPPORTED_LANGUAGES.map((lang) => `- ${lang}`).join('\n')
          ),
      })
    })

    messages.push({
      role: 'user',
      content: req.prompt,
    })

    // Generate auto-categorized information from AI
    const { object, usage: searchTypeUsage } = await generateObject({
      model: registry.languageModel(
        `${generateSearchTypeCommand.provider}:${generateSearchTypeCommand.model}`
      ),
      schema: z.object({
        list: z.array(
          z.object({
            type: z.string(),
            value: z.union([z.string(), z.array(z.string())]),
          })
        ),
        operator: z.enum(['AND', 'OR']).optional(),
      }),
      mode: 'json',
      messages,
      temperature: generateSearchTypeCommand.temperature || 1,
    })

    // 토큰 사용량 저장
    await saveTokenUsage(
      generateSearchTypeCommand,
      'complete',
      searchTypeUsage,
      null,
      JSON.stringify(messages),
      team,
      account,
      null
    )

    // Get search list
    const searchList = object.list as SearchTypeInterface[]
    const operator = object.operator
    let matchBookmarkChunks: MatchBookmarkChunksInterface[] = []

    // Date type exists
    const dateType = searchList.find((s) => s.type === 'date')

    if (dateType) {
      const dateStart = new Date(dateType.value[0])
      const dateEnd = new Date(dateType.value[1])

      // Get bookmarks
      const bookmarksByDate = await prisma.bookmarks.findMany({
        where: {
          team_id: team.id,
          created_at: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        distinct: ['url'],
        take: MAX_BOOKMARK_SIZE,
      })

      matchBookmarkChunks.push(
        ...bookmarksByDate.map((b, idx) => ({
          id: idx,
          team_id: team.id,
          bookmark_id: b.id,
        }))
      )
    }

    // Semantic search (unique values)
    const semanticTypes = searchList
      .filter((s) => s.type === 'semantic')
      .filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i)

    const embeddingsCommand = AI_COMMAND_OPTIONS.find(
      (p) => p.command === 'embeddings_user_prompt_for_search'
    )

    if (semanticTypes.length > 0 && embeddingsCommand) {
      // Generate embedding for semantic type
      const { embeddings, usage: embeddingUsage } = await embedMany({
        model: registry.textEmbeddingModel(
          `${embeddingsCommand.provider}:${embeddingsCommand.model}`
        ),
        values: semanticTypes.map((x) =>
          (x.value as string).replace(/\n/g, ' ')
        ),
      })

      // 토큰 사용량 저장
      await saveTokenUsage(
        embeddingsCommand,
        'embedding',
        embeddingUsage,
        null,
        JSON.stringify(semanticTypes),
        team,
        account,
        null
      )

      const supabase = createClient()

      const promises = embeddings.map(async (embedding) => {
        const { data, error } = await supabase.rpc('match_bookmark_chunks', {
          query_embedding: embedding,
          match_threshold: embeddingsCommand.match_threshold, // Choose an appropriate threshold for your data
          match_count: embeddingsCommand.match_count, // Choose the number of matches
          match_team_id: team.id,
        })

        if (error && process.env.NODE_ENV === 'development') console.log(error)

        const bookmarkChunks = data as MatchBookmarkChunksInterface[]
        const bookmarkChunksDistinct = bookmarkChunks.filter(
          (v, i, a) => a.findIndex((t) => t.bookmark_id === v.bookmark_id) === i
        )

        // If date type exists and operator is 'AND', filter bookmarks using matchBookmarkChunks
        if (dateType && operator === 'AND') {
          matchBookmarkChunks = matchBookmarkChunks.filter((m) =>
            bookmarkChunksDistinct.some((b) => b.bookmark_id === m.bookmark_id)
          )
        } else {
          matchBookmarkChunks.push(...bookmarkChunksDistinct)
        }
      })
      await Promise.all(promises)
    }

    // Create chat
    const chat = await prisma.chats.create({
      data: {
        team_id: team.id,
        account_id: account.id,
        user_prompt: req.prompt,
        search_conditions: object,
      },
    })

    // Remove duplicate bookmarks
    matchBookmarkChunks = matchBookmarkChunks.filter(
      (v, i, a) => a.findIndex((t) => t.bookmark_id === v.bookmark_id) === i
    )

    // Filter by team id
    matchBookmarkChunks = matchBookmarkChunks.filter(
      (m) => m.team_id === team.id
    )

    // Create chat boomarks
    const chatBookmarks = await prisma.chat_bookmarks.createManyAndReturn({
      data: matchBookmarkChunks.map((b, idx) => ({
        chat_id: chat.id,
        bookmark_id: b.bookmark_id,
        order: idx + 1,
        similarity: b.similarity,
      })),
      select: {
        bookmarks: {
          select: {
            id: true,
            title: true,
            url: true,
            favicon: true,
            description: true,
            created_at: true,
            folder_id: true,
            tags: true,
          },
          where: {
            deleted_at: null,
          },
        },
      },
    })

    const chatRes = {
      id: chat.id,
      user_prompt: chat.user_prompt,
      created_at: chat.created_at,
      chat_bookmarks: chatBookmarks.filter((cb) => cb.bookmarks),
      accounts: {
        name: account.name,
        avatar: account.avatar,
      },
    }

    return NextResponse.json(chatRes)
  } catch (e) {
    console.log(e)
    return showErrorJsonResponse('error', e as AxiosErrorInterface)
  }
}
