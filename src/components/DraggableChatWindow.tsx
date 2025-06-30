import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useData } from "@/context/DataWrapper"
import { useAppSelector } from "@/store/store"
import { v4 as uuidv4 } from "uuid"
import { addChat } from "@/reducers/chatReducer"
import { useDispatch } from "react-redux"
import { getTimeStampInIndian } from "@/functions/generalFn"
import { FaTimes, FaPaperPlane, FaCopy, FaCheck, FaArrowDown, FaExpand, FaCompress } from "react-icons/fa"

const DraggableChatWindow = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showNewIndicator, setShowNewIndicator] = useState(false)
  const [isResized, setIsResized] = useState(false)
  const [msg, setMsg] = useState("")
  const [isAtBottom, setIsAtBottom] = useState(true)

  const { chatToggle, setChatToggle, unreadCount, setUnreadCount, socket, socket2, name } = useData()
  const { candid, isHost } = useAppSelector((state) => state.qpReducer)
  const [chats] = useAppSelector((state) => [state.chatReducer])
  const dispatch = useDispatch()
  const chatDivRef = useRef<HTMLDivElement | null>(null)
  const lastMessageCountRef = useRef(0)

  // Get viewport bounds for constraining drag
  const getViewportBounds = useCallback(() => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const elementWidth = isResized ? 840 : 420
    const elementHeight = 580

    return {
      minX: 0,
      minY: 0,
      maxX: windowWidth - elementWidth,
      maxY: windowHeight - elementHeight,
    }
  }, [isResized])

  // Constrain position within viewport bounds
  const constrainPosition = useCallback(
    (pos: { x: number; y: number }) => {
      const bounds = getViewportBounds()
      return {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y)),
      }
    },
    [getViewportBounds],
  )

  const isCodeMessage = useCallback((message: string) => {
    const codePatterns = [
      /^```[\s\S]*```$/m,
      /^\s*[{}[\]();,]\s*$/m,
      /^\s*(function|const|let|var|if|else|for|while|return|import|export|class)\s+/m,
      /^\s*\/\/.*$/m,
      /^\s*\/\*[\s\S]*?\*\/\s*$/m,
      /^[^a-zA-Z]*[{}[\]();]+[^a-zA-Z]*$/m,
    ]

    let codeScore = 0
    if (/[{}]/.test(message) && /[;]/.test(message)) codeScore += 2
    if (/^\s{2,}/m.test(message)) codeScore += 1
    if (/\b(function|const|let|var|if|else|for|while|return)\b/.test(message)) codeScore += 2
    if (/\/\/|\/\*|\*\//.test(message)) codeScore += 2
    if (/=>|===|!==|\+\+|--/.test(message)) codeScore += 1
    if (/console\.(log|error|warn)/.test(message)) codeScore += 2
    if (/<\/?[a-z][^>]*>/i.test(message)) codeScore += 1

    const lines = message.split("\n")
    if (lines.length > 2 && lines.filter((line) => /^\s+/.test(line)).length > 1) codeScore += 1

    return codeScore >= 3 || codePatterns.some((pattern) => pattern.test(message))
  }, [])

  const toggleResize = () => {
    setIsResized((prev) => {
      const newResized = !prev
      // Adjust position if needed when resizing to prevent going out of bounds
      setTimeout(() => {
        setPosition((current) => constrainPosition(current))
      }, 0)
      return newResized
    })
  }

  // Improved drag handlers using the LiveTranscription approach
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    const rect = windowRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    // Add dragging class to body to prevent text selection globally
    document.body.classList.add("dragging")
    document.body.style.userSelect = "none"
    document.body.style.cursor = "grabbing"
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newPosition = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    }

    setPosition(constrainPosition(newPosition))
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    // Remove dragging styles
    document.body.classList.remove("dragging")
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }

  // Event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, constrainPosition])

  // Handle window resize to keep chat window in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => constrainPosition(current))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [constrainPosition])

  const handleSendMessage = () => {
    if (!socket || !socket2 || msg.trim() === "") return

    const tempMsg = {
      id: uuidv4(),
      name,
      timeStamp: new Date().toLocaleTimeString(),
      isOutgoing: true,
      msg,
    }

    const tempOb = {
      msg,
      type: isHost ? "recruiter" : "candidate",
      username: name,
      timestamp: getTimeStampInIndian(),
      candid,
    }

    socket.emit("send-msg", tempMsg)
    socket2.emit("chatmessage_req", tempOb)
    dispatch(addChat(tempMsg))
    setMsg("")
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Copy failed: ", err)
    }
  }

  const handleScroll = () => {
    const chatDiv = chatDivRef.current
    if (!chatDiv) return

    const distanceFromBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight
    const currentlyAtBottom = distanceFromBottom < 50

    setIsAtBottom(currentlyAtBottom)

    if (currentlyAtBottom) {
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
          chatDiv.scrollTop = chatDiv.scrollHeight
          setUnreadCount(0)
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
    if (isAtBottom) setUnreadCount(0)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    const chatDiv = chatDivRef.current
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight
      setIsAtBottom(true)
      setShowNewIndicator(false)
      setUnreadCount(0)
    }
  }

  if (!chatToggle) return null

  return (
    <>
      {/* Global styles for dragging */}
      <style jsx global>{`
        .dragging {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        
        .dragging * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
      `}</style>

      <div
        ref={windowRef}
        className={`fixed bg-white border border-gray-600 rounded-xl shadow-2xl flex flex-col z-[9999] select-none ${
          isResized ? "w-[840px]" : "w-[420px]"
        } h-[580px]`}
        style={{
          top: position.y,
          left: position.x,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div
          className="bg-zinc-900 border-b border-gray-100 px-4 py-3 rounded-t-xl flex justify-between items-center select-none"
          onMouseDown={handleMouseDown}
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <div className="flex items-center space-x-2 pointer-events-none">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-m font-bold text-white">Chat Window</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleResize}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 pointer-events-auto"
              title={isResized ? "Shrink" : "Expand"}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {isResized ? <FaCompress size={14} /> : <FaExpand size={14} />}
            </button>
            <button
              onClick={handleToCloseChatBar}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 pointer-events-auto"
              aria-label="Close chat"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        <div ref={chatDivRef} className="relative flex-1 p-4 overflow-y-auto" onScroll={handleScroll}>
          <div className="space-y-3">
            {chats.map((chat, index) => {
              const isCode = isCodeMessage(chat.msg)
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
                      {isCode ? (
                        <div className="relative group">
                          <pre className="text-m font-mono whitespace-pre-wrap overflow-x-auto bg-gray-900 text-gray-200 p-3 rounded-lg border">
                            <code>{chat.msg}</code>
                          </pre>
                          <button
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-800 rounded"
                            onClick={() => handleCopy(chat.msg, messageId)}
                            title="Copy code"
                          >
                            {copiedId === messageId ? (
                              <FaCheck size={12} className="text-green-400" />
                            ) : (
                              <FaCopy size={12} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm whitespace-pre-wrap leading-relaxed">{chat.msg}</span>
                      )}
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
              <span>{unreadCount > 1 ? `${unreadCount} New Messages` : "New Message"}</span>
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
    </>
  )
}

export default DraggableChatWindow
