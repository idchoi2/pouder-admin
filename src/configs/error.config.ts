export type ErrorType =
  | 'unauthorized'
  | 'error'
  | 'notFound'
  | 'duplicateBookmark'
  | 'invalidUrl'
  | 'htmlContentsError'
  | 'sameFolderName'

export type ErrorMessageInterface = {
  status: number
  title?: string
  message: string
}

/**
 * Error messages definition
 */
export const errorMessages: Record<ErrorType, ErrorMessageInterface> = {
  unauthorized: {
    status: 401,
    title: 'Unauthorized',
    message: 'Please login to access this page',
  },
  error: {
    status: 400,
    title: 'Error',
    message: 'Something went wrong',
  },
  notFound: {
    status: 404,
    title: 'Not Found',
    message: 'Data not found',
  },
  duplicateBookmark: {
    status: 400,
    title: 'Duplicate Bookmark',
    message: 'This bookmark already exists',
  },
  invalidUrl: {
    status: 400,
    title: 'Invalid URL',
    message: 'Please enter a valid URL',
  },
  htmlContentsError: {
    status: 400,
    title: 'HTML Contents Error',
    message: 'Please enter a valid URL with HTML contents',
  },
  sameFolderName: {
    status: 400,
    title: 'Same Folder Name',
    message: 'Folder name already exists',
  },
}
