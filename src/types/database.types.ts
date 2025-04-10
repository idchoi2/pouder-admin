import { LanguageType } from '@/types/global.types'
import {
  accounts,
  bookmark_chunks,
  bookmark_fields,
  bookmarks,
  chat_bookmarks,
  chat_conversations,
  chats,
  feedbacks,
  folders,
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
  users?: User
}

export interface TeamAccountRoles extends team_account_roles {
  teams?: teams
  accounts?: AccountInterface
}

export interface TeamsInterface extends teams {
  accounts?: AccountInterface
  team_account_roles?: TeamAccountRoles[]
  _count?: {
    bookmarks: number
  }
  folders?: FoldersInterface[]
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
  _count?: {
    bookmark_chunks: number
  }
  folder_bookmarks?: {
    id: string
    folders: folders
  }[]
}

export interface FoldersInterface extends folders {
  teams?: teams
  accounts?: AccountInterface
  folder_bookmarks?: {
    id: string
    bookmarks: BookmarksInterface
  }[]
}

export interface ChatBookmarksInterface extends chat_bookmarks {
  bookmarks?: BookmarksInterface
}

export interface ChatsInterface extends chats {
  users?: User
  accounts: AccountInterface
  bookmarks?: BookmarksInterface
  dateLabel: string
  selectedBookmarks?: BookmarksInterface[]
  chat_bookmarks?: {
    bookmarks?: BookmarksInterface
  }[]
  teams?: teams
}

export interface ChatConversationsInterface extends chat_conversations {
  users?: User
  accounts: AccountInterface
  dateLabel: string
  chats?: ChatsInterface[]
  teams?: teams
}

export interface FeedbacksInterface extends feedbacks {
  accounts?: AccountInterface
}

export interface BookmarkFieldsInterface extends bookmark_fields {
  _count?: {
    bookmarks: number
  }
}
