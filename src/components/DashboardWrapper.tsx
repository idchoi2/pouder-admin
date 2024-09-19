'use client'

import { useMyAccount } from '@/hooks/auth.hook'
import { Loader } from 'lucide-react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { useParams, useRouter } from 'next/navigation'

export const DashboardWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const params = useParams()
  const router = useRouter()

  // Hooks
  const { data: account, isFetched: isFetechedAccount } = useMyAccount()

  return isFetechedAccount ? (
    <div>
      {children}
      <ProgressBar />
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center min-h-screen">
      <Loader
        size={32}
        strokeWidth={3}
        className="animate-spin ease-in duration-1000"
      />
    </div>
  )
}
