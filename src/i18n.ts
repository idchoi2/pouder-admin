import { getUserLocale } from '@/locales'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
    messages: (await import(`@/locales/messages/${locale}.json`)).default,
  }
})
