import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, validateRequest } from '@/utils/validation'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Read list of my teams
 * @returns
 */
export async function GET() {
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('notFound')
  }

  const teams = await prisma.teams.findMany({
    where: {
      team_account_roles: {
        some: {
          account_id: account.id,
        },
      },
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      icon: true,
      plan: true,
    },
    orderBy: [
      {
        created_at: 'asc',
      },
    ],
  })

  return NextResponse.json(teams)
}

/**
 * Create a new team
 * @returns
 */
export async function POST(request: Request) {
  const req = await request.json()

  // Validation
  const schema = z.object({
    name: z.string(),
  })

  const validError = await validateRequest(req, schema)
  if (validError) {
    return NextResponse.json(validError, { status: 400 })
  }

  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('notFound')
  }

  const dataRes = await prisma.teams.create({
    data: {
      name: req.name,
      description: req.description || '',
      account_id: account.id,
      team_account_roles: {
        create: {
          account_id: account.id,
          user_role_type: 'OWNER',
        },
      },
    },
  })

  return NextResponse.json(dataRes)
}
