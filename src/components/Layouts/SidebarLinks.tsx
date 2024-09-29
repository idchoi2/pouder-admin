import { Button } from '@/components/ui/button'
import { Network } from 'lucide-react'
import Link from 'next/link'

function SidebarLinks() {
  return (
    <ul>
      <li>
        <Button
          variant={'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link
            href="https://analytics.google.com/analytics/web/#/"
            target="_blank"
            className="flex  items-center space-x-2">
            <Network size={16} />
            <span>Google Analytics</span>
          </Link>
        </Button>
      </li>
    </ul>
  )
}

export default SidebarLinks
