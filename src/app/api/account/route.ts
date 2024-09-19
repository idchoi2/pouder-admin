import prisma from '@/app/prisma'
import { pause, showErrorJsonResponse } from '@/lib/utils'
import { getAccountWithUser, getMe } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { checkAccount } from '@/utils/validation'
import { NextResponse } from 'next/server'

/**
 * Get my account
 */
export async function GET() {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('notFound')
  }

  // Get account object
  const accountObj = await getAccountWithUser(me, account)

  return NextResponse.json(accountObj)
}

/**
 * Update my account
 * @returns
 */
export async function PUT(request: Request) {
  const req = await request.json()

  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('notFound')
  }

  // Update account
  const updatedAccount = await prisma.accounts.update({
    where: { id: account.id },
    data: {
      name: req.name ? req.name : account.name,
      bio: req.bio ? req.bio : account.bio,
      avatar: req.avatar ? req.avatar : account.avatar,
      location: req.location ? req.location : account.location,
      preferred_language: req.preferred_language
        ? req.preferred_language
        : account.preferred_language,
    },
  })

  const accountObj = await getAccountWithUser(me, updatedAccount)

  return NextResponse.json(accountObj)
}

/**
 * Delete my account
 * @param request
 * @returns
 */
export async function DELETE(request: Request) {
  // Auth
  const me = await getMe()

  // Account check
  const account = await checkAccount(me)

  if (!account) {
    return showErrorJsonResponse('notFound')
  }

  await pause(2000)

  // Delete my account
  await prisma.accounts.update({
    where: { id: account.id },
    data: {
      deleted_at: new Date(),
    },
  })

  // Logout
  const supabase = createClient()
  await supabase.auth.signOut()

  return NextResponse.json({ message: 'success' })
}
