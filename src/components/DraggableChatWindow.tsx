import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useData } from "@/context/DataWrapper"
import { useAppSelector } from "@/store/store"
import { v4 as uuidv4 } from "uuid"
import { addChat } from "@/reducers/chatReducer"
import { useDispatch } from "react-redux"
import { getTimeStampInIndian } from "@/functions/generalFn"
import { FaTimes, FaPaperPlane, FaCopy, FaCheck, FaArrowDown } from "react-icons/fa"

const DraggableChatWindow = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [showNewIndicator, setShowNewIndicator] = useState(false)

  const { chatToggle, setChatToggle, unreadCount, setUnreadCount, socket, socket2, name } = useData()


  const chatDivRef = useRef<HTMLDivElement | null>(null)
  const chatWindowRef = useRef<HTMLDivElement | null>(null)

  const dispatch = useDispatch()
  const [msg, setMsg] = useState("")

  const [chats] = useAppSelector((state) => [state.chatReducer])

 
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    if (chatWindowRef.current) {
      chatWindowRef.current.startX = e.clientX - position.x
      chatWindowRef.current.startY = e.clientY - position.y
    }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - (chatWindowRef.current?.startX || 0),
      y: e.clientY - (chatWindowRef.current?.startY || 0),
    })
  }
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  const handleSendMessage = () => {
    if (!socket || msg.trim() === "") return;
 
    const tempMsg = {
      id: uuidv4(),
      name,
      timeStamp: new Date().toLocaleTimeString(),
      isOutgoing: true,
      msg,
    };
 
    socket.emit("send-msg", tempMsg);
    dispatch(addChat(tempMsg));
    setMsg("");
  };
 

  const [isAtBottom, setIsAtBottom] = useState(true)
  const lastMessageCountRef = useRef(0)

  const handleScroll = () => {
    const chatDiv = chatDivRef.current
    if (!chatDiv) return

    const distanceFromBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight
    const currentlyAtBottom = distanceFromBottom < 50

    setIsAtBottom(currentlyAtBottom)

    if (currentlyAtBottom) {
      // User scrolled to bottom - clear all indicators
      setShowNewIndicator(false)
      setUnreadCount(0)
    }
  }

  useEffect(() => {
    const div = chatDivRef.current
    if (div) div.addEventListener("scroll", handleScroll)
    return () => {
      if (div) div.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const chatDiv = chatDivRef.current
    if (!chatDiv) return

    if (chats.length > lastMessageCountRef.current) {
      const newMessages = chats.length - lastMessageCountRef.current
      lastMessageCountRef.current = chats.length

      if (isAtBottom) {
        setTimeout(() => {
          if (chatDiv) {
            chatDiv.scrollTop = chatDiv.scrollHeight
            setUnreadCount(0)
          }
        }, 0)
      } else {
        setShowNewIndicator(true)
        setUnreadCount((prev) => prev + newMessages)
      }
    }
  }, [chats, isAtBottom, setUnreadCount])

  useEffect(() => {
    if (chatToggle && isAtBottom) {
      setUnreadCount(0)
    }
  }, [chatToggle, isAtBottom, setUnreadCount])

  const handleToCloseChatBar = () => {
    setChatToggle(false)
    if (isAtBottom) {
      setUnreadCount(0)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  if (!chatToggle) return null

  const scrollToBottom = () => {
    const chatDiv = chatDivRef.current
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight
      setIsAtBottom(true)
      setShowNewIndicator(false)
      setUnreadCount(0)
    }
  }

  return (
    <div
      ref={chatWindowRef}
      className="fixed bg-white border border-gray-600 rounded-xl shadow-2xl w-[420px] h-[580px] flex flex-col z-50"
      style={{ top: position.y, left: position.x }}
    >
      <div
        className="bg-zinc-900 border-b border-gray-100 px-4 py-3 cursor-move rounded-t-xl flex justify-between items-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-m font-bold text-white">Chat Window</span>
        </div>
        <button
          onClick={handleToCloseChatBar}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Close chat"
        >
          <FaTimes size={16} />
        </button>
      </div>

      <div ref={chatDivRef} className="relative flex-1 p-4 overflow-y-auto" onScroll={handleScroll}>
        <div className="space-y-3">
          {chats.map((chat, index) => {
          
            const messageId = `${chat.id || index}-${chat.timeStamp}`

            return (
              <div key={index} className="flex flex-col">
                <div
                  className={`text-s font-medium mb-1 ${
                    chat.name === name ? "text-right text-gray-600" : "text-left text-gray-600"
                  }`}
                >
                  {chat.name}
                </div>

                <div className={`flex ${chat.name === name ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] ${
                      chat.name === name ? "bg-zinc-500 text-white" : "bg-white text-black border border-gray-300"
                    }`}
                  >
                     {chat.msg}
                  </div>
                </div>

                <div className={`text-xs mt-1 text-gray-400 ${chat.isOutgoing ? "text-right" : "text-left"}`}>
                  {chat.timeStamp}
                </div>
              </div>
            )
          })}
        </div>

        {showNewIndicator && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-full flex items-center space-x-1 shadow-lg animate-pulse"
          >
            <FaArrowDown size={12} />
            <span>{unreadCount > 0 ? `${unreadCount} New Message${unreadCount > 1 ? "s" : ""}` : "New Message"}</span>
          </button>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="text-xs text-gray-500 mb-2">Press Enter to send • Shift + Enter for new line</div>
        <div className="flex items-end space-x-2">
          <textarea
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[40px] max-h-[100px] text-sm"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            style={{
              height: "auto",
              minHeight: "40px",
              maxHeight: "100px",
              overflowY: msg.split("\n").length > 3 ? "scroll" : "hidden",
            }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto"
              e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 100) + "px"
            }}
          />
          <button
            onClick={handleSendMessage}
            className={`p-2 rounded-xl transition-colors ${
              msg.trim() ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!msg.trim()}
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DraggableChatWindow
