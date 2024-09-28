import { AxiosError, AxiosResponse } from 'axios'

export type TeamPlanType = 'STANDARD' | 'BUSINESS' | 'ENTERPRISE'

export type TeamUserRoleType = 'OWNER' | 'ADMIN' | 'USER' | 'VIEWER'

export type LanguageType = 'KOREAN' | 'ENGLISH'

export type ChatConversationType =
  | 'TEXT'
  | 'QUESTION'
  | 'ANSWER'
  | 'DOCS'
  | 'INPUT'
  | 'OUTPUT'
  | 'ARCHIVE'

export interface FileMetaInterface {
  width?: number
  height?: number
  size: string
  type: string
}

export interface PromptListInterface {
  text: string
}

export interface AxiosResponseWithError extends AxiosResponse {
  title?: string
  message?: string
}

export interface AxiosErrorInterface extends AxiosError {
  response?: AxiosResponseWithError
}

export type BookmarkViewType = 'BREIF' | 'DETAIL' | 'GRID'

export interface PaginationInterface {
  page: number
  size: number
  total: number
  totalPages: number
}
