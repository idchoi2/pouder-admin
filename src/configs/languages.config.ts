import { Locale } from '@/locales/locale.config'
import { Supported_Language } from '@prisma/client'

export const SUPPORTED_LANGUAGES = Object.values(Supported_Language)

export const DEFAULT_LANGUAGE: Supported_Language = 'ENGLISH'

export const LANGUAGE_KEY_BY_LOCALES: Record<Locale, Supported_Language> = {
  en: 'ENGLISH',
  ko: 'KOREAN',
} as const
