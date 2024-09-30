import { LanguageType } from '@/types/global.types'
import {
  accounts,
  bookmark_chunks,
  bookmark_fields,
  bookmarks,
  chat_bookmarks,
  chats,
  team_account_roles,
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

export interface TeamAccountRoles extends team_account_roles {
  teams?: teams
}

export interface UserInterface extends accounts {
  teams?: teams[]
  team_account_roles?: TeamAccountRoles[]
  users: users
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
  teams?: teams
}
