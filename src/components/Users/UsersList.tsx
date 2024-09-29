'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { USER_LIST_SIZE } from '@/configs/user.config'
import {
  useSendBetaApprovalEmail,
  useToggleBetaUser,
  useUsersList,
} from '@/hooks/users.hook'
import { usersListParamsAtom } from '@/states'
import { UserInterface } from '@/types'
import { Pagination, Table } from 'antd'
import { Check, Send } from 'lucide-react'
import moment from 'moment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

function UsersList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [usersListParams, setUsersListParams] =
    useRecoilState(usersListParamsAtom)

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
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.avatar as string} alt={user.name} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
          <div>{user.name}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Email',
      key: 'email',
      render: (user: UserInterface) => <div>{user.users.email}</div>,
      width: 120,
    },
    {
      title: 'Bio',
      key: 'email',
      render: (user: UserInterface) => (
        <div>
          <p className="text-xs truncate whitespace-normal break-words w-36">
            {user.bio || ''}
          </p>
        </div>
      ),
      width: 144,
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
                  className="text-xs truncate whitespace-normal break-words">
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
    },
  ]

  /**
   * 페이지네이션 변경
   * @param page
   * @param size
   */
  const onHandleChangePagination = (page: number, size: number) => {
    router.push(`/users?page=${page}`)
  }

  const onHandleToggleBetaUser = (checked: boolean, userId: number) => {
    toast({
      title: 'Approving',
      description: '승인중입니다.',
    })

    toggleBetaUser(userId)
  }

  const onHandleSendBetaApprovalEmail = (userId: number) => {
    if (confirm('승인 메일을 발송하시겠습니까?')) {
      toast({
        title: 'Sending',
        description: '승인 메일을 발송중입니다.',
      })

      sendBetaApprovalEmail(userId)
    }
  }

  return (
    <div>
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
