import { defaultLocale, Locale, locales } from '@/locales/locale.config'
import Cookies from 'js-cookie'

/**
 * Cookie name for user's locale
 */
export const LOCALE_COOKIE_NAME = 'PCH_LOCALE'

/**
 * Get user's locale from cookie
 * @returns
 */
export const getLocaleFromBrowserCookie = () => {
  let localeFromCookie = defaultLocale

  if (
    Cookies.get(LOCALE_COOKIE_NAME) &&
    locales.includes(Cookies.get(LOCALE_COOKIE_NAME) as Locale)
  ) {
    localeFromCookie = Cookies.get(LOCALE_COOKIE_NAME) as Locale
  }

  return localeFromCookie.toUpperCase()
}
