'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { mergeBookmarkFields } from '@/api'
import { useBookmarkFieldsList } from '@/hooks'
import { Loader, Merge } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import Typography from '../ui/typography'

function BookmarkFieldMerge() {
  // Hooks
  const { data: bookmarkFieldsList, refetch: refetchBookmarkFields } =
    useBookmarkFieldsList()

  // State
  const [merging, setMerging] = useState<boolean>(false)
  const [selectedField, setSelectedField] = useState<string>('')
  const [targetField, setTargetField] = useState<string>('')

  /**
   * Handle merge bookmark fields
   */
  const onHandleMerge = async () => {
    if (
      confirm(
        `카테고리를 병합할까요? ${selectedField} 카테고리는 삭제되고 ${targetField} 카테고리로 병합됩니다.`
      )
    ) {
      try {
        setMerging(true)

        // Merge selectedField to targetField
        await mergeBookmarkFields(selectedField, targetField)

        await refetchBookmarkFields()

        await setMerging(false)
        await setSelectedField('')
        await setTargetField('')
      } catch (e) {
        console.error(e)
        setMerging(false)
      }
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Merge size={16} className="mr-2" />
          카테고리 병합
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>카테고리 병합</SheetTitle>
          <SheetDescription>
            병합할 카테고리를 선택하세요. 왼쪽 카테고리가 오른쪽 카테고리로
            병합됩니다.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 py-10 gap-8">
          <div>
            <Typography variant="h6" className="mb-4">
              카테고리 선택
            </Typography>
            <Select
              value={selectedField || ''}
              onValueChange={(val) => {
                setSelectedField(val)
              }}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {bookmarkFieldsList?.map((field, index) => (
                  <SelectItem key={index} value={field.label}>
                    {field.emoji} {field.label} - {field.label_ko} (
                    {field._count?.bookmarks})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Typography variant="h6" className="mb-4">
              병합할 카테고리 선택
            </Typography>
            <Select
              value={targetField || ''}
              onValueChange={(val) => {
                setTargetField(val)
              }}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {bookmarkFieldsList?.map((field, index) => (
                  <SelectItem key={index} value={field.label}>
                    {field.emoji} {field.label} - {field.label_ko} (
                    {field._count?.bookmarks})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={() => onHandleMerge()}
            disabled={!selectedField || !targetField || merging}>
            {merging ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : null}
            Merge
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BookmarkFieldMerge
