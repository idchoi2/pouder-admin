import { BookmarksListSearchParamsInterface } from '@/types/bookmarks.types'
import { atom } from 'recoil'

/**
 * 북마크 목록 파라미터
 */
export const bookmarksListParamsAtom =
  atom<BookmarksListSearchParamsInterface | null>({
    key: 'bookmarksListParams',
    default: null,
  })
