import { BookmarksInterface } from './database.types'

export interface UserAccountUpdateRequest {
  name: string
  bio: string
  avatar?: string
}

export interface TeamCreateRequest {
  name: string
  description?: string
}

export interface BookmarkCheckRequest {
  url: string
}

export interface BookmarkCreateRequest {
  bookmark: BookmarksInterface
}

export interface FolderCreateRequest {
  name: string
}

export interface SearchRequest {
  prompt: string
}
