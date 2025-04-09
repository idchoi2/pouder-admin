import { PaginationInterface } from '@/types/global.types'
import { folders } from '@prisma/client'

export interface FoldersListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface FoldersListSearchInterface {
  list: folders[]
  pagination: PaginationInterface
}
