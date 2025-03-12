'use client'

import LogoText from '@/components/ui/logo-text'
import { meAtom } from '@/states'
import { useRecoilState } from 'recoil'
import SignOut from '../Auth/SignOut'
import { DarkModeToggle } from './DarkModeToggle'
import SidebarLinks from './SidebarLinks'
import SidebarMenus from './SidebarMenus'

function Sidebar() {
  // Recoil
  const [me, setMe] = useRecoilState(meAtom)

  return (
    <div className="sticky top-0 left-0 w-56 flex-none h-screen bg-background flex flex-col justify-between p-4 border-r">
      <div className="space-y-4">
        <div className="space-x-2 flex items-center">
          <LogoText className="w-16 h-6" />
        </div>
        <SidebarMenus />
        <hr />
        <SidebarLinks />
      </div>
      <div className="space-y-2">
        <div className="flex items-end justify-end">
          <DarkModeToggle />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm truncate">{me?.email}</div>
          <SignOut />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
