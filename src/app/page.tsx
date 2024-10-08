import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import Typography from '@/components/ui/typography'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  // Auth
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <LayoutAdmin>
      <Typography variant="h1">Hello! {user?.email}</Typography>
    </LayoutAdmin>
  )
}
