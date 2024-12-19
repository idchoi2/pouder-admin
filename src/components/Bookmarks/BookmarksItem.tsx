'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Typography from '@/components/ui/typography'
import { useUpdateKeywordsBookmarks } from '@/hooks'
import { cn } from '@/lib/utils'
import { BookmarksInterface } from '@/types'
import { BookmarksListSearchParamsInterface } from '@/types/bookmarks.types'
import { Bot, Loader } from 'lucide-react'
import moment from 'moment'
import { useParams } from 'next/navigation'
import { MouseEvent } from 'react'
import { Button } from '../ui/button'

export default function BookmarkItem({
  bookmark,
  bookmarksListParams,
  disabled,
}: {
  bookmark: BookmarksInterface
  bookmarksListParams: BookmarksListSearchParamsInterface | null
  disabled?: boolean
}) {
  const params = useParams()

  const { mutate: updateKeywords, isPending } =
    useUpdateKeywordsBookmarks(bookmarksListParams)

  /**
   * Handle click link
   * @param e
   * @returns
   */
  const onHandleClickLink = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault()
    if (disabled) return

    const target = e?.target as HTMLElement

    if (target.closest('.btn-action')) {
      return
    }

    window.open(bookmark.url || '', '_blank')
  }

  return (
    <a
      href={bookmark.url || ''}
      target="_blank"
      onClick={(e) => onHandleClickLink(e)}
      className={cn(
        `w-[680px] h-auto flex overflow-hidden cursor-pointer group hover:text-foreground`,
        'space-x-2 !items-start'
      )}>
      {!bookmark.favicon ? (
        <Skeleton className={cn('flex-none rounded-full', 'w-5 h-5 mt-1')} />
      ) : (
        <Avatar className={cn('flex-none rounded-none', 'w-5 h-5 mt-1')}>
          <AvatarImage
            src={bookmark.favicon || ''}
            alt={bookmark.title || ''}
          />
          <AvatarFallback className="text-bold bg-fuchsia-500 text-white text-xs">
            {bookmark.tld ? bookmark.tld[0].toUpperCase() : ''}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`w-full grow overflow-hidden space-y-0.5 block`}>
        <Typography variant={'h6'} className="truncate">
          {bookmark.title || bookmark.url}
        </Typography>
        <Typography variant="muted" className="truncate">
          {decodeURIComponent(bookmark.url || '')}
        </Typography>
        <div className="w-full min-h-[30px] pt-1 flex flex-wrap space-x-1.5">
          {!!bookmark.bookmark_field &&
            bookmark.bookmark_fields &&
            bookmark.bookmark_fields.label && (
              <Badge
                variant={'outline'}
                className={cn(`text-[11px] flex-none btn-action`)}>
                <span className="mr-1.5">{bookmark.bookmark_fields.emoji}</span>
                <span>{bookmark.bookmark_fields.label_ko}</span>
              </Badge>
            )}
          {bookmark.body_contents &&
            (!bookmark.keywords ||
              (bookmark.keywords.length === 0 && (
                <Button
                  variant={'default'}
                  size={'sm'}
                  disabled={isPending}
                  className="btn-action"
                  onClick={() => {
                    if (confirm('Generate Keywords?')) {
                      updateKeywords(bookmark.id)
                    }
                  }}>
                  {isPending ? (
                    <Loader size={16} className="mr-2 animate-spin" />
                  ) : null}
                  Generate RAG keywords
                </Button>
              )))}
          {bookmark.body_contents && (
            <Accordion
              type="single"
              collapsible
              defaultValue="summary"
              className="w-full btn-action">
              <AccordionItem value="summary">
                <AccordionTrigger>Summary</AccordionTrigger>
                <AccordionContent>
                  {bookmark.summary && (
                    <div className="w-full block">
                      <Typography
                        variant="blockquote"
                        className="text-wrap text-xs">
                        <Bot size={16} className="inline-block mr-1.5 -mt-1" />
                        {bookmark.summary}
                      </Typography>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="keywords">
                <AccordionTrigger>
                  <span>Keywords ({bookmark.keywords?.length})</span>
                </AccordionTrigger>
                <AccordionContent>
                  {bookmark.keywords && bookmark.keywords.length > 0 && (
                    <div className="grow flex flex-wrap pt-1 text-[10px] leading-4 btn-action">
                      {bookmark.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className={`text-muted-foreground hover:underline mr-1.5`}>
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tags">
                <AccordionTrigger>
                  Tags ({bookmark.tags?.length})
                </AccordionTrigger>
                <AccordionContent>
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="grow flex flex-wrap pt-1 text-[10px] leading-4 btn-action">
                      {bookmark.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-muted-foreground hover:underline mr-1.5`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <div className="pt-1">
          <Typography variant="muted" className="!text-[10px]">
            {moment(bookmark.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Typography>
        </div>
      </div>
    </a>
  )
}
