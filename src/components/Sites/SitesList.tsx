'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SITE_LIST_SIZE } from '@/configs/site.config'
import { useDeleteSite, useSitesList } from '@/hooks/sites.hook'
import {
  sitesFormAtom,
  sitesInfoAtom,
  sitesListParamsAtom,
} from '@/states/atoms/sites.atoms'
import { sites } from '@prisma/client'
import { Pagination, Table } from 'antd'
import { Plus } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

function SitesList() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // List Search Params
  const [sitesListParams, setSitesListParams] =
    useRecoilState(sitesListParamsAtom)

  // Recoil
  const [sitesForm, setSitesForm] = useRecoilState(sitesFormAtom)
  const [sitesInfo, setSitesInfo] = useRecoilState(sitesInfoAtom)

  // Hooks
  const { data: sitesList, isFetching } = useSitesList(sitesListParams)
  const { mutate: deleteSite, isPending: isPendingDelete } =
    useDeleteSite(sitesListParams)

  useEffect(() => {
    setSitesListParams({
      ...sitesListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'Site',
      key: 'site',
      render: (site: sites) => (
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={site.favicon as string}
              alt={site.sitename || ''}
            />
            <AvatarFallback>{site.sitename}</AvatarFallback>
          </Avatar>
          <div>{site.sitename}</div>
        </div>
      ),
    },
    {
      title: 'Hostname',
      key: 'hostname',
      render: (site: sites) => <div>{site.hostname}</div>,
      width: '40%',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (site: sites) => (
        <div className="flex items-center space-x-2">
          <Button
            size={'sm'}
            variant={'ghost'}
            onClick={() => onHandleOpenSiteForm(site)}>
            Edit
          </Button>
          <Button
            size={'sm'}
            variant={'destructive'}
            disabled={isPendingDelete}
            onClick={() => onHandleConfirmDeleteSite(site)}>
            Delete
          </Button>
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
    router.push(`/sites?page=${page}`)
  }

  /**
   * 사이트 추가/수정
   * @param site
   */
  const onHandleOpenSiteForm = (site: sites | null) => {
    setSitesInfo(site)
    setSitesForm(true)
  }

  /**
   * 사이트 삭제
   * @param site
   */
  const onHandleConfirmDeleteSite = (site: sites) => {
    if (confirm('Are you sure you want to delete this site?')) {
      deleteSite(Number(site.id))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button
          size={'sm'}
          variant={'outline'}
          onClick={() => onHandleOpenSiteForm(null)}>
          <Plus size={16} className="mr-2" />
          New site
        </Button>
        <div></div>
      </div>
      {/* Table: 시작 */}
      <Table
        columns={tableCols}
        rowKey="id"
        loading={isFetching}
        dataSource={sitesList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">Total: {sitesList?.pagination.total}</div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={sitesList?.pagination.page}
            total={sitesList?.pagination.total}
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

export default SitesList
