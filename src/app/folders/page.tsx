import FoldersList from '@/components/Folders/FoldersList'
import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'

async function FoldersPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Folders</Typography>
        <Typography variant="small">팀 저장소내 저장된 폴더 목록</Typography>
        <div className="py-10">
          <FoldersList />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default FoldersPages
