'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CHAT_LIST_SIZE } from '@/configs'
import { useChatConversationsList } from '@/hooks'
import { chatsListParamsAtom } from '@/states'
import {
  chatConversationInfoAtom,
  openChatConversationModalAtom,
} from '@/states/atoms/chats.atoms'
import '@/styles/answer.css'
import { ChatConversationsInterface } from '@/types'
import { Pagination, Table } from 'antd'
import moment from 'moment'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import ChatConversationModal from './ChatConversationModal'

function ChatsList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // List Search Params
  const [chatsListParams, setChatsListParams] =
    useRecoilState(chatsListParamsAtom)

  // Hooks
  const { data: chatConversationsList, isFetching } =
    useChatConversationsList(chatsListParams)

  // Recoil
  const [openChatConversationModal, setOpenChatConversationModal] =
    useRecoilState(openChatConversationModalAtom)
  const [chatConversationInfo, setChatConversationInfo] = useRecoilState(
    chatConversationInfoAtom
  )

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
      title: 'Prompt',
      key: 'prompt',
      render: (chatConversation: ChatConversationsInterface) => (
        <div
          className="cursor-pointer font-bold"
          onClick={() => {
            setOpenChatConversationModal(true)
            setChatConversationInfo(chatConversation)
          }}>
          {chatConversation.title}
        </div>
      ),
      width: 200,
    },
    {
      title: 'User',
      key: 'user',
      render: (chatConversation: ChatConversationsInterface) => (
        <div className="flex items-center space-x-2">
          {chatConversation.accounts && (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={chatConversation.accounts.avatar as string}
                  alt={chatConversation.accounts.name}
                />
                <AvatarFallback>
                  {chatConversation.accounts.name}
                </AvatarFallback>
              </Avatar>
              <div>{chatConversation.accounts.name}</div>
            </>
          )}
        </div>
      ),
      width: 100,
    },
    {
      title: 'Chats',
      key: 'chats',
      render: (chatConversation: ChatConversationsInterface) => (
        <div>{chatConversation?.chats?.length} chat(s)</div>
      ),
      width: 50,
    },
    {
      title: 'Team',
      key: 'team',
      render: (chatConversation: ChatConversationsInterface) => (
        <div className="space-y-2">
          {chatConversation.teams && (
            <>
              <div>{chatConversation.teams.name}</div>
              <Badge variant={'secondary'}>{chatConversation.teams.plan}</Badge>
            </>
          )}
        </div>
      ),
      width: 100,
    },
    {
      title: '등록날짜',
      key: 'created_at',
      render: (chat: ChatConversationsInterface) => (
        <time className="text-xs">
          {moment(chat.created_at).format('YYYY-MM-DD HH:mm:ss')}
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
    router.push(`/searchHistories?page=${page}`)
  }

  return (
    <div>
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={chatConversationsList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">
          Total: {chatConversationsList?.pagination.total}
        </div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={chatConversationsList?.pagination.page}
            total={chatConversationsList?.pagination.total}
            pageSize={CHAT_LIST_SIZE}
            onChange={onHandleChangePagination}
          />
        </div>
        <div></div>
      </div>
      {/* Pagination: 끝 */}
      <ChatConversationModal />
    </div>
  )
}

export default ChatsList
