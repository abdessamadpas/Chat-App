import React,{ useEffect, useState } from "react";
import SideBar from "../components/side-bar";
import ChatSection from "../components/chat-section";
import RightBar from "../components/right-bar";



const ChatPage = () => {


  return (
    <main className="  w-full  h-screen   overflow-hidden   bg-gray-100 ">
      <div className="flex flex-row  ">
        <SideBar/>
        <ChatSection/>
        <RightBar/>
      </div>
      
    </main>
  );
};

export default ChatPage;
