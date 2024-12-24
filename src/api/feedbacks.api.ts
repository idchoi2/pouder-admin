import { axiosInstance } from '@/configs/axios.config'
import { FeedbacksListSearchParamsInterface } from '@/types'

/**
 * 피드백 목록 조회
 * @returns
 */
export const getFeedbacks = (
  params: FeedbacksListSearchParamsInterface | null
) => {
  return axiosInstance
    .get(
      `/api/feedbacks?page=${params?.page}&sort=${params?.sort}&q=${params?.q}`
    )
    .then((res) => res.data)
}
