'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SITE_LIST_SIZE } from '@/configs/site.config'
import { useFeedbacksList } from '@/hooks/feedbacks.hook'
import { feedbacksListParamsAtom } from '@/states/atoms/feedbacks.atoms'
import { FeedbacksInterface } from '@/types/database.types'
import { Pagination, Table } from 'antd'
import moment from 'moment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useToast } from '../ui/use-toast'
import FeedbackAnswerForm from './FeedbackAnswerForm'

function FeedbacksList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [feedbacksListParams, setFeedbacksListParams] = useRecoilState(
    feedbacksListParamsAtom
  )

  // Hooks
  const { data: feedbacksList, isFetching } =
    useFeedbacksList(feedbacksListParams)

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
      title: '유저',
      key: 'user',
      render: (feedback: FeedbacksInterface) => (
        <div className="flex items-center space-x-2">
          {feedback.accounts && (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={feedback.accounts.avatar as string}
                  alt={feedback.accounts.name}
                />
                <AvatarFallback>{feedback.accounts.name}</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold">{feedback.accounts.name}</div>
                <div>{feedback.accounts.users?.email}</div>
              </div>
            </>
          )}
        </div>
      ),
      width: 100,
    },
    {
      title: '내용',
      key: 'comment',
      render: (feedback: FeedbacksInterface) => (
        <div
          dangerouslySetInnerHTML={{
            __html: feedback.contents
              ? feedback.contents.replace(/(?:\r\n|\r|\n)/g, '<br />')
              : '-',
          }}
        />
      ),
      width: '30%',
    },
    {
      title: '답변',
      key: 'answer',
      render: (feedback: FeedbacksInterface) => (
        <FeedbackAnswerForm feedback={feedback} />
      ),
      width: '30%',
    },
    {
      title: '접속 정보',
      key: 'userAgent',
      render: (feedback: FeedbacksInterface) => (
        <div className="text-xs">{JSON.stringify(feedback.userAgent)}</div>
      ),
      width: 100,
    },
    {
      title: '등록날짜',
      key: 'created_at',
      render: (feedback: FeedbacksInterface) => (
        <time className="text-xs">
          {moment(feedback.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </time>
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
    router.push(`/feedbacks?page=${page}`)
  }

  return (
    <div>
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={feedbacksList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">Total: {feedbacksList?.pagination.total}</div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={feedbacksList?.pagination.page}
            total={feedbacksList?.pagination.total}
            pageSize={SITE_LIST_SIZE}
            onChange={onHandleChangePagination}
          />
        </div>
        <div></div>
      </div>
      {/* Pagination: 끝 */}
    </div>
  )
}

export default FeedbacksList
