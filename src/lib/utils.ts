import { ErrorType, errorMessages } from '@/configs/error.config'
import { AxiosErrorInterface } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Pause execution
 * @param delay
 * @returns
 */
export const pause = (delay: number) => {
  return new Promise((r) => setTimeout(r, delay))
}

/**
 * Convert string to capital case
 * @param str
 * @returns
 */
export const toCapitalCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.toLocaleLowerCase().slice(1)
}

/**
 * Show Custom Error Response
 * @param errorType
 * @param e
 * @returns
 */
export const showErrorJsonResponse = (
  errorType: ErrorType,
  e?: AxiosErrorInterface
) => {
  const errorMessage = errorMessages[errorType]

  if (e && process.env.NODE_ENV === 'development') console.log(e)

  if (!errorMessage) {
    return NextResponse.json(
      {
        type: 'error',
        title: 'Oops!',
        message:
          "Sorry. We're working to fix the issue ASAP. Please try again in few minutes.",
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      type: errorType,
      title: errorMessage.title ? errorMessage.title : 'Error',
      message: errorMessage.message,
    },
    { status: errorMessage.status }
  )
}

/**
 * Show Custom Error Object
 * @param errorType
 * @param e
 * @returns
 */
export const showErrorJsonObject = (errorType: ErrorType) => {
  const errorMessage = errorMessages[errorType]

  if (!errorMessage) {
    return {
      title: 'Oops!',
    }
  }

  return {
    title: errorMessage.title ? errorMessage.title : 'Error',
    message: errorMessage.message,
  }
}
