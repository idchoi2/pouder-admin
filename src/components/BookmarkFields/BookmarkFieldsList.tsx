'use client'

import { useBookmarkFieldsFromEdgeConfig, useBookmarkFieldsList } from '@/hooks'
import { feedbacksListParamsAtom } from '@/states/atoms/feedbacks.atoms'
import { BookmarkFieldsInterface } from '@/types/database.types'
import { Table } from 'antd'
import moment from 'moment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Badge } from '../ui/badge'
import { useToast } from '../ui/use-toast'
import BookmarkFieldMerge from './BookmarkFieldMerge'

function BookmarkFieldsList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [feedbacksListParams, setFeedbacksListParams] = useRecoilState(
    feedbacksListParamsAtom
  )

  // Hooks
  const { data: bookmarkFieldsList, isFetching } = useBookmarkFieldsList()
  const { data: bookmarkFieldsListFromEdgeConfig } =
    useBookmarkFieldsFromEdgeConfig()

  useEffect(() => {
    setFeedbacksListParams({
      ...feedbacksListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'Label',
      key: 'label',
      render: (bookmarkField: BookmarkFieldsInterface) => (
        <div>{bookmarkField.label}</div>
      ),
    },
    {
      title: '다국어 표기',
      key: 'lang',
      render: (bookmarkField: BookmarkFieldsInterface) => (
        <div>
          <ul className="space-y-2">
            <li className="flex items-center space-x-1">
              <Badge>KO</Badge>
              <span>{bookmarkField.label_ko}</span>
            </li>
            <li className="flex items-center space-x-1">
              <Badge>EN</Badge>
              <span>{bookmarkField.label_en}</span>
            </li>
          </ul>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Emoji',
      key: 'emoji',
      render: (bookmarkField: BookmarkFieldsInterface) => (
        <div>{bookmarkField.emoji}</div>
      ),
      width: 100,
    },
    {
      title: '사용여부',
      key: 'active',
      render: (bookmarkField: BookmarkFieldsInterface) => (
        <div>
          {!bookmarkField.disabled &&
          bookmarkFieldsListFromEdgeConfig?.find(
            (ec) => ec.label === bookmarkField.label
          ) ? (
            <Badge>사용 가능</Badge>
          ) : (
            <></>
          )}
        </div>
      ),
      width: 200,
    },
    {
      title: '북마크 갯수',
      key: 'bookmark_count',
      render: (bookmarkField: BookmarkFieldsInterface) => (
        <Badge variant={'secondary'}>{bookmarkField._count?.bookmarks}</Badge>
      ),
      width: 200,
    },

    {
      title: '등록날짜',
      key: 'created_at',
      render: (bookmarkField: BookmarkFieldsInterface) => (
        <time className="text-xs">
          {moment(bookmarkField.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </time>
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
    router.push(`/sites?page=${page}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <BookmarkFieldMerge />
        <div></div>
      </div>
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={bookmarkFieldsList}
        pagination={false}
      />
      {/* Table: 끝 */}
    </div>
  )
}

export default BookmarkFieldsList
