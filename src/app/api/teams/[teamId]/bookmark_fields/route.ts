import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Recalculate bookmark fields of team
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const team = await checkTeam(params.teamId)

  if (!team) {
    return showErrorJsonResponse('notFound')
  }

  // Recalculate bookmark fields
  const teamBookmarks = await prisma.bookmarks.findMany({
    where: {
      team_id: params.teamId,
      deleted_at: null,
    },
    select: {
      id: true,
      bookmark_field: true,
      website_field: true,
    },
  })

  teamBookmarks.forEach(async (bookmark) => {
    // Bookmark field is empty, but website field is not empty
    /* if (!bookmark.bookmark_field && bookmark.website_field) {
      await prisma.bookmarks.update({
        where: {
          id: bookmark.id,
        },
        data: {
          bookmark_field: bookmark.website_field,
        },
      })
    } */
  })

  // Re-calculate team_bookmark_fields's quantity
  await prisma.team_bookmark_fields.deleteMany({
    where: {
      team_id: params.teamId,
    },
  })

  const teamBookmarkFieldsSet = new Set()

  teamBookmarks.forEach((bookmark) => {
    teamBookmarkFieldsSet.add(bookmark.bookmark_field)
  })

  const teamBookmarkFieldsArray = Array.from(teamBookmarkFieldsSet)

  teamBookmarkFieldsArray.forEach(async (bookmarkField: any) => {
    await prisma.team_bookmark_fields.create({
      data: {
        team_id: params.teamId,
        bookmark_field: bookmarkField,
        quantity: teamBookmarks.filter(
          (bookmark) => bookmark.bookmark_field === bookmarkField
        ).length,
      },
    })
  })

  return NextResponse.json(teamBookmarks)
}
