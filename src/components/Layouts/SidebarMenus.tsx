'use client'

import { Bookmark, Search, User, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

function SidebarMenus() {
  return (
    <ul>
      <li>
        <Button variant={'link'} asChild className="w-full block justify-start">
          <Link href="/bookmarks" className="flex  items-center space-x-1">
            <Bookmark size={16} />
            <span>Bookmarks</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button variant={'link'} asChild className="w-full block justify-start">
          <Link href="/teams" className="flex  items-center space-x-1">
            <Users size={16} />
            <span>Teams</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button variant={'link'} asChild className="w-full block justify-start">
          <Link href="/users" className="flex  items-center space-x-1">
            <User size={16} />
            <span>Users</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button variant={'link'} asChild className="w-full block justify-start">
          <Link href="/search" className="flex  items-center space-x-1">
            <Search size={16} />
            <span>Search Histories</span>
          </Link>
        </Button>
      </li>
    </ul>
  )
}

export default SidebarMenus
