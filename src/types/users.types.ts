import { LanguageType } from '@/types/global.types'
import { beta_users, teams, users } from '@prisma/client'
import { PaginationInterface } from './global.types'

export interface UserInterface {
  id: string
  email: string
  name: string
  bio: string | null
  avatar: string | null
  preferred_language: LanguageType | null
  teams?: teams[]
  users: users
  is_admin?: boolean
  is_approved?: boolean
  beta: beta_users | null
}

export interface UsersListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface UsersListSearchInterface {
  list: UserInterface[]
  pagination: PaginationInterface
}
