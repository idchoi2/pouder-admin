import { TeamsListSearchParamsInterface } from '@/types'
import { atom } from 'recoil'

/**
 * 팀 목록 파라미터
 */
export const teamsListParamsAtom = atom<TeamsListSearchParamsInterface | null>({
  key: 'teamsListParams',
  default: null,
})
