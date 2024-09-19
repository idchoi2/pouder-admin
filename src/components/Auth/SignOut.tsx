'use client'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'

export default function SignOut() {
  const supabase = createClient()

  return (
    <div>
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={async () => {
          await supabase.auth.signOut()
          await location.reload()
        }}>
        <LogOut size={18} />
      </Button>
    </div>
  )
}
