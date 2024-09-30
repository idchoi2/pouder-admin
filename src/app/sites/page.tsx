import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import SiteForm from '@/components/Sites/SiteForm'
import SitesList from '@/components/Sites/SitesList'
import Typography from '@/components/ui/typography'

async function SitesPages() {
  return (
    <LayoutAdmin>
      <div>
        <Typography variant="h3">Cached Sites</Typography>
        <Typography variant="small">
          Favicon을 미리 보여주는 캐시된 사이트 목록
        </Typography>
        <div className="py-10">
          <SitesList />
          <SiteForm />
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default SitesPages
