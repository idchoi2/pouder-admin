import { FeedbacksListSearchParamsInterface } from '@/types'
import { atom } from 'recoil'

/**
 * 피드백 목록 파라미터
 */
export const feedbacksListParamsAtom =
  atom<FeedbacksListSearchParamsInterface | null>({
    key: 'feedbacksListParams',
    default: null,
  })
