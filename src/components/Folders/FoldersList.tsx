'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FOLDER_LIST_SIZE } from '@/configs'
import { useFoldersList } from '@/hooks'
import { folderListParamsAtom } from '@/states'
import { FoldersInterface } from '@/types'
import { Pagination, Table } from 'antd'
import { Search, SquareArrowOutUpRight } from 'lucide-react'
import moment from 'moment'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import BookmarkItem from '../Bookmarks/BookmarksItem'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

function FoldersList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // List Search Params
  const [foldersListParams, setFoldersListParams] =
    useRecoilState(folderListParamsAtom)

  // Hooks
  const { data: foldersList, isFetching } = useFoldersList(foldersListParams)

  // State
  const [keyword, setKeyword] = useState<string>('')

  // Effect
  useEffect(() => {
    setFoldersListParams({
      ...foldersListParams,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sort: searchParams.get('sort') || '',
      q: searchParams.get('q') || '',
    })

    setKeyword(searchParams.get('q') || '')
  }, [searchParams])

  // Table columns
  const tableCols = [
    {
      title: 'Folder',
      key: 'folder',
      render: (folder: FoldersInterface) => (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6 aspect-square cursor-pointer mr-1">
              <AvatarImage src={folder.icon || ''} alt={folder.name || ''} />
              <AvatarFallback className="invert">
                {folder.name ? folder.name[0] : ''}
              </AvatarFallback>
            </Avatar>
            <span>{folder.name}</span>
          </div>

          <Button
            variant="link"
            size="sm"
            onClick={() =>
              window.open(
                `https://pouder.site/teams/${folder.teams?.id}?folderId=${folder.id}`,
                '_blank'
              )
            }>
            <SquareArrowOutUpRight size={14} className="mr-1" />
            상세보기
          </Button>
        </div>
      ),
      width: 200,
    },
    /* {
      title: 'User',
      key: 'user',
      render: (folder: FoldersInterface) => (
        <div className="flex items-center space-x-2">
          {folder.accounts && (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={folder.accounts.avatar as string}
                  alt={folder.accounts.name}
                />
                <AvatarFallback>{folder.accounts.name}</AvatarFallback>
              </Avatar>
              <div>{folder.accounts.name}</div>
            </>
          )}
        </div>
      ),
      width: 150,
    }, */
    {
      title: 'Team',
      key: 'team',
      render: (folder: FoldersInterface) => (
        <div className="space-y-2">
          {folder.teams && (
            <>
              <div>{folder.teams.name}</div>
              <Badge variant={'outline'}>{folder.teams.plan}</Badge>
            </>
          )}
        </div>
      ),
      width: 150,
    },
    {
      title: 'Bookmarks',
      key: 'chunks',
      render: (folder: FoldersInterface) => (
        <div className="space-y-4">
          {folder.folder_bookmarks && folder.folder_bookmarks.length > 0 && (
            <Accordion type="single" collapsible className="w-full btn-action">
              <AccordionItem value="summary">
                <AccordionTrigger>
                  Bookmark ({folder.folder_bookmarks.length})
                </AccordionTrigger>
                <AccordionContent className="overflow-y-auto max-h-96">
                  {folder.folder_bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center space-x-2">
                      <BookmarkItem
                        bookmark={bookmark.bookmarks}
                        bookmarksListParams={null}
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      ),
      width: 680,
    },
    {
      title: '등록날짜',
      key: 'created_at',
      render: (team: FoldersInterface) => (
        <time className="text-xs">
          {moment(team.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </time>
      ),
      width: 160,
    },
  ]

  /**
   * 페이지네이션 변경
   * @param page
   * @param size
   */
  const onHandleChangePagination = (page: number, size: number) => {
    router.push(`/folders?page=${page}`)
  }

  /**
   * 검색
   * @param e
   */
  const onHandleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.push(`/folders?page=1&q=${keyword}`)
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
        dataSource={foldersList?.list}
        pagination={false}
      />
      {/* Table: 끝 */}
      {/* Pagination: 시작 */}
      <div className="flex justify-between items-center py-6">
        <div className="text-sm">Total: {foldersList?.pagination.total}</div>
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger={false}
            current={foldersList?.pagination.page}
            total={foldersList?.pagination.total}
            pageSize={FOLDER_LIST_SIZE}
            onChange={onHandleChangePagination}
          />
        </div>
        <div></div>
      </div>
      {/* Pagination: 끝 */}
    </div>
  )
}

export default FoldersList
