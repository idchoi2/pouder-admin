import { BookmarksInterface } from '@/types/database.types'
import { PaginationInterface } from '@/types/global.types'

export interface BookmarksListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface BookmarksListSearchInterface {
  list: BookmarksInterface[]
  pagination: PaginationInterface
}
