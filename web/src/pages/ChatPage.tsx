import React,{ useEffect, useState } from "react";
import SideBar from "../components/side-bar";
import ChatSection from "../components/chat-section";
import RightBar from "../components/right-bar";
import { userType , MessageTypes} from "../types";
import io from "socket.io-client";
export const socket = io("http://localhost:1337");
 const user = {
  "_id": "65232d4723bc17e91531184c",
  "username": "zakaria",
  "email": "zakaria@gmail.com",
  "image": "https://images.unsplash.com/photo-1607081692245-419edffb5462?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
  "password": "$2b$10$5XtxBA4PwAygsebAeVy2WuYP0Ct1aE6nTNy1ShZX9VyPSgjpwpc0i",
  "friends": [],
  "blocks": [],
  "messages": [],
  "notifications": [],
  "createdAt": "2023-10-08T22:29:27.187Z",
  "updatedAt": "2023-10-08T22:29:27.187Z",
  "__v": 0
}

const ChatPage = () => {
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [receiver, setReceiver] = useState<userType | null>(null);


  const selectReceiver = async (receiver: userType) => {
    const generatedChatId = [receiver._id, user?._id].sort().join("-");
    setChatId(generatedChatId);
    setReceiver(receiver);

    socket.emit("join-chat", {
      receiverId: receiver._id,
      senderId: user?._id,
      chatId: generatedChatId,
    });
  };

  useEffect(() => {
    const handleJoinChat = (data: any) => {
      const { receiverId, chatId } = data;
      if (receiverId !== user?._id) return;
      setChatId(chatId);
      socket.emit("join-req-accept", chatId);
    };



    socket.on("join-chat-req", handleJoinChat);

  }, [receiver]);

  return (
    <main className="  w-full  h-screen   overflow-hidden   bg-gray-100 ">
      <div className="flex flex-row  ">
        <SideBar  
          selectReceiver={selectReceiver}
          receiverId={receiver?._id}
        />
        <ChatSection/>
        <RightBar/>
      </div>
      
    </main>
  );

};

export default ChatPage;
