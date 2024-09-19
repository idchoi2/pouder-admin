import LayoutAdmin from '@/components/Layouts/LayoutAdmin'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  // Auth
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <LayoutAdmin>yoyo</LayoutAdmin>
}
