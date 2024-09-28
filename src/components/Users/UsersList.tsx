'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { USER_LIST_SIZE } from '@/configs/user.config'
import { useToggleBetaUser, useUsersList } from '@/hooks/users.hook'
import { usersListParamsAtom } from '@/states'
import { UserInterface } from '@/types'
import { Checkbox, Pagination, Table } from 'antd'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

function UsersList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  // List Search Params
  const [usersListParams, setUsersListParams] =
    useRecoilState(usersListParamsAtom)

  // Hooks
  const {
    data: usersList,
    isFetching,
    isFetched,
  } = useUsersList(usersListParams)
  const { mutate: toggleBetaUser, isPending } =
    useToggleBetaUser(usersListParams)

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
      title: '관리자',
      key: 'is_admin',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          <Checkbox checked={user.is_admin} className="cursor-not-allowed" />
        </div>
      ),
      width: 60,
    },
    {
      title: 'Waitlist 등록',
      key: 'waitlist',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          <Checkbox checked={!!user.beta} className="cursor-not-allowed" />
        </div>
      ),
      width: 80,
    },
    {
      title: 'Beta Tester 승인',
      key: 'is_approved',
      render: (user: UserInterface) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!!user.beta?.is_approved}
            disabled={isPending || user.is_admin}
            onCheckedChange={(e) => onHandleToggleBetaUser(e, user.id)}
          />
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

  const onHandleToggleBetaUser = (checked: boolean, userId: string) => {
    console.log('userId', userId)
    toggleBetaUser(userId)
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
        <p>Total: {usersList?.pagination.total}</p>
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
