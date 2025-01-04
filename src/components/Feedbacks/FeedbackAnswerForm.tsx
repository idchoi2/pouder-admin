'use client'

import { Textarea } from '@/components/ui/textarea'
import { useUpdateFeedbackAnswer } from '@/hooks/feedbacks.hook'
import { feedbacksListParamsAtom } from '@/states/atoms/feedbacks.atoms'
import { FeedbacksInterface } from '@/types'
import { useState } from 'react'
import { useRecoilState } from 'recoil'

function FeedbackAnswerForm({ feedback }: { feedback: FeedbacksInterface }) {
  // List Search Params
  const [feedbacksListParams, setFeedbacksListParams] = useRecoilState(
    feedbacksListParamsAtom
  )

  // State
  const [answer, setAnswer] = useState<string>(feedback.answer || '')

  // Hooks
  const { mutate: updatedFeedback, isPending } =
    useUpdateFeedbackAnswer(feedbacksListParams)

  return (
    <div>
      <Textarea
        value={answer}
        disabled={isPending}
        rows={5}
        onChange={(e) => setAnswer(e.target.value)}
        onBlur={(e) =>
          updatedFeedback({
            feedbackId: Number(feedback.id),
            answer: e.target.value,
          })
        }
      />
    </div>
  )
}

export default FeedbackAnswerForm
