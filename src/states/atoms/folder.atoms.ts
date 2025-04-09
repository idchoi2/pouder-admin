import { FoldersListSearchParamsInterface } from '@/types/folders.types'
import { atom } from 'recoil'

/**
 * 폴더 목록 파라미터
 */
export const folderListParamsAtom =
  atom<FoldersListSearchParamsInterface | null>({
    key: 'folderListParams',
    default: null,
  })
