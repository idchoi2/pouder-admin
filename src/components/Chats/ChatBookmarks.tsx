'use clinet'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { BookmarksInterface, ChatsInterface } from '@/types'
import { ScanText } from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'

function ChatBookmarks({ chat }: { chat: ChatsInterface }) {
  // Memo
  const chatBookmarks = useMemo(() => {
    return (
      chat.chat_bookmarks
        ? chat.chat_bookmarks
            .filter((c) => c && c.bookmarks)
            .map((c) => c.bookmarks)
        : chat.sources && chat.selectedBookmarks
        ? chat.selectedBookmarks.filter(
            (s) => s.url && chat.sources.includes(s.url)
          )
        : []
    ) as BookmarksInterface[]
  }, [chat])

  return (
    chatBookmarks &&
    chatBookmarks.length > 0 && (
      <div className="space-y-2 sticky top-0 bg-background z-30 pb-4 border-b">
        <div className="flex items-center space-x-1">
          <ScanText size={16} />
          <span className="text-sm font-bold">Sources</span>
        </div>
        <div className="overflow-x-auto w-full">
          <ul className="flex items-center space-x-2 w-max">
            {chatBookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <Button
                  variant={'outline'}
                  asChild
                  className="w-48 h-auto block">
                  <a
                    href={bookmark.url || ''}
                    target="_blank"
                    rel="noreferrer"
                    className="space-y-1.5 p-2 rounded-lg block">
                    <div className="line-clamp-1 leading-5 h-5 w-full relative text-wrap text-sm">
                      {bookmark.title}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Avatar className={cn('flex-none rounded-none w-4 h-4')}>
                        <AvatarImage
                          src={bookmark.favicon || ''}
                          alt={bookmark.title || ''}
                        />
                        <AvatarFallback className="text-bold bg-fuchsia-500 text-white text-xs">
                          {bookmark.tld ? bookmark.tld[0].toUpperCase() : ''}
                        </AvatarFallback>
                      </Avatar>
                      <Typography
                        variant={'muted'}
                        className="truncate font-normal">
                        {bookmark.hostname}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        {bookmark.bookmark_fields && (
                          <Typography variant={'muted'} className="text-[10px]">
                            <span className="mr-1">
                              {bookmark.bookmark_fields.emoji}
                            </span>
                            <span>{bookmark.bookmark_fields.label_ko}</span>
                          </Typography>
                        )}
                      </div>
                      <div>
                        <Typography variant={'muted'} className="text-[10px]">
                          {moment(bookmark.created_at).fromNow()}
                        </Typography>
                      </div>
                    </div>
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  )
}

export default ChatBookmarks
