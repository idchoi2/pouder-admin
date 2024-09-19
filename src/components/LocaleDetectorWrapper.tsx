'use client'

import 'moment/locale/ko'
import { ReactNode } from 'react'

export const LocaleDetectorWrapper = ({
  children,
}: {
  children: ReactNode
}) => {
  return <>{children}</>
}
