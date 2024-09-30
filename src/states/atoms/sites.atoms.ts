import { SitesListSearchParamsInterface } from '@/types'
import { sites } from '@prisma/client'
import { atom } from 'recoil'

/**
 * 사이트 목록 파라미터
 */
export const sitesListParamsAtom = atom<SitesListSearchParamsInterface | null>({
  key: 'sitesListParams',
  default: null,
})

/**
 * 사이트 폼 모달 상태
 */
export const sitesFormAtom = atom<boolean>({
  key: 'sitesForm',
  default: false,
})

/**
 * 사이트 수정 정보 상태
 */
export const sitesInfoAtom = atom<sites | null>({
  key: 'sitesInfo',
  default: null,
})
