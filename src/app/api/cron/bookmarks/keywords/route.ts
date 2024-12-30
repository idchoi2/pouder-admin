import prisma from '@/app/prisma'
import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS } from '@/configs'
import { BOOKMARK_CRON_SIZE } from '@/configs/bookmark.config'
import { showErrorJsonResponse } from '@/lib/utils'
import { getBookmarkData, requestUrl } from '@/utils/bookmark'
import { CoreMessage, generateObject, generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Update bookmarks with no keywords
 * @returns
 */
export async function GET(request: NextRequest) {
  // Check if request is authorized
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookmarks = await prisma.bookmarks.findMany({
    where: {
      deleted_at: null,
      accounts: {
        deleted_at: null,
      },
      body_contents: null,
      // Keywords is empty or null
      OR: [
        {
          keywords: {
            equals: null,
          },
        },
        {
          keywords: {
            equals: [],
          },
        },
      ],
    },
    select: {
      id: true,
      team_id: true,
      title: true,
      description: true,
      url: true,
      bookmark_field: true,
      summary: true,
      tags: true,
      created_at: true,
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    take: BOOKMARK_CRON_SIZE,
  })

  const summarizeCommand = AI_COMMAND_OPTIONS.find(
    (p) => p.command === 'summarize_body_contents'
  )

  const keywordsCommand = AI_COMMAND_OPTIONS.find(
    (p) => p.command === 'get_keywords_from_body_contents'
  )

  if (!keywordsCommand) {
    return showErrorJsonResponse('notFound')
  }

  const promises = bookmarks.map(async (bookmark) => {
    const htmlContents = await requestUrl(bookmark.url as string)

    // Get bookmark data
    let bookmarkData = await getBookmarkData(
      bookmark.url as string,
      htmlContents
    )

    // Set messages
    const autoCateMessages: CoreMessage[] = []
    const summarizeMessages: CoreMessage[] = []
    const keywordsMessages: CoreMessage[] = []
    let summarizedText = ''
    let keywords: string[] = []

    // Summarized text
    if (!bookmark.summary && summarizeCommand && summarizeCommand.prompts) {
      summarizeCommand.prompts.forEach((prompt) => {
        summarizeMessages.push({
          role: 'system',
          content: prompt,
        })
      })

      summarizeMessages.push({
        role: 'user',
        content: bookmarkData.bodyText,
      })

      const { text, usage } = await generateText({
        model: registry.languageModel(
          `${summarizeCommand.provider}:${summarizeCommand.model}`
        ),
        messages: summarizeMessages,
        temperature: summarizeCommand.temperature || 1,
      })

      summarizedText = text

      autoCateMessages.push({
        role: 'user',
        content: `Summary: ${text}`,
      })
    }

    // Get Keywords from body contents
    if (bookmarkData.bodyText && keywordsCommand && keywordsCommand.prompts) {
      keywordsCommand.prompts.forEach((prompt) => {
        keywordsMessages.push({
          role: 'system',
          content: prompt,
        })
      })

      keywordsMessages.push({
        role: 'user',
        content: `Title: ${bookmarkData.title}`,
      })

      keywordsMessages.push({
        role: 'user',
        content: `Description: ${bookmarkData.description}`,
      })

      if (bookmarkData.bodyText !== ' ') {
        keywordsMessages.push({
          role: 'user',
          content: bookmarkData.bodyText,
        })
      }

      const { object, usage } = await generateObject({
        model: registry.languageModel(
          `${keywordsCommand.provider}:${keywordsCommand.model}`
        ),
        schema: z.object({
          keywords: z.array(z.string()),
        }),
        messages: keywordsMessages,
        temperature: keywordsCommand.temperature || 1,
      })

      keywords = object.keywords

      // Convert to lowercase
      keywords = keywords.map((keyword) => keyword.toLowerCase())

      // Remove duplicate terms
      keywords = keywords.filter(
        (value, index, self) => self.indexOf(value) === index
      )
    }

    // Update bookmark
    await prisma.bookmarks.update({
      where: { id: bookmark.id },
      data: {
        keywords,
        body_contents: bookmarkData.bodyText,
        summary: bookmark.summary || summarizedText,
        updated_at: new Date(),
      },
    })

    // Remove previous chunks
    await prisma.bookmark_chunks.deleteMany({
      where: {
        bookmark_id: bookmark.id,
      },
    })
  })

  await Promise.all(promises)

  return NextResponse.json(bookmarks)
}
