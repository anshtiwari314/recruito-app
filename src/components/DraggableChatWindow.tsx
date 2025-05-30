import React, { useState,useEffect, useRef } from "react";
import { useData } from "@/context/DataWrapper";
import { useAppSelector } from "@/store/store";
import { v4 as uuidv4 } from "uuid";
import { addChat } from "../reducers/chatReducer";
import { useDispatch } from "react-redux";
import { getTimeStamp } from "../functions/generalFn";



const DraggableChatWindow = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  // const {chatToggle,setChatToggle,socket,name} = useData()
   const {chatToggle,setChatToggle,socket,socket2,name} = useData()
  const {candid,isHost} = useAppSelector(state=>state.qpReducer)
  const isUserScrolling = useRef(false);
  const dispatch = useDispatch();
 
  const [msg, setMsg] = useState("");
  const chatDivRef = useRef(null)
  

  const [chats] = useAppSelector(state => [state.chatReducer]);
  const chatWindowRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    chatWindowRef.current.startX = e.clientX - position.x;
    chatWindowRef.current.startY = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - chatWindowRef.current.startX,
      y: e.clientY - chatWindowRef.current.startY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSendMessage = () => {
    if(socket===null ||socket2===null|| msg ==='')
      return ;

    let tempMsg= {
      id:uuidv4(),
      name,
      timeStamp:new Date().toLocaleTimeString(),
      isOutgoing:true,
      msg
    }
    let tempOb={
      msg,
      type:isHost?'recruiter':'candidate',
      username:name,
      timestamp:getTimeStamp(),
      candid
    }

    socket.emit('send-msg',tempMsg)
     socket2.emit('chatmessage_req',tempOb)
    dispatch(addChat(tempMsg))
    setMsg('')
  };

  const handleScroll = () => {
    const chatDiv = chatDivRef.current;
    if (chatDiv) {
      // Check if the user is scrolling (not at the bottom)
      //const isAtBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 5 * 16; // 5rem in pixels (assuming 1rem = 16px)
      //isUserScrolling.current = !isAtBottom;
      isUserScrolling.current = false
    }
  };

  useEffect(() => {
    const chatDiv = chatDivRef.current;
    if (chatDiv) {
      chatDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (chatDiv) {
        chatDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  // useEffect(() => {
  //   if (chatDivRef.current) {
  //     //console.log('transcriptions inside content panel is changed')
  //     if (!isUserScrolling.current) {
  //       chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
  //     }  
      
      
  //   }
  // }, [chats]);
  const handleKeyPress=(event)=>{
    if(event.key==='Enter')
    {
      handleSendMessage();
    }
  }

  if(chatToggle)
  return (
    <div
      ref={chatWindowRef}
      className="fixed bg-white border border-gray-300 rounded-lg shadow-lg w-fit h-[60vh] flex flex-col z-10"
      style={{ top: position.y, left: position.x }}
      
    // onMouseUp={handleMouseUp}
    >
        
      {/* Header */}
      <div
        className="bg-gray-500 text-white font-bold px-4 py-2 cursor-move rounded-t-lg flex justify-between"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div>
        Chat Window
        </div>
        <div style={{cursor:'pointer'}} onClick={()=>setChatToggle(false)}>
        <i className="fa-solid fa-xmark text-black-500 fa-lg"></i>
        </div>
        
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-100" ref={chatDivRef}>
        {chats.map((chat, index) => (
          <div
            key={index}
           // className={`px-4 py-2 rounded-lg`}
            style={{display:'flex',flexDirection:'column',width:'100%'}}
          >
            <div style={{textAlign:chat.isOutgoing?'right':'left',fontSize:'0.8rem'}}>{chat.name}</div>
            <div 
                style={{
                    alignItems:'center',
                    justifyContent:'center',
                    width:'75%',
                    //border:'0.1rem solid red'
                    }}
                className={`px-4 py-2 rounded-lg ${chat.isOutgoing 
                ? "bg-gray-500 text-white self-end"
                : "bg-gray-300 text-black self-start"}`}    >
            {chat.msg}
            
            </div>    
            <div style={{textAlign:chat.isOutgoing?'right':'left',fontSize:'0.8rem'}}>{chat.timeStamp}</div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center py-3 px-2 bg-gray-200 border-t border-gray-300">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="ml-1 bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
  else return null 
};

export default DraggableChatWindow;