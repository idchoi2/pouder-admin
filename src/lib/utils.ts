import prisma from '@/app/prisma'
import { AVAILABLE_AI_MODELS } from '@/configs'
import { ErrorType, errorMessages } from '@/configs/error.config'
import {
  AxiosErrorInterface,
  BookmarksInterface,
  ChatsInterface,
} from '@/types'
import { AiCommandOptionInterface, AiModelInterface } from '@/types/ai.types'
import { accounts, teams } from '@prisma/client'
import { CompletionTokenUsage, EmbeddingTokenUsage } from 'ai'
import { type ClassValue, clsx } from 'clsx'
import moment from 'moment'
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

/**
 * Chat 리스트에 날짜 라벨 추가
 * @param chatList
 * @returns
 */
export const addDateLabelToChatsList = (chatList: ChatsInterface[]) => {
  let currentDateKey = ''

  const updatedChatsList = chatList.map((chat: ChatsInterface) => {
    const dateObj = moment(chat.created_at)
    const isToday = dateObj.isSame(moment(), 'day')
    const isYesterday = dateObj.isSame(moment().subtract(1, 'days'), 'day')
    const labelDate = isToday
      ? 'Today'
      : isYesterday
      ? 'Yesterday'
      : moment(chat.created_at).format('YYYY.MM.DD')

    const memoWithDateLabel = {
      ...chat,
      dateLabel: currentDateKey === labelDate ? '' : labelDate,
    }

    currentDateKey = labelDate

    return memoWithDateLabel
  })

  return updatedChatsList
}

/**
 * Calculate the total token cost for a given model and token usage ($# / 1M tokens) for complete usage
 * @param tokenUsage
 * @param targetModel
 * @returns
 */
export const calculateTotalTokenCostForCompleteUsage = (
  tokenUsage: CompletionTokenUsage,
  targetModel: AiModelInterface
) => {
  const promptCosts =
    targetModel.inputPriceRate * tokenUsage.promptTokens * 0.001 * 0.001

  const completionCosts =
    targetModel.outputPriceRate * tokenUsage.completionTokens * 0.001 * 0.001

  return promptCosts + completionCosts
}

/**
 * Calculate the total token cost for a given model and token usage ($# / 1M tokens) for embedding usage
 * @param tokenUsage
 * @param targetModel
 * @returns
 */
export const calculateTotalTokenCostForEmbeddingUsage = (
  tokenUsage: EmbeddingTokenUsage,
  targetModel: AiModelInterface
) => {
  const embeddingCosts =
    targetModel.inputPriceRate * tokenUsage.tokens * 0.001 * 0.001

  return embeddingCosts
}

function isCompleteTokenUsage(
  usage: CompletionTokenUsage | EmbeddingTokenUsage
): usage is CompletionTokenUsage {
  return (usage as CompletionTokenUsage).completionTokens !== undefined
}

function isEmbeddingTokenUsage(
  usage: CompletionTokenUsage | EmbeddingTokenUsage
): usage is EmbeddingTokenUsage {
  return (usage as EmbeddingTokenUsage).tokens !== undefined
}

export const saveTokenUsage = async (
  aiCommand: AiCommandOptionInterface,
  usageType: 'complete' | 'embedding',
  usage: CompletionTokenUsage | EmbeddingTokenUsage,
  finishReason: string | null,
  prompt_or_messages: string,
  team: teams | null,
  account: accounts | null,
  bookmark: BookmarksInterface | null
) => {
  // AI 모델 선택
  const targetModel = AVAILABLE_AI_MODELS.find(
    (model) =>
      model.provider === aiCommand.provider &&
      model.modelVersion === aiCommand.model
  )

  if (!targetModel) return

  if (usageType === 'complete' && isCompleteTokenUsage(usage)) {
    return await prisma.token_usages.create({
      data: {
        team_id: team?.id,
        account_id: account?.id,
        bookmark_id: bookmark?.id,
        prompt_or_messages,
        prompt_tokens: usage.promptTokens,
        completion_tokens: usage.completionTokens,
        total_tokens: usage.totalTokens,
        total_cost_usd: calculateTotalTokenCostForCompleteUsage(
          usage,
          targetModel
        ),
        credits_usage: 0,
        provider: targetModel.provider,
        model: targetModel.modelVersion,
        finishReason,
      },
    })
  } else if (usageType === 'embedding' && isEmbeddingTokenUsage(usage)) {
    return await prisma.token_usages.create({
      data: {
        team_id: team?.id,
        account_id: account?.id,
        bookmark_id: bookmark?.id,
        prompt_or_messages,
        embedding_tokens: usage.tokens,
        total_tokens: usage.tokens,
        total_cost_usd: calculateTotalTokenCostForEmbeddingUsage(
          usage,
          targetModel
        ),
        credits_usage: 0,
        provider: targetModel.provider,
        model: targetModel.modelVersion,
      },
    })
  } else {
    return
  }
}
