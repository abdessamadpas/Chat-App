import React from 'react';
import { Empty } from 'antd';
// icons used in this screen
import {
  MdMap,
  MdCall,
  MdMoreVert,
} from 'react-icons/md';
import { MessageTypes, userType } from '../types';
import {user} from '../App';
import SkeletonSection from './skeletonSection';
import PopoverSection from './popover-section';
import SendingSection from './sending-section';
import VideoSection from './video-section';
import { IoVideocamOutline, IoCallOutline ,IoMapOutline} from "react-icons/io5";
interface sendBoxProps {
  chatId: string;
  receiver: userType;
  messages: MessageTypes[];
  setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>;
  loading : boolean
  onlineFriends : {}
  me : string
  name  : string
  callerSignal  : string
  caller  : string 
  receivingCall   : boolean
  setReceivingCall  : React.Dispatch<React.SetStateAction<boolean>>
}

function ChatSection({
  me,
  chatId,
  messages,
  receiver,
  setMessages,
  loading,
  onlineFriends,
  name,
  callerSignal,
  caller,
  receivingCall,
  setReceivingCall
}: sendBoxProps) {

  const [videoMode, setVideoMode] = React.useState(false);
  const handleVideoCall = () => {
   
    
    setVideoMode(!videoMode)
  }

  return (
    <div className="  flex flex-col flex-grow max-w-screen-xl  rounded-2xl bg-white   max-h-screen " >
      {/*  header */}
      <div className="  py-5 flex  justify-between px-9 items-center">
        <div className="flex flex-row gap-3 justify-center items-center ">
          <div className="  bg-gray-200  w-10  h-10 flex justify-center items-center rounded-full">
            <div className="w-10 h-10 overflow-hidden rounded-full ">
              <img
                src={receiver.image}
                alt={receiver.username}
                className="shadow rounded-full max-w-full h-auto align-middle border-none"
              />
            </div>
          </div>
          <div>
            <p className=" font-semibold  text-xl">{receiver.username}</p>
            {Object.keys(onlineFriends).includes(receiver._id)?     
              <> 
                <div className="absolute w-4 h-4 bg-purple-200 bg-opacity-40 rounded-full  flex justify-center items-center ">
                  <div className="relative w-2 h-2 bg-purple-600 rounded-full  "></div>
                </div> 
                <p className=" font-extralight ml-5  text-xs text-gray-400">
                  Online
                </p>
              </>
              : null
            }
          </div>
        </div>
        <div className="flex gap-3  justify-center items-center">
          <div className="  bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full">
            <IoMapOutline size={20} color="#905FF4" />
          </div>
          <div className="  bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full">
            <IoCallOutline size={20} color="#905FF4" />
          </div>
          <div className="  bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full" onClick={()=>handleVideoCall()}>
            <IoVideocamOutline size={20} color="#905FF4" />
          </div>
          {/* <div className="px-3 py-2  h-10  w-40 bg-main-color rounded-full" onClick={()=>handleVideoCall()}>
            <p className="text-white">Go to conference</p>
          </div> */}
          <MdMoreVert size={20} color="#BDBDBD" />
        </div>
      </div>
      <hr />
      {/* body */}
{      videoMode ? 
    <div className="  flex flex-col flex-grow max-w-screen-xl  rounded-2xl bg-white   max-h-screen " >
      <VideoSection receiver={receiver}
        me={me}
        caller={caller}
        name={name}
        callerSignal={callerSignal}
        receivingCall={receivingCall}
        setReceivingCall={setReceivingCall}
        
        />
    </div> :
      loading ? 
      <div className="flex justify-center items-center h-full"> <SkeletonSection/></div> 

      : {messages} && messages.length === 0 ? 
      <div className="flex justify-center items-center h-full"> <Empty description={false} /></div> 
      :
      <div className=' flex-grow    overflow-x-hidden scrollbar-thin scrollbar-rounded-lg scrollbar-thumb-purple-500 scrollbar-track-purple-100'>
        {/* messages */}
        <div className=" py-3 px-4 flex-grow flex flex-col overflow-y-auto " >
          {messages.map((messageData, index) => (
            <div
              key={index}
              className={`mb-2 ${
                messageData.sender === user ? 'text-right' : 'text-left'
              }`}>
              <PopoverSection messageData ={messageData} user={user}/>
            </div>
          ))}
        </div>
      </div>
      } 
      <hr />
      <SendingSection 
        chatId={chatId}
        receiver={receiver}
        setMessages={setMessages}
      />
    </div>
  );
}

export default ChatSection;
