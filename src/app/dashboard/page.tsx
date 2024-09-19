import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  // Auth
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <LayoutAdmin>DashboardPage</LayoutAdmin>
}
