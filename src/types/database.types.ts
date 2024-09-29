import { LanguageType } from '@/types/global.types'
import {
  beta_users,
  bookmark_chunks,
  bookmark_fields,
  bookmarks,
  chat_bookmarks,
  chats,
  teams,
  users,
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

export interface UserInterface {
  id: string
  email: string
  name: string
  bio: string | null
  avatar: string | null
  preferred_language: LanguageType | null
  teams?: teams[]
  users: users
  is_admin?: boolean
  beta: beta_users | null
  created_at: string
}

export interface BookmarksInterface extends bookmarks {
  teams?: teams
  accounts?: AccountInterface
  bookmark_fields?: bookmark_fields
  chunks?: bookmark_chunks[]
}

export interface ChatBookmarksInterface extends chat_bookmarks {
  bookmarks?: BookmarksInterface
}

export interface ChatsInterface extends chats {
  users?: User
  accounts: AccountInterface
  bookmarks?: BookmarksInterface
  dateLabel: string
  chat_bookmarks?: ChatBookmarksInterface[]
}
