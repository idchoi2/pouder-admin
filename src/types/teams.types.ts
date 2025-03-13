import { TeamsInterface } from '@/types/database.types'
import { Team_Plan } from '@prisma/client'
import { PaginationInterface } from './global.types'

export interface TeamsListSearchParamsInterface {
  page: number
  sort: string
  q: string
  plan: Team_Plan | 'all'
  is_protected: string
}

export interface TeamsListSearchInterface {
  list: TeamsInterface[]
  pagination: PaginationInterface
}
