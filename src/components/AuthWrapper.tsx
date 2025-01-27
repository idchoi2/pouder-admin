'use client'

import { authAtom, meAtom } from '@/states'
import { User } from '@supabase/supabase-js'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

export const AuthWrapper = ({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) => {
  // Recoil
  const [me, setMe] = useRecoilState(meAtom)
  const [auth, setAuth] = useRecoilState(authAtom)

  // Set my user
  useEffect(() => {
    setAuth(user)
  }, [user])

  return (
    <div>
      {children}
      <ProgressBar />
    </div>
  )
}
