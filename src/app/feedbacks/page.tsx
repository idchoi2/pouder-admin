import FeedbacksList from '@/components/Feedbacks/FeedbacksList'
import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'

async function FeedbacksPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Feedback</Typography>
        <Typography variant="small">유저 피드백 목록</Typography>
        <div className="py-10">
          <FeedbacksList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default FeedbacksPages
