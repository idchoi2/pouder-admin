import prisma from '@/app/prisma'
import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS, BOOKMARK_CRON_SIZE } from '@/configs'
import { BookmarkChunksContentsInterface } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { Bookmark_Chunk_Type } from '@prisma/client'
import { embedMany } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Update bookmarks with no chunks
 * @returns
 */
export async function GET(request: NextRequest) {
  // Check if request is authorized
  if (
    process.env.NODE_ENV !== 'development' &&
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
      body_contents: {
        not: null,
      },
      keywords: {
        isEmpty: false,
      },
      bookmark_chunks: {
        none: {
          deleted_at: null,
        },
      },
      updated_at: null,
      is_chunk_saved: true,
    },
    select: {
      id: true,
      team_id: true,
      title: true,
      description: true,
      url: true,
      bookmark_field: true,
      keywords: true,
      created_at: true,
    },
    orderBy: [
      {
        created_at: 'asc',
      },
    ],
    take: BOOKMARK_CRON_SIZE,
  })

  const promises = bookmarks.map(async (bookmark) => {
    console.log(bookmark.url)
    const keywords = bookmark.keywords || []

    // Remove previous chunks
    await prisma.bookmark_chunks.deleteMany({
      where: {
        bookmark_id: bookmark.id,
      },
    })

    // Create bookmark chunks
    const bodyChunks: BookmarkChunksContentsInterface[] = [
      {
        type: 'META',
        content: `${bookmark.title}`,
      },
      {
        type: 'META' as Bookmark_Chunk_Type,
        content: bookmark.url || '',
      },
      {
        type: 'FIELD' as Bookmark_Chunk_Type,
        content: bookmark.bookmark_field || '',
      },
      ...keywords.map((term) => ({
        type: 'KEYWORDS' as Bookmark_Chunk_Type,
        content: term,
      })),
    ]

    // Update bookmark
    await prisma.bookmarks.update({
      where: { id: bookmark.id },
      data: {
        updated_at: new Date(),
      },
    })

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
    }
  })

  await Promise.all(promises)

  return NextResponse.json({ success: true })
}
