'use client'

import { recalculateTeamsBookmarkFields } from '@/api/teams.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SITE_LIST_SIZE } from '@/configs/site.config'
import { useTeamsList } from '@/hooks/teams.hook'
import { teamsListParamsAtom } from '@/states'
import { TeamsInterface } from '@/types/database.types'
import { Team_Plan } from '@prisma/client'
import { Pagination, Table } from 'antd'
import { Search } from 'lucide-react'
import moment from 'moment'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { useToast } from '../ui/use-toast'

function TeamsList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [teamsListParams, setTeamsListParams] =
    useRecoilState(teamsListParamsAtom)

  // Hooks
  const { data: teamsList, isFetching } = useTeamsList(teamsListParams)

  // State
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingTeamId, setLoadingTeamId] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('all')
  const [isProtected, setIsProtected] = useState<string>('all')

  // Effect
  useEffect(() => {
    setTeamsListParams({
      ...teamsListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
      plan:
        searchParams.get('plan') &&
        Object.values(Team_Plan).includes(searchParams.get('plan') as Team_Plan)
          ? (searchParams.get('plan') as Team_Plan)
          : 'all',
      is_protected: searchParams.get('is_protected') || 'all',
    })

    setKeyword(searchParams.get('q') || '')
    setSelectedPlan(
      searchParams.get('plan') &&
        Object.values(Team_Plan).includes(searchParams.get('plan') as Team_Plan)
        ? (searchParams.get('plan') as Team_Plan)
        : 'all'
    )
    setIsProtected(searchParams.get('is_protected') || 'all')
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'ID',
      key: 'id',
      render: (team: TeamsInterface) => (
        <Badge variant={'outline'} className="text-xs">
          {team.id}
        </Badge>
      ),
      width: 80,
    },
    {
      title: '팀이름',
      key: 'name',
      render: (team: TeamsInterface) => (
        <div className="flex items-center space-x-2">{team.name}</div>
      ),
      width: 200,
    },
    {
      title: '유저',
      key: 'user',
      render: (team: TeamsInterface) => (
        <ul className="space-y-2">
          {team.team_account_roles?.map((team_account) => (
            <li key={team_account.id}>
              <div className="flex items-center space-x-2">
                {team_account.accounts && (
                  <>
                    <Avatar className="w-4 h-4">
                      <AvatarImage
                        src={team_account.accounts.avatar as string}
                        alt={team_account.accounts.name}
                      />
                      <AvatarFallback>
                        {team_account.accounts.name}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      {team_account.accounts.name} (
                      {team_account.accounts.users?.email}){' '}
                      <Badge variant={'secondary'} className="px-0.5">
                        {team_account.user_role_type}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ),
      width: 280,
    },
    {
      title: 'Plan',
      key: 'plan',
      render: (team: TeamsInterface) => <Badge>{team.plan}</Badge>,
      width: 100,
    },
    {
      title: '북마크 수',
      key: 'bookmarkCount',
      render: (team: TeamsInterface) => (
        <Badge>
          {team.count_bookmarks ? team.count_bookmarks.toLocaleString() : 0}
        </Badge>
      ),
      width: 100,
    },
    {
      title: '구독자 수',
      key: 'bookmarkCount',
      render: (team: TeamsInterface) => (
        <Badge>
          {team.count_subscribers ? team.count_subscribers.toLocaleString() : 0}
        </Badge>
      ),
      width: 100,
    },
    {
      title: '공개여부',
      key: 'is_protected',
      render: (team: TeamsInterface) => (
        <div className="flex items-center space-x-2">
          <Switch checked={!team.is_protected} />
        </div>
      ),
      width: 100,
    },
    /* {
      title: '카테고리',
      key: 'categories',
      render: (team: TeamsInterface) => (
        <div>
          <Button
            size={'sm'}
            variant={'secondary'}
            disabled={loading}
            onClick={() => onHandleRecalculateBookmarkFieldsCount(team)}>
            {loading && loadingTeamId === team.id ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : (
              <></>
            )}
            카테고리 갯수 재계산
          </Button>
        </div>
      ),
      width: 100,
    }, */
    {
      title: '등록날짜',
      key: 'created_at',
      render: (team: TeamsInterface) => (
        <time className="text-xs">
          {moment(team.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </time>
      ),
      width: 100,
    },
  ]

  /**
   * 카테고리 갯수 재계산
   * @param team
   */
  const onHandleRecalculateBookmarkFieldsCount = async (
    team: TeamsInterface
  ) => {
    if (loading) return

    if (confirm('카테고리 갯수를 재계산 하시겠습니까?')) {
      try {
        await setLoading(true)
        await setLoadingTeamId(team.id)
        await recalculateTeamsBookmarkFields(team.id)
        await setLoading(false)
        await setLoadingTeamId('')

        toast({
          title: 'Complete',
          description: '카테고리 갯수를 재계산 하였습니다.',
        })
      } catch (error) {
        await setLoading(false)
        await setLoadingTeamId('')
      }
    }
  }

  /**
   * 페이지네이션 변경
   * @param page
   * @param size
   */
  const onHandleChangePagination = (page: number, size: number) => {
    router.push(`/teams?page=${page}&q=${keyword}&plan=${selectedPlan}`)
  }

  /**
   * 검색
   * @param e
   */
  const onHandleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.push(`/teams?page=1&q=${keyword}&plan=${selectedPlan}`)
  }

  return (
    <div className="space-y-4">
      {/* 검색 필터: 시작 */}
      <form onSubmit={onHandleSearch} className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <Select
            value={selectedPlan}
            onValueChange={(val) => {
              if (val)
                router.push(
                  `/teams?page=1&q=${keyword}&plan=${val}&is_protected=${isProtected}`
                )
            }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Team Plan 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">모든 Plan</SelectItem>
                {Object.keys(Team_Plan).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Select
            value={isProtected}
            onValueChange={(val) => {
              if (val)
                router.push(
                  `/teams?page=1&q=${keyword}&plan=${selectedPlan}&is_protected=${val}`
                )
            }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="공개여부 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">모든 공개 여부</SelectItem>
                <SelectItem value="true">비공개</SelectItem>
                <SelectItem value="false">공개</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="relative col-span-8">
          <Input
            value={keyword}
            placeholder="검색어를 입력하세요"
            onChange={(e) => setKeyword(e.target.value)}
            className="pr-10"
          />
          <Button
            type="submit"
            size={'icon'}
            className="absolute top-0 right-0">
            <Search size={20} />
          </Button>
        </div>
      </form>
      {/* 검색 필터: 끝 */}
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={teamsList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">
          Total: {teamsList?.pagination?.total.toLocaleString()}
        </div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={teamsList?.pagination?.page}
            total={teamsList?.pagination?.total}
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

export default TeamsList
