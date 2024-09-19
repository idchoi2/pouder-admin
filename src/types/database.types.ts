import { LanguageType } from '@/types/global.types'
import {
  Bookmark_Chunk_Type,
  bookmark_chunks,
  bookmark_fields,
  bookmarks,
  chats,
  folders,
  teams,
} from '@prisma/client'
import { User } from '@supabase/supabase-js'

export interface AccountInterface {
  email: string
  name: string
  bio: string | null
  avatar: string | null
  location: string | null
  preferred_language: LanguageType | null
  teams?: teams[]
}

export interface BookmarksInterface extends bookmarks {
  users?: User
  bookmark_fields?: bookmark_fields
  chunks?: bookmark_chunks[]
  isNew?: boolean
}

export interface BookmarksPaginationInterface {
  list: BookmarksInterface[]
  hasMore: boolean
  init: boolean
}

export interface MatchBookmarkChunksInterface {
  id: number
  team_id: string
  bookmark_id: string
  content?: string
  similarity?: number
}

export interface BookmarkChunksContentsInterface {
  type: Bookmark_Chunk_Type
  content: string
}

export interface FoldersInterface extends folders {
  users?: User
  bookmarks?: bookmarks[]
}

export interface ChatsInterface extends chats {
  users?: User
  accounts: AccountInterface
  bookmarks?: BookmarksInterface
  dateLabel: string
  chat_bookmarks?: {
    bookmarks?: BookmarksInterface
  }[]
}

export interface ChatsPaginationInterface {
  list: ChatsInterface[]
  hasMore: boolean
}
