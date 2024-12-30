import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import TeamsList from '@/components/Teams/TeamsList'
import Typography from '@/components/ui/typography'

async function TeamsPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Team</Typography>
        <Typography variant="small">팀 목록</Typography>
        <div className="py-10">
          <TeamsList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default TeamsPages
