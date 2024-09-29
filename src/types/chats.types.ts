import { ChatsInterface } from '@/types/database.types'
import { PaginationInterface } from '@/types/global.types'

export interface ChatsListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface ChatsListSearchInterface {
  list: ChatsInterface[]
  pagination: PaginationInterface
}
