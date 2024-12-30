import { TeamsInterface } from '@/types/database.types'
import { PaginationInterface } from './global.types'

export interface TeamsListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface TeamsListSearchInterface {
  list: TeamsInterface[]
  pagination: PaginationInterface
}
