'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useChatsList, useResetChatsList } from '@/hooks'
import { scrollChatConversationBottom } from '@/lib/utils'
import {
  chatConversationInfoAtom,
  openChatConversationModalAtom,
} from '@/states/atoms/chats.atoms'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import ChatBookmarks from './ChatBookmarks'
import ChatConversationChatItem from './ChatConversationChatItem'

function ChatConversationModal() {
  const params = useParams()

  // Recoil
  const [openChatConversationModal, setOpenChatConversationModal] =
    useRecoilState(openChatConversationModalAtom)
  const [chatConversationInfo, setChatConversationInfo] = useRecoilState(
    chatConversationInfoAtom
  )

  // Hooks
  const {
    data: chats,
    isFetching,
    isFetched,
    refetch: refetchChats,
  } = useChatsList(chatConversationInfo?.id as string)
  const { refetch: resetChats } = useResetChatsList()

  // Effect
  useEffect(() => {
    if (chatConversationInfo) {
      refetchChats()
    } else {
      resetChats()
    }
  }, [chatConversationInfo])

  useEffect(() => {
    if (openChatConversationModal && chats && isFetched) {
      setTimeout(() => {
        scrollChatConversationBottom()
        adjustCitePopupPosition()

        document.getElementById('chat-modal-prompt-input')?.focus()
      })
    }
  }, [chats, isFetched])

  /**
   * Sheet 닫기 핸들러
   */
  const onHandleCloseSheet = useCallback((open: boolean) => {
    setOpenChatConversationModal(open)
    setChatConversationInfo(null)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', adjustCitePopupPosition)
  }, [])

  /**
   * Cite 팝업 위치 조정
   */
  const adjustCitePopupPosition = () => {
    const cites = document.querySelectorAll('cite')

    // Adjust cite popup (.cite-popup) of .cite
    // Cite popup position is absolute and left: 0 by default
    // If the cite popup is out of the viewport, adjust the position of left
    cites.forEach((cite) => {
      const citePopup = cite.querySelector('.cite-popup') as HTMLDivElement
      if (!citePopup) return

      const citeRect = cite.getBoundingClientRect()
      const citePopupRect = citePopup.getBoundingClientRect()

      // Adjust left
      if (citeRect.left + citePopupRect.width > window.innerWidth) {
        citePopup.style.left = `${
          window.innerWidth - (citeRect.left + citePopupRect.width) - 12
        }px`
      } else {
        citePopup.style.left = '0'
      }
    })
  }

  return (
    <Sheet open={openChatConversationModal} onOpenChange={onHandleCloseSheet}>
      <SheetContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-full w-full lg:w-[900px] px-0 pb-0">
        <SheetHeader className="px-6">
          <SheetTitle>
            {chatConversationInfo?.title || 'Chat Conversation'}
          </SheetTitle>
        </SheetHeader>
        <div className="py-7 relative h-full">
          {chats && chats.list && (
            <div
              id="chat-list"
              className="overflow-y-auto h-full scroll-smooth px-6 relative space-y-4">
              {chats.list && chats.list[0] && (
                <ChatBookmarks chat={chats.list[0]} />
              )}
              <ul className="pb-28 space-y-2">
                {chats.list.map((chat, idx) => (
                  <ChatConversationChatItem key={chat.id} chat={chat} />
                ))}
              </ul>
              {isFetching && (
                <div className="flex justify-center">
                  <Loader className="animate-spin mr-2" size={18} />
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ChatConversationModal
