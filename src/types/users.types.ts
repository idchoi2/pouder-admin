import { UserInterface } from './database.types'
import { PaginationInterface } from './global.types'

export interface UsersListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface UsersListSearchInterface {
  list: UserInterface[]
  pagination: PaginationInterface
}
