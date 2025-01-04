import { getFeedbacks, updateFeedbackAnswer } from '@/api/feedbacks.api'
import {
  FeedbacksInterface,
  FeedbacksListSearchInterface,
  FeedbacksListSearchParamsInterface,
} from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useUpdateFeedbackAnswer = (
  params: FeedbacksListSearchParamsInterface | null
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [FEEDBACK_KEY, params],
    mutationFn: async (data: { feedbackId: number; answer: string }) => {
      return await updateFeedbackAnswer(data.feedbackId, data.answer)
    },
    onSuccess: (updatedFeedback: FeedbacksInterface) => {
      const oldFeedbacksPagination =
        queryClient.getQueryData<FeedbacksListSearchInterface>([
          FEEDBACK_KEY,
          params,
        ]) as FeedbacksListSearchInterface

      queryClient.setQueryData([FEEDBACK_KEY, params], {
        ...oldFeedbacksPagination,
        list: oldFeedbacksPagination.list.map((feedback) =>
          feedback.id === updatedFeedback.id
            ? {
                ...feedback,
                answer: updatedFeedback.answer,
              }
            : feedback
        ),
      })
    },
  })
}
