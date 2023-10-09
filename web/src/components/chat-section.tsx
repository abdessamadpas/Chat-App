import e from 'express';
import React from 'react'
import { FcDislike } from "react-icons/fc";
import { MdMap , MdCall, MdMoreVert, MdMicNone, MdOutlineTagFaces,MdSend, MdAttachFile} from "react-icons/md";
import { MessageTypes } from '../types';
import { socket } from "../pages/ChatPage";


interface sendBoxProps {
  chatId: string;
  receiver: string;
  messages: MessageTypes[];
  setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>;

}

function ChatSection({chatId, messages,receiver,setMessages}:sendBoxProps) {
const user = localStorage.getItem("userId");
const [message, setMessage] = React.useState<string>("");

async function sendMessage() {
  if (message === "") return;
  const messageData: MessageTypes = {
    chatId: chatId,
    sender: user as string,
    receiver: receiver,
    content: message,
    time: `${new Date(Date.now()).getHours()}:${new Date(
      Date.now()
    ).getMinutes()}`,
  };

  setMessages((prevMessages) => [...prevMessages, messageData]);

  socket.emit("send-message", messageData);
  setMessage("");

}
const [sentMessages, setSentMessages] = React.useState<MessageTypes[]>([]);

  return (
    <div className=' flex-initial relative  w-4/5 my-5 rounded-2xl bg-white  h-[calc(100vh-<height-of-your-fixed-div>)]' >
      {/*  header */}
      <div className='  py-5 flex  justify-between px-9 items-center'>
        <div className='flex flex-row gap-3 justify-center items-center '>
          <div className='  bg-gray-200  w-10  h-10 flex justify-center items-center rounded-full'>
            <FcDislike size={20} color='#905FF4'  />
          </div>
          <div >
            <p className=' font-semibold  text-xl'>After quarantine party group</p>
            <p className=' font-extralight  text-xs text-gray-400'>10 members</p>
          </div>
        </div>
        <div className='flex gap-3  justify-center items-center'> 
          <div className='  bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full'>
            <MdMap size={20} color='#905FF4'  />
          </div>
          <div className='  bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full'>
            <MdCall size={20} color='#905FF4'  />
          </div>
          <div className='px-3 py-2  h-10  w-40 bg-main-color rounded-full'>
            <p className='text-white'>Go to conference</p>
          </div>
          <MdMoreVert size={20} color='#BDBDBD'  />
        </div>
      </div>
      <hr/>
      {/* body */}
      <div> 
        {/* messages */}
        <div className=''>
          <div className="py-3 px-4 flex-col flex flex-grow max-h-96" style={{  overflowY: 'auto' }}>
            {messages.map((messageData, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  messageData.sender === user ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    messageData.sender === user
                      ? 'bg-blue-500 text-white float-right'
                      : 'bg-gray-200 text-black float-left'
                  }`}
                >
                  <p>{messageData.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* send tools */}
        <div className=' absolute bottom-0 left-0 right-0 '>
          <hr/>
          <div className='p-6 flex  justify-between items-center'>
             <div className='flex gap-5 items-center'>
             <MdAttachFile size={20} color='#BDBDBD'  />
              <input    className=" focus:border-transparent focus:outline-none"
              placeholder='type something...'
              value={message}
              onChange={(e)=> setMessage(e.target.value)}
              />
             </div>
             <div className='flex gap-2'>
              <MdOutlineTagFaces size={20} color='#BDBDBD'/>
              <MdMicNone size={20} color='#BDBDBD' />
              <MdSend size={20} color='#BDBDBD' onClick={sendMessage} />

             </div>
          </div>
         
        </div>
      </div>
    </div>
  )
}

export default ChatSection