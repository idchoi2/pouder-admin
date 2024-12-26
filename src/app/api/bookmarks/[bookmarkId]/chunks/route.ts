import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS, BODY_TEXT_CHUNKS_SIZE } from '@/configs'
import { saveTokenUsage, showErrorJsonResponse } from '@/lib/utils'
import { BookmarkChunksContentsInterface } from '@/types'
import { getMe } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { checkAccount, checkBookmark } from '@/utils/validation'
import { Bookmark_Chunk_Type } from '@prisma/client'
import { embedMany } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Generate bookmark chunks from bookmark
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

  const keywords = bookmark.keywords || []
  const tags = bookmark.tags || []
  const bodyContents = bookmark.body_contents

  // Get bookmark data
  let bodyContentsChunks: BookmarkChunksContentsInterface[] = []

  if (bodyContents) {
    const bodyWords = bodyContents.split(' ')

    for (let i = 0; i < bodyWords.length; i += BODY_TEXT_CHUNKS_SIZE) {
      bodyContentsChunks.push({
        type: 'BODY',
        content: bodyWords.slice(i, i + BODY_TEXT_CHUNKS_SIZE).join(' '),
      })
    }
  }

  // Create bookmark chunks
  const bodyChunks: BookmarkChunksContentsInterface[] = [
    {
      type: 'META',
      content: `${bookmark.title} : ${bookmark.description}`,
    },
    {
      type: 'META' as Bookmark_Chunk_Type,
      content: bookmark.url || '',
    },
    {
      type: 'FIELD' as Bookmark_Chunk_Type,
      content: bookmark.bookmark_field || '',
    },
    ...bodyContentsChunks,
    ...tags.map((term) => ({
      type: 'TAGS' as Bookmark_Chunk_Type,
      content: term,
    })),
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

    return NextResponse.json(bodyChunks.length)
  }
}
