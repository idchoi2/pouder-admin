import ChatsList from '@/components/Chats/ChatsList'
import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'

async function BookmarksPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Search Histories</Typography>
        <div className="py-10">
          <ChatsList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default BookmarksPages
