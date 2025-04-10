'use client'

import {
  Bookmark,
  Folder,
  Home,
  MessageSquare,
  Search,
  User,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

function SidebarMenus() {
  const pathname = usePathname()

  return (
    <ul>
      <li>
        <Button
          variant={pathname == '/' ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Home size={16} />
            <span>Home</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={pathname.startsWith('/bookmarks') ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/bookmarks" className="flex items-center space-x-2">
            <Bookmark size={16} />
            <span>Bookmarks</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={pathname.startsWith('/folders') ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/folders" className="flex items-center space-x-2">
            <Folder size={16} />
            <span>Folders</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={pathname.startsWith('/teams') ? 'default' : 'ghost'}
          size={'sm'}
          className="w-full block justify-start">
          <Link href="/teams" className="flex items-center space-x-2">
            <Users size={16} />
            <span>Teams</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={pathname.startsWith('/users') ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/users" className="flex items-center space-x-2">
            <User size={16} />
            <span>Users</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={
            pathname.startsWith('/searchHistories') ? 'default' : 'ghost'
          }
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/searchHistories" className="flex items-center space-x-2">
            <Search size={16} />
            <span>Search Histories</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button
          variant={pathname.startsWith('/feedbacks') ? 'default' : 'ghost'}
          size={'sm'}
          asChild
          className="w-full block justify-start">
          <Link href="/feedbacks" className="flex items-center space-x-2">
            <MessageSquare size={16} />
            <span>Feedbacks</span>
          </Link>
        </Button>
      </li>
    </ul>
  )
}

export default SidebarMenus
