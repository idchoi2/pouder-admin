import BookmarkFieldsList from '@/components/BookmarkFields/BookmarkFieldsList'
import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'

async function BookmarkFieldsPage() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Category</Typography>
        <Typography variant="small">북마크 카테고리 관리</Typography>
        <div className="py-10">
          <BookmarkFieldsList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default BookmarkFieldsPage
