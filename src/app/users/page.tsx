import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'
import UsersList from '@/components/Users/UsersList'

async function UsersPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Users</Typography>
        <div className="py-10">
          <UsersList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default UsersPages
