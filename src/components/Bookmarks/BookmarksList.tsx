'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BOOKMARK_LIST_SIZE } from '@/configs'
import { useBookmarksList, useUpdateChunksBookmarks } from '@/hooks'
import { bookmarksListParamsAtom } from '@/states'
import { BookmarksInterface } from '@/types'
import { Pagination, Table } from 'antd'
import { Loader, Search } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'
import BookmarkItem from './BookmarksItem'

function BookmarksList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [bookmarksListParams, setBookmarksListParams] = useRecoilState(
    bookmarksListParamsAtom
  )

  // Hooks
  const { data: bookmarksList, isFetching } =
    useBookmarksList(bookmarksListParams)
  const { mutate: updateChunks, isPending } =
    useUpdateChunksBookmarks(bookmarksListParams)

  // State
  const [keyword, setKeyword] = useState<string>('')

  // Effect
  useEffect(() => {
    setBookmarksListParams({
      ...bookmarksListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })

    setKeyword(searchParams.get('q') || '')
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'Bookmark',
      key: 'bookmark',
      render: (bookmark: BookmarksInterface) => (
        <div className="truncate overflow-hidden">
          <BookmarkItem
            bookmark={bookmark}
            bookmarksListParams={bookmarksListParams}
          />
        </div>
      ),
      width: 680,
    },
    {
      title: 'User',
      key: 'user',
      render: (bookmark: BookmarksInterface) => (
        <div className="flex items-center space-x-2">
          {bookmark.accounts && (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={bookmark.accounts.avatar as string}
                  alt={bookmark.accounts.name}
                />
                <AvatarFallback>{bookmark.accounts.name}</AvatarFallback>
              </Avatar>
              <div>{bookmark.accounts.name}</div>
            </>
          )}
        </div>
      ),
      width: 200,
    },
    {
      title: 'Team',
      key: 'team',
      render: (bookmark: BookmarksInterface) => (
        <div className="space-y-2">
          {bookmark.teams && (
            <>
              <div>{bookmark.teams.name}</div>
              <Badge variant={'outline'}>{bookmark.teams.plan}</Badge>
            </>
          )}
        </div>
      ),
      width: 200,
    },
    {
      title: 'Application',
      key: 'application',
      render: (bookmark: BookmarksInterface) => (
        <Badge variant={'outline'}>{bookmark.application_type}</Badge>
      ),
      width: 150,
    },
    {
      title: 'Bookmark Chunks',
      key: 'chunks',
      render: (bookmark: BookmarksInterface) => (
        <div className="space-y-4">
          {!bookmark._count?.bookmark_chunks ||
          bookmark._count?.bookmark_chunks === 0 ? (
            <Button
              variant={'default'}
              size={'sm'}
              onClick={() => {
                if (confirm('Generate Chunks?')) {
                  updateChunks(bookmark.id)
                }
              }}
              disabled={isPending}>
              {isPending ? (
                <Loader size={16} className="mr-2 animate-spin" />
              ) : null}
              Generate Chunks
            </Button>
          ) : (
            <Badge variant={'outline'}>
              {bookmark._count?.bookmark_chunks}
            </Badge>
          )}
        </div>
      ),
      width: 100,
    },
  ]

  /**
   * 페이지네이션 변경
   * @param page
   * @param size
   */
  const onHandleChangePagination = (page: number, size: number) => {
    router.push(`/bookmarks?page=${page}`)
  }

  /**
   * 검색
   * @param e
   */
  const onHandleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.push(`/bookmarks?page=1&q=${keyword}`)
  }

  return (
    <div className="space-y-4">
      {/* 검색 필터: 시작 */}
      <form onSubmit={onHandleSearch} className="relative">
        <Input
          value={keyword}
          placeholder="검색어를 입력하세요"
          onChange={(e) => setKeyword(e.target.value)}
          className="pr-10"
        />
        <Button type="submit" size={'icon'} className="absolute top-0 right-0">
          <Search size={20} />
        </Button>
      </form>
      {/* 검색 필터: 끝 */}
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={bookmarksList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">Total: {bookmarksList?.pagination.total}</div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={bookmarksList?.pagination.page}
            total={bookmarksList?.pagination.total}
            pageSize={BOOKMARK_LIST_SIZE}
            onChange={onHandleChangePagination}
          />
        </div>
        <div></div>
      </div>
      {/* Pagination: 끝 */}
    </div>
  )
}

export default BookmarksList
