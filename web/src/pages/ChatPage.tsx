import React,{ useEffect, useState } from "react";
import SideBar from "../components/side-bar";
import ChatSection from "../components/chat-section";
import RightBar from "../components/right-bar";
import { userType , MessageTypes} from "../types";
import io from "socket.io-client";
import { log } from "console";
export const socket = io("http://localhost:1337");
 const userId = localStorage.getItem("userId") ;

const ChatPage = () => {
  console.log(userId);
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [receiver, setReceiver] = useState<userType | null>(null);
  const [unreadmessage, setUnreadmessage] = useState(new Map<string, number>());

useEffect(() => {
  console.log(messages);
}
, [messages]);
  
  const selectReceiver = async (receiver: userType) => {
    const generatedChatId = [receiver._id, userId].sort().join("-");
    setChatId(generatedChatId);
    setReceiver(receiver);

    socket.emit("join-chat", {
      receiverId: receiver._id,
      senderId: userId,
      chatId: generatedChatId,
    });
  };

  useEffect(() => {
    const handleJoinChat = (data: any) => {
      const { receiverId, chatId } = data;
      if (receiverId !== userId) return;
      setChatId(chatId);
      socket.emit("join-req-accept", chatId);
    };

    const handleReceiveMessages = (newMessage: MessageTypes) => {
      setMessages((messages) => [...messages, newMessage]);

      if (receiver?._id === newMessage.sender) return;

  
    };


    socket.on("join-chat-req", handleJoinChat);
      socket.on("receive-message", handleReceiveMessages);

      return () => {
        socket.off("join-chat");
        socket.off("join-chat-req");
        socket.off("join-req-accept");
        socket.off("receive-message");
      };
  }, [receiver]);

  return (
    <main className="  w-full  h-screen   overflow-hidden   bg-gray-100 ">
      <div className="flex flex-row  ">
        <SideBar  
          selectReceiver={selectReceiver}
          receiverId={receiver?._id}
        />
        {receiver ? 
          <ChatSection 
            chatId={chatId}
            messages={messages}
            setMessages={setMessages}
            receiver={receiver._id}
          /> :   <div className=' flex-initial relative  w-4/5 my-5 rounded-2xl bg-white  h-[calc(100vh-<height-of-your-fixed-div>)]' >
      </div>
          
        }

        <RightBar/>
      </div>
      
    </main>
  );

};

export default ChatPage;
