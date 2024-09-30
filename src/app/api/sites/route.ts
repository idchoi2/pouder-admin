import prisma from '@/app/prisma'
import { SITE_LIST_SIZE } from '@/configs/site.config'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Read list of sites
 * @returns
 */
export async function GET(request: NextRequest) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  // Get params
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const sites = await prisma.sites.findMany({
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    skip: (page - 1) * SITE_LIST_SIZE,
    take: SITE_LIST_SIZE,
  })

  const allSitesCount = await prisma.sites.count()

  const pagination = {
    page,
    size: SITE_LIST_SIZE,
    total: allSitesCount,
    totalPages: Math.ceil(allSitesCount / SITE_LIST_SIZE),
  }

  return NextResponse.json({
    list: sites,
    pagination,
  })
}

/**
 * Create a new site
 */
export async function POST(request: NextRequest) {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('unauthorized')
  }

  const { sitename, hostname, favicon } = await request.json()

  const site = await prisma.sites.create({
    data: {
      sitename,
      hostname,
      favicon,
    },
  })

  return NextResponse.json(site)
}
