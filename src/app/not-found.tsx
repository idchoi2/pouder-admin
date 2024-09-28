import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'
import Link from 'next/link'

export default async function NotFound() {
  return (
    <LayoutAdmin>
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Typography variant="h1">404</Typography>
          <div>
            <Link href="/">Go Home</Link>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  )
}
