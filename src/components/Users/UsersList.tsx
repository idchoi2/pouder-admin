'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { USER_LIST_SIZE } from '@/configs/user.config'
import {
  useSendBetaApprovalEmail,
  useToggleBetaUser,
  useUsersList,
} from '@/hooks/users.hook'
import { usersListParamsAtom } from '@/states'
import { UserInterface } from '@/types'
import { Pagination, Table } from 'antd'
import { Check, Search } from 'lucide-react'
import moment from 'moment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Badge } from '../ui/badge'
import Typography from '../ui/typography'
import { useToast } from '../ui/use-toast'

function UsersList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [usersListParams, setUsersListParams] =
    useRecoilState(usersListParamsAtom)

  // State
  const [keyword, setKeyword] = useState<string>('')

  // Hooks
  const { data: usersList, isFetching } = useUsersList(usersListParams)
  const { mutate: toggleBetaUser, isPending: isPendingToggle } =
    useToggleBetaUser(usersListParams)
  const { mutate: sendBetaApprovalEmail, isPending: isPendingSend } =
    useSendBetaApprovalEmail(usersListParams)

  useEffect(() => {
    setUsersListParams({
      ...usersListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'Profile',
      key: 'profile',
      render: (user: UserInterface) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar as string} alt={user.name} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
            <div>{user.name}</div>
          </div>

          {user.bio && (
            <div className="pl-8">
              <Typography variant="muted">{user.bio || ''}</Typography>
            </div>
          )}
        </div>
      ),
      width: 200,
    },
    {
      title: 'Email',
      key: 'email',
      render: (user: UserInterface) => <div>{user.users.email}</div>,
      width: 120,
    },
    {
      title: '언어',
      key: 'language',
      render: (user: UserInterface) => (
        <div>
          <Badge variant={'outline'}>{user.preferred_language || ''}</Badge>
        </div>
      ),
      width: 80,
    },
    {
      title: 'Teams',
      key: 'teams',
      render: (user: UserInterface) => (
        <div>
          <ul className="space-y-1">
            {user.team_account_roles?.map((team_account_role, tIdx) => (
              <li key={team_account_role.id}>
                <Badge
                  variant={'outline'}
                  className="truncate whitespace-normal break-words">
                  {team_account_role.teams?.name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ),
      width: 120,
    },
    {
      title: '가입날짜',
      key: 'created_at',
      render: (user: UserInterface) => (
        <time className="text-xs">
          {moment(user.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </time>
      ),
      width: 110,
    },
    {
      title: '관리자',
      key: 'is_admin',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          {user.is_admin && <Check size={16} />}
        </div>
      ),
      width: 60,
    },
    {
      title: '뉴스레터구독',
      key: 'is_email_newsLetter',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          {user.is_email_newsLetter && <Check size={16} />}
        </div>
      ),
      width: 100,
    },
    /* {
      title: '메일발송',
      key: 'is_sent',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          {user.is_sent && <Check size={16} />}
        </div>
      ),
      width: 60,
    },
    {
      title: '승인하기',
      key: 'is_approved',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!!user.is_approved}
            disabled={isPendingToggle || user.is_admin}
            onCheckedChange={(e) => onHandleToggleBetaUser(e, Number(user.id))}
          />
        </div>
      ),
      width: 80,
    },
    {
      title: '발송하기',
      key: 'send',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2 cursor-not-allowed">
          <Button
            variant={
              user.is_admin || !user.is_approved || isPendingSend
                ? 'ghost'
                : 'default'
            }
            size={'icon'}
            onClick={() => onHandleSendBetaApprovalEmail(Number(user.id))}
            disabled={user.is_admin || !user.is_approved || isPendingSend}>
            <Send size={16} />
          </Button>
        </div>
      ),
      width: 80,
    }, */
  ]

  /**
   * 페이지네이션 변경
   * @param page
   * @param size
   */
  const onHandleChangePagination = (page: number, size: number) => {
    router.push(`/users?page=${page}`)
  }

  /**
   * 검색
   * @param e
   */
  const onHandleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.push(`/users?page=1&q=${keyword}`)
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
        dataSource={usersList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">Total: {usersList?.pagination.total}</div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={usersList?.pagination.page}
            total={usersList?.pagination.total}
            pageSize={USER_LIST_SIZE}
            onChange={onHandleChangePagination}
          />
        </div>
        <div></div>
      </div>
      {/* Pagination: 끝 */}
    </div>
  )
}

export default UsersList
