import { FeedbacksInterface } from '@/types/database.types'
import { PaginationInterface } from './global.types'

export interface FeedbacksListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface FeedbacksListSearchInterface {
  list: FeedbacksInterface[]
  pagination: PaginationInterface
}
