import { useState, useEffect, useRef } from "react"
import { useData } from "@/context/DataWrapper"
import { useAppSelector } from "@/store/store"
import { v4 as uuidv4 } from "uuid"
import { addChat } from "@/reducers/chatReducer"
import { useDispatch } from "react-redux"
import { getTimeStamp,getTimeStampInIndian } from "@/functions/generalFn"
import { FaTimes, FaPaperPlane, FaCopy, FaCheck } from "react-icons/fa"

const DraggableChatWindow = () => {

  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const { chatToggle, setChatToggle, setUnreadCount, socket, socket2, name } = useData()
  console.log("chatToggle", chatToggle, "name", name, "socket", socket, "socket2", socket2)
  const { candid, isHost } = useAppSelector((state) => state.qpReducer)
  const isUserScrolling = useRef(false)
  const dispatch = useDispatch()
  const [msg, setMsg] = useState("")
  const chatDivRef = useRef(null)
  const [chats] = useAppSelector((state) => [state.chatReducer])
  const chatWindowRef = useRef(null)
  
 //code checker logic
  const isCodeMessage = (message) => {
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
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    chatWindowRef.current.startX = e.clientX - position.x
    chatWindowRef.current.startY = e.clientY - position.y
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - chatWindowRef.current.startX,
      y: e.clientY - chatWindowRef.current.startY,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSendMessage = () => {
    if (socket === null || socket2 === null || msg === "") return

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
    console.log(tempOb,"to backend socket");

    socket.emit("send-msg", tempMsg)
    socket2.emit("chatmessage_req", tempOb)
    dispatch(addChat(tempMsg))
    setMsg("")
  }

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleScroll = () => {
    const chatDiv = chatDivRef.current
    if (chatDiv) {
      const isAtBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 20
      isUserScrolling.current = !isAtBottom
    }
  }

  useEffect(() => {
    const chatDiv = chatDivRef.current
    if (chatDiv) {
      chatDiv.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (chatDiv) {
        chatDiv.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (chatDivRef.current && !isUserScrolling.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight
    }
  }, [chats])

  const handleToCloseChatBar = () => {
    setChatToggle(false)
    setUnreadCount(0)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  if (!chatToggle) return null

  return (
    <div
      ref={chatWindowRef}
      className="fixed bg-white border border-gray-600 rounded-xl shadow-2xl w-[420px] h-[580px] flex flex-col z-50"
      style={{ top: position.y, left: position.x }}
    >
      {/* Header */}
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


      <div ref={chatDivRef} className="flex-1 p-4 overflow-y-auto" onScroll={handleScroll}>
        <div className="space-y-3">
          {chats.map((chat, index) => {
            const isCode = isCodeMessage(chat.msg)
            const messageId = `${chat.id || index}-${chat.timeStamp}`

            return (
              <div key={index} className="flex flex-col">
               
                <div className={`text-s font-medium mb-1 ${chat.name === name ? "text-right text-gray-600" : "text-left text-gray-600"}`}>
                    {chat.name}
                  </div>

                {/* Message bubble */}
                <div className={`flex ${chat.name === name ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] ${
                      chat.name === name
                        ? "bg-zinc-500 text-white"
                        : "bg-white text-black border border-gray-300"
                    }`}
                  >
                    {isCode ? (
                      <div className="relative group">
                        <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto bg-gray-900 text-gray-400 p-3 rounded-lg border">
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
              e.target.style.height = "auto"
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"
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