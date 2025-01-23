import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of bookmark fields
 * @returns
 */
export async function GET(request: NextRequest) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const bookmark_fields = await prisma.bookmark_fields.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      _count: {
        select: {
          bookmarks: {
            where: {
              deleted_at: null,
            },
          },
        },
      },
    },
    orderBy: [
      {
        label: 'asc',
      },
    ],
  })

  return NextResponse.json(bookmark_fields)
}

/**
 * Create a PUT method to merge bookmark fields (selectedField => targetField)
 */
export async function PUT(request: NextRequest) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const { selectedField, targetField } = await request.json()

  if (!selectedField || !targetField) {
    return showErrorJsonResponse('error')
  }

  const selectedFieldData = await prisma.bookmark_fields.findFirst({
    where: {
      label: selectedField,
    },
  })

  const targetFieldData = await prisma.bookmark_fields.findFirst({
    where: {
      label: targetField,
    },
  })

  if (!selectedFieldData || !targetFieldData) {
    return showErrorJsonResponse('error')
  }

  // Update bookmarks with selectedField to targetField
  await prisma.bookmarks.updateMany({
    where: {
      bookmark_field: selectedFieldData.label,
    },
    data: {
      bookmark_field: targetFieldData.label,
    },
  })

  // Change team_bookmark_field's quantity
  const team_bookmark_fields = await prisma.team_bookmark_fields.findMany({
    where: {
      bookmark_field: selectedFieldData.label,
    },
  })

  for (const team_bookmark_field of team_bookmark_fields) {
    const teamId = team_bookmark_field.team_id

    const targetTeamBookmarkField = await prisma.team_bookmark_fields.findFirst(
      {
        where: {
          team_id: teamId,
          bookmark_field: targetFieldData.label,
        },
      }
    )

    if (targetTeamBookmarkField) {
      await prisma.team_bookmark_fields.update({
        where: {
          id: targetTeamBookmarkField.id,
        },
        data: {
          quantity:
            Number(targetTeamBookmarkField.quantity) +
            Number(team_bookmark_field.quantity),
        },
      })

      await prisma.team_bookmark_fields.delete({
        where: {
          id: team_bookmark_field.id,
        },
      })
    } else {
      await prisma.team_bookmark_fields.create({
        data: {
          team_id: teamId,
          bookmark_field: targetFieldData.label,
          quantity: team_bookmark_field.quantity,
        },
      })
    }
  }

  // Delete selectedField
  await prisma.bookmark_fields.delete({
    where: {
      label: selectedFieldData.label,
    },
  })

  return NextResponse.json({ success: true })
}
