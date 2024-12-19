import { BookmarksInterface } from '@/types/database.types'
import { PaginationInterface } from '@/types/global.types'
import { Bookmark_Chunk_Type } from '@prisma/client'

export interface BookmarksListSearchParamsInterface {
  page: number
  sort: string
  q: string
}

export interface BookmarksListSearchInterface {
  list: BookmarksInterface[]
  pagination: PaginationInterface
}

export interface BookmarkChunksContentsInterface {
  type: Bookmark_Chunk_Type
  content: string
}
