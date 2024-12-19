import { bookmarkFieldGenerateScheme } from '@/app/api/schema'
import prisma from '@/app/prisma'
import { registry } from '@/app/registry'
import { AI_COMMAND_OPTIONS, BODY_TEXT_CHUNKS_SIZE } from '@/configs'
import { ENABLE_EMBEDDINGS_BODY_CONTENTS } from '@/configs/ai.config'
import { TIMEOUT_URL_PARSER } from '@/configs/bookmark.config'
import { BookmarksInterface } from '@/types'
import { BookmarkChunksContentsInterface } from '@/types/bookmarks.types'
import { Website_Field, Website_Type } from '@prisma/client'
import { CoreMessage, generateObject } from 'ai'
import axios from 'axios'
import { parse } from 'node-html-parser'

/**
 * Get bookmark data by parse html contents
 * @param url
 * @param htmlContents
 * @returns
 */
export async function getBookmarkData(url: string, htmlContents: string) {
  const urlObj = new URL(url)

  // Parse DOM
  const dom = parse(htmlContents)

  // Get title
  const title = dom.querySelector('title')

  // Get description
  const description =
    dom.querySelector('meta[name="description"]') ||
    dom.querySelector('meta[name="Description"]')
  const descriptionContent = description?.getAttribute('content')

  // Get keywords
  const keywords =
    dom.querySelector('meta[name="keywords"]') ||
    dom.querySelector('meta[name="Keywords"]')
  const keywordsContent = keywords?.getAttribute('content')

  // Get canonical
  const canonical = dom.querySelector('link[rel="canonical"]')
  const canonicalContent = canonical?.getAttribute('href')

  // Get author
  const author = dom.querySelector('meta[name="author"]')
  const authorContent = author?.getAttribute('content')

  // Get og title
  const ogTitle = dom.querySelector('meta[property="og:title"]')
  const ogTitleContent = ogTitle?.getAttribute('content')

  // Get og description
  const ogDescription = dom.querySelector('meta[property="og:description"]')
  const ogDescriptionContent = ogDescription?.getAttribute('content')

  // Get og image
  const ogImage = dom.querySelector('meta[property="og:image"]')
  const ogImageContent = ogImage?.getAttribute('content')

  // Get tld
  const hostname = urlObj.hostname
  const tld = hostname.split('.').slice(-2).join('.')

  // Get cached site data for favicon
  const cachedSite = await prisma.sites.findFirst({
    where: {
      hostname,
    },
    select: {
      sitename: true,
      favicon: true,
    },
  })

  let faviconContent = cachedSite?.favicon || ''

  // Get favicon if not cached
  if (!cachedSite?.favicon) {
    const faviconIcons = dom.querySelectorAll('link[rel="icon"]')
    // Get favicon with most size
    const favicon =
      faviconIcons.length > 0
        ? faviconIcons.reduce((prev, current) => {
            if (!prev) return current

            const prevSize = prev.getAttribute('sizes')
            const currentSize = current.getAttribute('sizes')

            if (!prevSize && !currentSize) return prev
            if (!prevSize) return current
            if (!currentSize) return prev

            const prevSizeNum = parseInt(prevSize.split('x')[0])
            const currentSizeNum = parseInt(currentSize.split('x')[0])

            return prevSizeNum > currentSizeNum ? prev : current
          })
        : null
    const faviconShortcut =
      dom.querySelector('link[rel="shortcut icon"]') ||
      dom.querySelector('link[rel="SHORTCUT ICON"]')
    const appleTouchIcon = dom.querySelector('link[rel="apple-touch-icon"]')

    // Find first img tag containing 'logo' in src or alt path
    const logoImg = dom.querySelector('img[src*="logo"], img[alt*="logo"]')
    const faviconImgLogo = logoImg?.getAttribute('src') || ''

    // Get available favicons
    const availableFavicons = [
      favicon?.getAttribute('href'),
      faviconShortcut?.getAttribute('href'),
      appleTouchIcon?.getAttribute('href'),
      faviconImgLogo,
    ].filter((x) => x) as string[]

    // Iterate over available favicons
    const promises = await availableFavicons.map(async (favicon) => {
      if (faviconContent) return

      let faviconTest = favicon
      // Add hostname of url if faviconContent is relative path
      if (
        !faviconTest.startsWith('http') &&
        !faviconTest.startsWith('https') &&
        !faviconTest.startsWith('//')
      ) {
        // if faviconContent is not start with /, add / to the start
        if (!faviconTest.startsWith('/')) {
          faviconTest = `/${faviconTest}`
        }

        faviconTest = `${urlObj.protocol}//${urlObj.hostname}${faviconTest}`
      }

      try {
        const res = await axios.get(faviconTest, {
          responseType: 'arraybuffer',
        })

        if (res && res.data) {
          const imageBase64 = Buffer.from(res.data, 'binary').toString('base64')
          faviconContent = `data:${
            res.headers['content-type']
              ? res.headers['content-type'].toLowerCase()
              : 'png'
          };base64,${imageBase64}`
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error occurred while fetching favicon', e)
        }
      }
    })

    await Promise.all(promises)
  }

  // Get Sitename
  const siteName = dom.querySelector('meta[property="og:site_name"]')
  const siteNameContent = siteName?.getAttribute('content')

  // Get charset (or charSet)
  const charset = dom.querySelector('meta[charset]')
  const charsetContent =
    charset?.getAttribute('charset') || charset?.getAttribute('charSet')

  // Get lang
  const html = dom.querySelector('html')
  const langContent = html?.getAttribute('lang')

  // Remove all unnecessary tags
  dom
    .querySelectorAll('style, script, img, svg, link')
    .forEach((x) => x.remove())

  // Get text of body tag
  const body = dom.querySelector('body')
  let bodyText = ''
  let bodyChunks: BookmarkChunksContentsInterface[] = [
    {
      type: 'META',
      content: `${ogTitleContent || title?.text} : ${
        ogDescriptionContent || descriptionContent
      }`,
    },
  ]

  if (keywordsContent) {
    const keywordsWords = keywordsContent.split(',')
    for (let i = 0; i < keywordsWords.length; i += BODY_TEXT_CHUNKS_SIZE) {
      bodyChunks.push({
        type: 'META',
        content: keywordsWords.slice(i, i + BODY_TEXT_CHUNKS_SIZE).join(' '),
      })
    }
  }

  if (body) {
    // Replace all span and code tags with text
    body.querySelectorAll('span, code').forEach((x) => {
      x.replaceWith(x.text)
    })

    // Remove all span tags and replace with text
    body.querySelectorAll('span').forEach((x) => {
      x.replaceWith(x.text)
    })

    bodyText = body?.text

    // Remove new line, tab, multiple spaces
    if (bodyText) {
      bodyText = bodyText
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/ +/g, ' ')
        .trim()
    }

    const bodyWords = bodyText.split(' ')

    // Split body words and push to bodyChunks (by BODY_TEXT_CHUNKS_SIZE)
    if (ENABLE_EMBEDDINGS_BODY_CONTENTS) {
      for (let i = 0; i < bodyWords.length; i += BODY_TEXT_CHUNKS_SIZE) {
        bodyChunks.push({
          type: 'BODY',
          content: bodyWords.slice(i, i + BODY_TEXT_CHUNKS_SIZE).join(' '),
        })
      }
    }
  }

  const isIframeOnly = body?.querySelector('iframe') && !bodyText

  let iframeSrc = ''
  if (isIframeOnly) {
    iframeSrc = body?.querySelector('iframe')?.getAttribute('src') || ''

    // If iframe src is relative path, add hostname of url
    if (
      iframeSrc &&
      !iframeSrc.startsWith('http') &&
      !iframeSrc.startsWith('https') &&
      !iframeSrc.startsWith('//')
    ) {
      // if iframeSrc is not start with /, add / to the start
      if (!iframeSrc.startsWith('/')) {
        iframeSrc = `/${iframeSrc}`
      }

      iframeSrc = `${urlObj.protocol}//${urlObj.hostname}${iframeSrc}`
    }
  }

  return {
    tld,
    hostname: urlObj.hostname,
    canonical: canonicalContent,
    title: ogTitleContent || title?.text,
    description: ogDescriptionContent || descriptionContent,
    favicon: faviconContent,
    thumbnail: ogImageContent,
    author: authorContent,
    chatset: charsetContent,
    lang: langContent,
    sitename: siteNameContent,
    bodyText,
    bodyChunks,
    isIframeOnly,
    iframeSrc,
  }
}

/**
 * Get bookmark data without contents
 * @param url
 * @param htmlContents
 * @returns
 */
export async function getBookmarkDataWithoutContents(url: string) {
  const urlObj = new URL(url)
  const hostname = urlObj.hostname
  const tld = hostname.split('.').slice(-2).join('.')

  // Get cached site data
  const cachedSite = await prisma.sites.findFirst({
    where: {
      hostname,
    },
    select: {
      sitename: true,
      favicon: true,
    },
  })

  return {
    tld,
    hostname: urlObj.hostname,
    canonical: url,
    title: cachedSite?.sitename ? cachedSite.sitename : url,
    description: '',
    favicon: cachedSite?.favicon ? cachedSite.favicon : '',
    thumbnail: '',
    author: '',
    chatset: '',
    lang: '',
    sitename: url,
    bodyText: url,
    bodyChunks: [],
    isIframeOnly: false,
    iframeSrc: '',
  }
}

/**
 * Request bookmark url
 * @param url
 * @returns
 */
export const requestUrlUsingCurl = async (url: string) => {
  if (!process.env.URL_PARSER_URL) return ''

  try {
    const res = await fetch(process.env.URL_PARSER_URL + '/curl', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    })

    const status = await res.status
    const html = await res.text()

    return status === 200 ? html : ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

/**
 * Request bookmark url
 * @param urlParsed
 * @returns
 */
export const requestUrl = async (urlParsed: string, navigator?: Navigator) => {
  let htmlContents = ''

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('requestUrlUsingPuppeteer')
    }
    htmlContents = (await requestUrlUsingPuppeteer(urlParsed)) as string

    if (!htmlContents) {
      if (process.env.NODE_ENV === 'development') {
        console.log('requestBookmarkUrl')
      }
      htmlContents = (await requestBookmarkUrl(urlParsed, navigator)) as string
    }

    if (!htmlContents) {
      if (process.env.NODE_ENV === 'development') {
        console.log('requestBookmarkUrlNoHeader')
      }
      htmlContents = (await requestBookmarkUrlNoHeader(urlParsed)) as string
    }
  } catch (e) {
    console.log(e)
  }

  return htmlContents
}

/**
 * Request bookmark url
 * @param url
 * @returns
 */
export const requestUrlUsingPuppeteer = async (url: string) => {
  if (!process.env.URL_PARSER_URL) return ''

  try {
    const res = await fetch(process.env.URL_PARSER_URL + '/puppeteer', {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_URL_PARSER),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: process.env.URL_PARSER_TOKEN || '',
      },
      body: JSON.stringify({
        url,
      }),
    })

    const status = await res.status
    const html = await res.text()

    return status === 200 ? html : ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

/**
 * Request bookmark url
 * @param url
 * @returns
 */
export const requestBookmarkUrl = async (
  url: string,
  navigator?: Navigator
) => {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'User-Agent': navigator
          ? navigator.userAgent
          : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'text/html,*/*',
        'Accept-Language': navigator ? navigator.language : 'en-US',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
    })
    const html = await res.text()

    return html
  } catch (e) {
    console.log(e)
    return ''
  }
}

/**
 * Request bookmark url without header
 * @param url
 * @returns
 */
export const requestBookmarkUrlNoHeader = async (url: string) => {
  try {
    const res = await fetch(url)
    const html = await res.text()

    return html
  } catch (e) {
    console.log(e)
    return ''
  }
}

export type ActionType = 'add' | 'remove' | 'update'

/**
 * Set team tags cloud action
 * @param action
 * @param teamId
 * @param tags
 * @param bookmarkId
 * @returns
 */
export const setTeamTagsCloudAction = async (
  action: ActionType,
  teamId: string,
  tags: string[],
  bookmark?: BookmarksInterface | null
) => {
  if (!teamId) return

  const currentTags = await prisma.team_tags.findMany({
    where: {
      team_id: teamId,
    },
    select: {
      tag: true,
      quantity: true,
    },
  })

  if (action === 'add') {
    const newTags = tags.filter(
      (x) => !currentTags.some((y) => y.tag === x.trim())
    )
    const updatedTags = tags.filter((x) =>
      currentTags.some((y) => y.tag === x.trim())
    )

    if (newTags.length > 0) {
      await prisma.team_tags.createMany({
        data: newTags.map((x) => ({
          team_id: teamId,
          tag: x.trim(),
          quantity: 1,
        })),
      })
    }

    if (updatedTags.length > 0) {
      await prisma.team_tags.updateMany({
        where: {
          team_id: teamId,
          tag: {
            in: updatedTags,
          },
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      })
    }
  } else if (action === 'update' && bookmark) {
    const oldBookmarkTags = bookmark.tags || []
    const newTags = tags.filter((x) => !oldBookmarkTags.includes(x))
    const updatedTags = tags.filter((x) => oldBookmarkTags.includes(x))
    const removedTags = oldBookmarkTags.filter((x) => !tags.includes(x))

    if (newTags.length > 0) {
      await prisma.team_tags.createMany({
        data: newTags.map((x) => ({
          team_id: teamId,
          tag: x,
          quantity: 1,
        })),
      })
    }

    if (updatedTags.length > 0) {
      await prisma.team_tags.updateMany({
        where: {
          team_id: teamId,
          tag: {
            in: updatedTags,
          },
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      })
    }

    if (removedTags.length > 0) {
      await prisma.team_tags.updateMany({
        where: {
          team_id: teamId,
          tag: {
            in: removedTags,
          },
          quantity: {
            gt: 0,
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      })
    }
  } else if (action === 'remove') {
    if (tags.length > 0) {
      await prisma.team_tags.updateMany({
        where: {
          team_id: teamId,
          tag: {
            in: tags,
          },
          quantity: {
            gt: 0,
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      })
    }
  }
}

/**
 * Set team website type cloud action
 * @param action
 * @param teamId
 * @param websiteType
 * @param bookmark
 * @returns
 */
export const createNewBookmarkField = async (bookmark_field: string) => {
  const bookmarkFieldCommand = AI_COMMAND_OPTIONS.find(
    (p) => p.command === 'generate_bookmark_fields'
  )

  if (!bookmark_field || !bookmarkFieldCommand) return

  // Set messages
  const messages: CoreMessage[] = []

  bookmarkFieldCommand.prompts?.forEach((prompt) => {
    messages.push({
      role: 'user',
      content: prompt.replace('#####NEW_FIELD#####', bookmark_field),
    })
  })

  const { object } = await generateObject({
    model: registry.languageModel(
      `${bookmarkFieldCommand.provider}:${bookmarkFieldCommand.model}`
    ),
    schema: bookmarkFieldGenerateScheme,
    mode: 'json',
    messages,
  })

  return await prisma.bookmark_fields.create({
    data: {
      label: bookmark_field,
      emoji: object.emoji,
      label_ko: object.label_ko,
      label_en: object.label_en,
    },
  })
}

/**
 * Set team website type cloud action
 * @param action
 * @param teamId
 * @param websiteType
 * @param bookmark
 * @returns
 */
export const setTeamWebsiteTypeCloudAction = async (
  action: ActionType,
  teamId: string,
  websiteType: Website_Type,
  bookmark?: BookmarksInterface | null
) => {
  if (!teamId) return

  const currentWebsiteType = await prisma.team_website_types.findFirst({
    where: {
      team_id: teamId,
      type: websiteType,
    },
    select: {
      type: true,
      quantity: true,
    },
  })

  if (action === 'add') {
    if (currentWebsiteType) {
      await prisma.team_website_types.updateMany({
        where: {
          team_id: teamId,
          type: websiteType,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      })
    } else {
      await prisma.team_website_types.create({
        data: {
          team_id: teamId,
          type: websiteType,
          quantity: 1,
        },
      })
    }
  } else if (
    action === 'update' &&
    bookmark &&
    bookmark.website_type !== websiteType
  ) {
    await prisma.team_website_types.updateMany({
      where: {
        team_id: teamId,
        type: bookmark.website_type,
        quantity: {
          gt: 0,
        },
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })

    await prisma.team_website_types.updateMany({
      where: {
        team_id: teamId,
        type: websiteType,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    })
  } else if (action === 'remove') {
    await prisma.team_website_types.updateMany({
      where: {
        team_id: teamId,
        type: websiteType,
        quantity: {
          gt: 0,
        },
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })
  }
}

/**
 * Set team website field cloud action
 * @param action
 * @param teamId
 * @param websiteField
 * @param bookmark
 * @returns
 */
export const setTeamWebsiteFieldCloudAction = async (
  action: ActionType,
  teamId: string,
  websiteField: Website_Field,
  bookmark?: BookmarksInterface | null
) => {
  if (!teamId) return

  const currentWebsiteField = await prisma.team_website_fields.findFirst({
    where: {
      team_id: teamId,
      field: websiteField,
    },
    select: {
      field: true,
      quantity: true,
    },
  })

  if (action === 'add') {
    if (currentWebsiteField) {
      await prisma.team_website_fields.updateMany({
        where: {
          team_id: teamId,
          field: websiteField,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      })
    } else {
      await prisma.team_website_fields.create({
        data: {
          team_id: teamId,
          field: websiteField,
          quantity: 1,
        },
      })
    }
  } else if (
    action === 'update' &&
    bookmark &&
    bookmark.website_field !== websiteField
  ) {
    await prisma.team_website_fields.updateMany({
      where: {
        team_id: teamId,
        field: bookmark.website_field,
        quantity: {
          gt: 0,
        },
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })

    await prisma.team_website_fields.updateMany({
      where: {
        team_id: teamId,
        field: websiteField,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    })
  } else if (action === 'remove') {
    await prisma.team_website_fields.updateMany({
      where: {
        team_id: teamId,
        field: websiteField,
        quantity: {
          gt: 0,
        },
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })
  }
}

/**
 * Set team website field cloud action
 * @param action
 * @param teamId
 * @param bookmarkFieldLabel
 * @param bookmark
 * @returns
 */
export const setTeamBookmarkFieldCloudAction = async (
  action: ActionType,
  teamId: string,
  bookmarkFieldLabel: string,
  bookmark?: BookmarksInterface | null
) => {
  if (!teamId) return

  const currentWebsiteField = await prisma.team_bookmark_fields.findFirst({
    where: {
      team_id: teamId,
      bookmark_field: bookmarkFieldLabel,
    },
    select: {
      bookmark_field: true,
      quantity: true,
    },
  })

  if (action === 'add') {
    if (currentWebsiteField) {
      await prisma.team_bookmark_fields.updateMany({
        where: {
          team_id: teamId,
          bookmark_field: bookmarkFieldLabel,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      })
    } else {
      await prisma.team_bookmark_fields.create({
        data: {
          team_id: teamId,
          bookmark_field: bookmarkFieldLabel,
          quantity: 1,
        },
      })
    }
  } else if (
    action === 'update' &&
    bookmark &&
    bookmark.bookmark_field !== bookmarkFieldLabel
  ) {
    await prisma.team_bookmark_fields.updateMany({
      where: {
        team_id: teamId,
        bookmark_field: bookmarkFieldLabel,
        quantity: {
          gt: 0,
        },
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })

    await prisma.team_bookmark_fields.updateMany({
      where: {
        team_id: teamId,
        bookmark_field: bookmarkFieldLabel,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    })
  } else if (action === 'remove') {
    await prisma.team_bookmark_fields.updateMany({
      where: {
        team_id: teamId,
        bookmark_field: bookmarkFieldLabel,
        quantity: {
          gt: 0,
        },
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })
  }
}
