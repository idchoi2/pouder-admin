import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'
import UsersList from '@/components/Users/UsersList'

async function UsersPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Users</Typography>
        <Typography variant="small">사용자 목록을 확인하고 관리</Typography>
        <div className="py-10">
          <UsersList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default UsersPages
