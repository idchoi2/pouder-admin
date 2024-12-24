import { getFeedbacks } from '@/api/feedbacks.api'
import {
  FeedbacksListSearchInterface,
  FeedbacksListSearchParamsInterface,
} from '@/types'
import { useQuery } from '@tanstack/react-query'

export const FEEDBACK_KEY = 'feedbacks'

export const useFeedbacksList = (
  params: FeedbacksListSearchParamsInterface | null
) => {
  return useQuery({
    queryKey: [FEEDBACK_KEY, params],
    queryFn: async () => {
      return params ? await getFeedbacks(params) : []
    },
    select: (data) => data as FeedbacksListSearchInterface,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 0,
  })
}
