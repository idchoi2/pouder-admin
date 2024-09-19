import {
  BOOKMARK_VIEW_TYPE,
  REMOTE_CONTROL_CATEGORIES_KEY,
  REMOTE_CONTROL_CHAT_HISTORIES_KEY,
  REMOTE_CONTROL_TAGS_KEY,
} from '@/configs'
import { BookmarksInterface, ChatsInterface } from '@/types'
import { BookmarkViewType } from '@/types/global.types'
import Cookies from 'js-cookie'
import { atom } from 'recoil'

export const openCreateBookmarkAtom = atom<boolean>({
  key: 'openCreateBookmark',
  default: false,
})

export const openSearchBookmarkAtom = atom<boolean>({
  key: 'openSearchBookmark',
  default: false,
})

export const openCreateFolderAtom = atom<boolean>({
  key: 'openCreateFolder',
  default: false,
})

export const focusOnSearchFormAtom = atom<boolean>({
  key: 'focusOnSearchForm',
  default: false,
})

export const bookmarkViewAtom = atom<BookmarkViewType>({
  key: 'bookmarkView',
  default:
    Cookies.get(BOOKMARK_VIEW_TYPE) &&
    (Cookies.get(BOOKMARK_VIEW_TYPE) === 'GRID' ||
      Cookies.get(BOOKMARK_VIEW_TYPE) === 'BREIF' ||
      Cookies.get(BOOKMARK_VIEW_TYPE) === 'DETAIL')
      ? (Cookies.get(BOOKMARK_VIEW_TYPE) as BookmarkViewType)
      : 'DETAIL',
})

export const showTeamSelectorAtom = atom<boolean>({
  key: 'showTeamSelector',
  default: false,
})

export const confirmDeleteBookmarkAtom = atom<BookmarksInterface | null>({
  key: 'confirmDeleteBookmark',
  default: null,
})

export const confirmDeleteChatAtom = atom<ChatsInterface | null>({
  key: 'confirmDeleteChat',
  default: null,
})

export const showCategoriesListAtom = atom<boolean>({
  key: 'showCategoriesList',
  default: Cookies.get(REMOTE_CONTROL_CATEGORIES_KEY) === 'T',
})

export const showTagsListAtom = atom<boolean>({
  key: 'showTagsList',
  default: Cookies.get(REMOTE_CONTROL_TAGS_KEY) === 'T',
})

export const showChatHistoriesAtom = atom<boolean>({
  key: 'showChatHistories',
  default: Cookies.get(REMOTE_CONTROL_CHAT_HISTORIES_KEY) === 'T',
})
