'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCreateSite, useUpdateSite } from '@/hooks/sites.hook'
import {
  sitesFormAtom,
  sitesInfoAtom,
  sitesListParamsAtom,
} from '@/states/atoms/sites.atoms'
import { Loader } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'

function SiteForm() {
  // Recoil
  const [sitesForm, setSitesForm] = useRecoilState(sitesFormAtom)
  const [sitesInfo, setSitesInfo] = useRecoilState(sitesInfoAtom)

  // State
  const [hostname, setHostname] = useState<string>('')
  const [sitename, setSitename] = useState<string>('')
  const [favicon, setFavicon] = useState<string>('')

  // List Search Params
  const [sitesListParams, setSitesListParams] =
    useRecoilState(sitesListParamsAtom)

  // Hooks
  const { mutate: createSite, isPending: isPendingCreate } =
    useCreateSite(sitesListParams)
  const { mutate: updateSite, isPending: isPendingUpdate } =
    useUpdateSite(sitesListParams)

  // Is Valid
  const isValid = useMemo(() => {
    return !!(sitename && hostname && favicon)
  }, [sitename, hostname, favicon])

  useEffect(() => {
    if (sitesForm) {
      if (sitesInfo) {
        setSitename(sitesInfo.sitename || '')
        setHostname(sitesInfo.hostname || '')
        setFavicon(sitesInfo.favicon || '')
      } else {
        setSitename('')
        setHostname('')
        setFavicon('')
      }
    }
  }, [sitesForm, sitesInfo])

  /**
   * Handle Submit
   */
  const onHandleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!isValid) return

      if (sitesInfo) {
        updateSite({ id: Number(sitesInfo.id), sitename, hostname, favicon })
      } else {
        createSite({ sitename, hostname, favicon })
      }
    },
    [isValid, sitename, hostname, favicon, sitesInfo]
  )

  const onSelectFileConvertToBase64 = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setFavicon(result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <Sheet open={sitesForm} onOpenChange={setSitesForm}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{sitesInfo ? 'Edit Site' : 'Add a new Site'}</SheetTitle>
          <SheetDescription>
            Favicon 정보를 캐싱할 사이트를 추가하거나 수정합니다.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onHandleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hostname" className="text-right">
              Hostname
            </Label>
            <Input
              id="hostname"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              className="col-span-3"
              placeholder="Domain host (예: google.com)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sitename" className="text-right">
              Sitename
            </Label>
            <Input
              id="sitename"
              value={sitename}
              onChange={(e) => setSitename(e.target.value)}
              className="col-span-3"
              placeholder='Site name (예: "Google")'
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="favicon" className="text-right pt-1">
              Favicon
            </Label>
            <div className="col-span-3 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFileConvertToBase64}
              />
              {favicon && (
                <div className="">
                  <Avatar className="w-20 h-20 border object-contain  ">
                    <AvatarImage src={favicon} alt={'Favicon'} />
                  </Avatar>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isValid || isPendingCreate || isPendingUpdate}>
              {(isPendingCreate || isPendingUpdate) && (
                <Loader size={18} className="animate-spin mr-2" />
              )}
              {sitesInfo ? 'Update Site' : 'Create Site'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default SiteForm
