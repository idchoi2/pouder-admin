import prisma from '@/app/prisma'
import { showErrorJsonResponse } from '@/lib/utils'
import { getMe } from '@/utils/auth'
import { checkAccount, checkTeam, validateRequest } from '@/utils/validation'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Read list of my folders
 * @returns
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  if (!team || !account) {
    return showErrorJsonResponse('notFound')
  }

  // Get Folders
  const folders = await prisma.folders.findMany({
    where: {
      team_id: team.id,
      deleted_at: null,
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      name: true,
      icon: true,
      quantity: true,
    },
  })

  return NextResponse.json(folders)
}

/**
 * Create a new team
 * @returns
 */
export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const req = await request.json()

  // Validation
  const schema = z.object({
    name: z.string(),
  })

  const validError = await validateRequest(req, schema)
  if (validError) {
    return NextResponse.json(validError, { status: 400 })
  }

  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  // Team check
  const team = await checkTeam(params.teamId, account)

  if (!team || !account) {
    return showErrorJsonResponse('notFound')
  }

  const currentFolders = await prisma.folders.findMany({
    where: {
      team_id: team.id,
      deleted_at: null,
    },
    select: {
      name: true,
    },
  })

  // Check if same name exists
  if (currentFolders.some((folder) => folder.name === req.name)) {
    return showErrorJsonResponse('sameFolderName')
  }

  // Create Folder
  const dataRes = await prisma.folders.create({
    data: {
      name: req.name,
      team_id: team.id,
      order: currentFolders.length + 1,
    },
  })

  return NextResponse.json(dataRes)
}
