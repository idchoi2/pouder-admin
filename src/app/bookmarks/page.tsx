import BookmarksList from '@/components/Bookmarks/BookmarksList'
import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'

async function BookmarksPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Bookmarks</Typography>
        <Typography variant="small">팀 저장소내 저장된 북마크 목록</Typography>
        <div className="py-10">
          <BookmarksList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default BookmarksPages
