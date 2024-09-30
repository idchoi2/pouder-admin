'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Typography from '@/components/ui/typography'
import { ChatBookmarksInterface } from '@/types/database.types'
import Link from 'next/link'

export default function BookmarkItemPreview({
  chatBookmark,
}: {
  chatBookmark: ChatBookmarksInterface
}) {
  return (
    chatBookmark.bookmarks && (
      <Link
        href={chatBookmark.bookmarks.url || ''}
        target="_blank"
        className="w-full h-auto max-w-[340px] flex space-x-2 overflow-hidden !items-start truncate hover:underline">
        <Avatar className="flex-none w-4 h-4 mt-px rounded-none">
          <AvatarImage
            src={chatBookmark.bookmarks.favicon || ''}
            alt={chatBookmark.bookmarks.title || ''}
          />
          <AvatarFallback className="text-bold bg-fuchsia-500 text-white text-xs">
            {chatBookmark.bookmarks.tld
              ? chatBookmark.bookmarks.tld[0].toUpperCase()
              : ''}
          </AvatarFallback>
        </Avatar>
        <div className="w-full grow overflow-hidden truncate space-y-0.5 block">
          <Typography
            variant="caption"
            className="truncate w-full block text-left">
            {chatBookmark.bookmarks.title}
          </Typography>
          <Typography
            variant="muted"
            className="truncate !pointer-events-auto text-[10px]">
            {chatBookmark.bookmarks.url}
          </Typography>
          <Typography
            variant="small"
            className="truncate !pointer-events-auto !text-[10px]">
            ({Number(chatBookmark.similarity)})
          </Typography>
        </div>
      </Link>
    )
  )
}
