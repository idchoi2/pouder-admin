import prisma from '@/app/prisma'
import { EmailBetaApprovedTemplate } from '@/components/Emails/EmailBetaApprovedTemplate'
import { EMAIL_SENDER } from '@/configs'
import { showErrorJsonResponse } from '@/lib/utils'
import { checkUser } from '@/utils/validation'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

/**
 * Send beta user approval request email
 */
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // User check
  const user = await checkUser(Number(params.userId))

  if (!user || !user.users) {
    return showErrorJsonResponse('notFound')
  }

  await prisma.accounts.update({
    where: {
      id: user.id,
      deleted_at: null,
    },
    data: {
      is_sent: true,
    },
  })

  // Send Email
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_SENDER.name} <${EMAIL_SENDER.email}>`,
      to: [user.users.email as string],
      subject:
        'Pouder에 오신 것을 환영합니다. 이제 여러분의 여정이 시작됩니다!',
      react: EmailBetaApprovedTemplate({ name: user.name }),
    })

    if (error) {
      console.log(error)
    }
  }

  return NextResponse.json(params.userId)
}
