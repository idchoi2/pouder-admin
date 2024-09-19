import { BookmarksInterface } from '@/types'
import { BookmarkListParamsInterface } from '@/types/request.types'
import { atom } from 'recoil'

export const newGeneratedBookmarkAtom = atom<BookmarksInterface | null>({
  key: 'newGeneratedBookmark',
  default: null,
})

export const bookmarkListParamsAtom = atom<BookmarkListParamsInterface>({
  key: 'bookmarkListParams',
  default: {
    teamId: '',
    bookmarkField: '',
    tag: '',
  },
})

export const updatingGeneratedBookmarkAtom = atom<BookmarksInterface | null>({
  key: 'updatingGeneratedBookmark',
  default: null,
})
