'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CHAT_LIST_SIZE } from '@/configs'
import { useChatsList } from '@/hooks'
import { chatsListParamsAtom } from '@/states'
import { ChatsInterface } from '@/types'
import { Pagination, Table } from 'antd'
import moment from 'moment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import BookmarkItemPreview from '../Bookmarks/BookmarksItemPreview'
import { useToast } from '../ui/use-toast'

function ChatsList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [chatsListParams, setChatsListParams] =
    useRecoilState(chatsListParamsAtom)

  // Hooks
  const { data: chatsList, isFetching } = useChatsList(chatsListParams)

  useEffect(() => {
    setChatsListParams({
      ...chatsListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'User',
      key: 'user',
      render: (chat: ChatsInterface) => (
        <div className="flex items-center space-x-2">
          {chat.accounts && (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={chat.accounts.avatar as string}
                  alt={chat.accounts.name}
                />
                <AvatarFallback>{chat.accounts.name}</AvatarFallback>
              </Avatar>
              <div>{chat.accounts.name}</div>
            </>
          )}
        </div>
      ),
      width: 120,
    },
    {
      title: 'Prompt',
      key: 'prompt',
      render: (chat: ChatsInterface) => <div>{chat.user_prompt}</div>,
      width: 120,
    },
    {
      title: 'Bookmarks',
      key: 'bookmarks',
      render: (chat: ChatsInterface) => (
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bookmarks">
              <AccordionTrigger>
                {chat.chat_bookmarks?.length} Bookmark(s)
              </AccordionTrigger>
              <AccordionContent>
                {chat.chat_bookmarks && chat.chat_bookmarks.length ? (
                  <div className="w-full block overflow-y-auto max-h-80">
                    <ul className="space-y-1">
                      {chat.chat_bookmarks?.map(
                        (chat_bookmark, bIdx) =>
                          chat_bookmark && (
                            <BookmarkItemPreview
                              key={bIdx}
                              chatBookmark={chat_bookmark}
                            />
                          )
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs">No bookmarks found</div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      width: 440,
    },
    {
      title: '등록날짜',
      key: 'created_at',
      render: (chat: ChatsInterface) => (
        <time className="text-xs">
          {moment(chat.created_at).format('YYYY-MM-DD hh:mm:ss')}
        </time>
      ),
      width: 110,
    },
  ]

  /**
   * 페이지네이션 변경
   * @param page
   * @param size
   */
  const onHandleChangePagination = (page: number, size: number) => {
    router.push(`/searchHistories?page=${page}`)
  }

  return (
    <div>
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={chatsList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">Total: {chatsList?.pagination.total}</div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            current={chatsList?.pagination.page}
            total={chatsList?.pagination.total}
            pageSize={CHAT_LIST_SIZE}
            onChange={onHandleChangePagination}
          />
        </div>
        <div></div>
      </div>
      {/* Pagination: 끝 */}
    </div>
  )
}

export default ChatsList
