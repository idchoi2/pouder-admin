import { Button } from '@/components/ui/button'
import { DatabaseZap, FolderTree, Network } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function SidebarLinks() {
  const pathname = usePathname()

  return (
    <ul>
      <li>
        <Button
          variant={pathname.startsWith('/categories') ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/categories" className="flex  items-center space-x-2">
            <FolderTree size={16} />
            <span>Categories</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={pathname.startsWith('/sites') ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/sites" className="flex  items-center space-x-2">
            <DatabaseZap size={16} />
            <span>Cached Sites</span>
          </Link>
        </Button>
      </li>
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
