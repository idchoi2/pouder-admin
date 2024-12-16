'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from '@/components/ui/logo'
import { BookmarksInterface, ChatsInterface } from '@/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const delayCopied = 3000
let timerCopiedPrompt: any = null
let timerCopiedAnswer: any = null

function ChatConversationChatItem({ chat }: { chat: ChatsInterface }) {
  // State
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedAnswer, setCopiedAnswer] = useState(false)

  // Memo
  const chatBookmarks = useMemo(() => {
    return (
      chat.chat_bookmarks
        ? chat.chat_bookmarks
            .filter((c) => c && c.bookmarks)
            .map((c) => c.bookmarks)
        : chat.sources && chat.selectedBookmarks
        ? chat.selectedBookmarks.filter(
            (s) => s.url && chat.sources.includes(s.url)
          )
        : []
    ) as BookmarksInterface[]
  }, [chat])

  /**
   * Cite 번호 변환
   * @param answerStr
   * @param bookmarks
   * @returns
   */
  const ConvertCites = (answerStr: string, bookmarks: BookmarksInterface[]) => {
    let answer = answerStr
    let answerDom = document.createElement('div')
    answerDom.innerHTML = answer

    // Iterate <cite> tags
    answerDom.querySelectorAll('cite').forEach((cite, index) => {
      const aTag = cite.querySelector('a')

      // Add cite uuid
      cite.setAttribute('id', `cite-${uuidv4()}`)

      if (aTag) {
        const bookmarkId = aTag.getAttribute('data-id')
        const bookmark = chatBookmarks.find((b) => b.id === bookmarkId)
        const bookmarkIndex =
          bookmarks.findIndex((b) => b.id === bookmarkId) + 1

        if (!bookmark) {
          aTag.remove()
        } else {
          aTag.innerHTML = `${bookmarkIndex}`
          aTag.classList.add('cite-link')
        }
      }

      cite.classList.add('ready')

      cite.addEventListener('mouseenter', () => {
        cite.classList.add('active')
      })
    })

    return answerDom.innerHTML
  }

  /**
   * Cite 팝업 추가
   */
  const addCitesPopup = useCallback(() => {
    const chatAnswerDiv = document.getElementById(`chat-answer-${chat.id}`)

    chatAnswerDiv?.querySelectorAll('cite').forEach((cite, index) => {
      const aTag = cite.querySelector('a')

      if (aTag) {
        const bookmarkId = aTag.getAttribute('data-id')
        const bookmark = chatBookmarks.find((b) => b.id === bookmarkId)

        // Add cite popup child element
        if (bookmark) {
          const citePopup = document.createElement('div')
          citePopup.classList.add('cite-popup')
          citePopup.classList.add('transition-all')
          citePopup.innerHTML = `<a href="${
            bookmark.url
          }" target="_blank" class="space-y-1">
          <div class="font-medium truncate text-sm">${bookmark?.title}</div>
          <div class="flex items-center space-x-1">
            <div class="flex-none w-3 h-3">
              ${
                bookmark.favicon
                  ? `<img src="${bookmark.favicon}" alt="${bookmark?.title}" class="w-3 h-3 object-cover"/>`
                  : `<div class="w-3 h-3 leading-3 rounded-full bg-fuchsia-500 text-white text-center text-[10px] flex justify-center items-center">${
                      (bookmark.title || (bookmark.hostname as string))[0]
                    }</div>`
              }
            </div>
            <div class="w-full truncate text-[11px] text-muted-foreground font-normal">${
              bookmark?.url
            }</div>
          </div>
          </a>`

          cite.appendChild(citePopup)
        }
      }
    })
  }, [chatBookmarks])

  useEffect(() => {
    if (chat && chatBookmarks.length) {
      addCitesPopup()
    }
  }, [chat, chatBookmarks])

  return (
    <li className="space-y-4">
      <div className="flex justify-end">
        <div className="group space-y-2">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {chat.accounts && (
                <Avatar className="flex-none w-4 h-4">
                  <AvatarImage
                    src={chat.accounts.avatar as string}
                    alt={chat.accounts.name}
                  />
                  <AvatarFallback>{chat.accounts.name}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div
              id={`chat-prompt-${chat.id}`}
              className="p-2 rounded-xl bg-secondary text-sm">
              {chat.user_prompt}
            </div>
          </div>
        </div>
      </div>
      <div className={'flex'}>
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1">
            <Logo className="w-4 h-4" />
            <span className="text-sm font-bold">Pouder</span>
          </div>
          <div className="py-2 text-sm">
            {chat.answer && (
              <div id={`chat-answer-${chat.id}`} className="group space-y-2">
                {/* <div
                  className="answer-para"
                  dangerouslySetInnerHTML={{
                    __html: chat.answer,
                  }}
                /> */}
                <div
                  className="answer-para"
                  dangerouslySetInnerHTML={{
                    __html: ConvertCites(chat.answer, chatBookmarks),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export default ChatConversationChatItem
