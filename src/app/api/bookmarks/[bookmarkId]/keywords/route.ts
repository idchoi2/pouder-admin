import prisma from '@/app/prisma'
import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS } from '@/configs'
import { saveTokenUsage, showErrorJsonResponse } from '@/lib/utils'
import { BookmarkChunksContentsInterface } from '@/types'
import { getMe } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { checkAccount, checkBookmark } from '@/utils/validation'
import { Bookmark_Chunk_Type } from '@prisma/client'
import { CoreMessage, embedMany, generateObject, generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Generate keywords and add bookmarks chunks of keywords
 * @returns
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookmarkId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  // Bookmark check
  const bookmark = await checkBookmark(params.bookmarkId)

  if (!bookmark) {
    return showErrorJsonResponse('notFound')
  }

  const summarizeCommand = AI_COMMAND_OPTIONS.find(
    (p) => p.command === 'summarize_body_contents'
  )

  const keywordsCommand = AI_COMMAND_OPTIONS.find(
    (p) => p.command === 'get_keywords_from_body_contents'
  )

  if (!keywordsCommand) {
    return showErrorJsonResponse('notFound')
  }

  // Set messages
  const autoCateMessages: CoreMessage[] = []
  const summarizeMessages: CoreMessage[] = []
  const keywordsMessages: CoreMessage[] = []
  let summarizedText = ''
  let keywords: string[] = []

  // Summarized text
  if (
    !bookmark.summary &&
    bookmark.body_contents &&
    summarizeCommand &&
    summarizeCommand.prompts
  ) {
    summarizeCommand.prompts.forEach((prompt) => {
      summarizeMessages.push({
        role: 'system',
        content: prompt,
      })
    })

    summarizeMessages.push({
      role: 'user',
      content: bookmark.body_contents,
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

    // 토큰 사용량 저장 (summarize)
    await saveTokenUsage(
      summarizeCommand,
      'summarize',
      usage,
      null,
      JSON.stringify(summarizeMessages),
      bookmark.team_id,
      account,
      null
    )
  }

  // Get Keywords from body contents
  if (bookmark.body_contents && keywordsCommand && keywordsCommand.prompts) {
    keywordsCommand.prompts.forEach((prompt) => {
      keywordsMessages.push({
        role: 'system',
        content: prompt,
      })
    })

    keywordsMessages.push({
      role: 'user',
      content: `Title: ${bookmark.title}`,
    })

    keywordsMessages.push({
      role: 'user',
      content: `Description: ${bookmark.description}`,
    })

    if (bookmark.body_contents !== ' ') {
      keywordsMessages.push({
        role: 'user',
        content: bookmark.body_contents,
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

    // 토큰 사용량 저장 (keywords)
    await saveTokenUsage(
      keywordsCommand,
      'keywords',
      usage,
      null,
      JSON.stringify(keywordsMessages),
      bookmark.team_id,
      account,
      null
    )
  }

  // Create bookmark chunks
  const bodyChunks: BookmarkChunksContentsInterface[] = [
    ...keywords.map((term) => ({
      type: 'KEYWORDS' as Bookmark_Chunk_Type,
      content: term,
    })),
  ]

  // Generate embddings
  const embeddingsCommand = AI_COMMAND_OPTIONS.find(
    (p) => p.command === 'embeddings_body_chunks'
  )

  if (embeddingsCommand) {
    const { embeddings, usage: embeddingUsage } = await embedMany({
      model: registry.textEmbeddingModel(
        `${embeddingsCommand.provider}:${embeddingsCommand.model}`
      ),
      values: bodyChunks.map((x) => x.content.replace(/\n/g, ' ')),
    })

    // 토큰 사용량 저장 (embedding)
    await saveTokenUsage(
      embeddingsCommand,
      'embedding',
      embeddingUsage,
      null,
      JSON.stringify(bodyChunks),
      bookmark.team_id,
      account,
      bookmark
    )

    const supabase = await createClient()
    const { error } = await supabase.from('bookmark_chunks').insert(
      bodyChunks.map((x, idx) => ({
        team_id: bookmark.team_id,
        bookmark_id: bookmark.id,
        content: x.content,
        chunk_type: x.type,
        embedding: embeddings[idx],
      }))
    )

    if (error && process.env.NODE_ENV === 'development') console.log(error)

    // Update bookmark
    const updatedBookmark = await prisma.bookmarks.update({
      where: { id: bookmark.id },
      data: {
        keywords,
        summary: bookmark.summary || summarizedText,
      },
    })

    return NextResponse.json(updatedBookmark)
  }
}
