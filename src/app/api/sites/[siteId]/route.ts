import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Update site
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const siteId = Number(params.siteId)
  const { sitename, hostname, favicon } = await request.json()

  const site = await prisma.sites.update({
    where: {
      id: Number(siteId),
    },
    data: {
      sitename,
      hostname,
      favicon,
    },
  })

  return NextResponse.json(site)
}

/**
 * Delete site
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const siteId = Number(params.siteId)

  await prisma.sites.delete({
    where: {
      id: Number(siteId),
    },
  })

  return NextResponse.json({ message: 'success' })
}
