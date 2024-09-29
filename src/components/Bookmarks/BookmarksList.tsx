'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BOOKMARK_LIST_SIZE } from '@/configs'
import { useBookmarksList } from '@/hooks'
import { bookmarksListParamsAtom } from '@/states'
import { BookmarksInterface } from '@/types'
import { Pagination, Table } from 'antd'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Badge } from '../ui/badge'
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

  useEffect(() => {
    setBookmarksListParams({
      ...bookmarksListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'Bookmark',
      key: 'bookmark',
      render: (bookmark: BookmarksInterface) => (
        <div className="truncate overflow-hidden">
          <BookmarkItem bookmark={bookmark} />
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
              <Badge variant={'secondary'}>{bookmark.teams.plan}</Badge>
            </>
          )}
        </div>
      ),
      width: 200,
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

  return (
    <div>
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
