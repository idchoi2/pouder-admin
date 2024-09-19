import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import {
  setTeamBookmarkFieldCloudAction,
  setTeamTagsCloudAction,
} from '@/utils/bookmark'
import { checkAccount, checkBookmark, checkTeam } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Read bookmark
 * @returns
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string; bookmarkId: string } }
) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  // Bookmark check
  const bookmark = await checkBookmark(params.bookmarkId, params.teamId)

  if (!team || !bookmark) {
    return showErrorJsonResponse('notFound')
  }

  return NextResponse.json(bookmark)
}

/**
 * Delete bookmark
 */
export async function DELETE(
  request: Request,
  { params }: { params: { teamId: string; bookmarkId: string } }
) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  // Bookmark check
  const bookmark = await checkBookmark(params.bookmarkId, params.teamId)

  if (!team || !bookmark) {
    return showErrorJsonResponse('notFound')
  }

  await prisma.bookmarks.update({
    where: {
      id: bookmark.id,
    },
    data: {
      deleted_at: new Date(),
    },
  })

  await prisma.bookmark_chunks.updateMany({
    where: {
      bookmark_id: bookmark.id,
    },
    data: {
      deleted_at: new Date(),
    },
  })

  // Add team's tags
  setTeamTagsCloudAction('remove', team.id, bookmark.tags)

  // Add team's bookmark fields cloud
  if (bookmark.bookmark_field) {
    setTeamBookmarkFieldCloudAction('remove', team.id, bookmark.bookmark_field)
  }

  return NextResponse.json(params.bookmarkId)
}
