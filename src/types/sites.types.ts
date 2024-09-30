import { sites } from '@prisma/client'
import { PaginationInterface } from './global.types'

export interface SitesListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface SitesListSearchInterface {
  list: sites[]
  pagination: PaginationInterface
}

export interface SitesFormInterface {
  id?: number
  sitename: string
  hostname: string
  favicon: string
}
