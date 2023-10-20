import React, {useState, useEffect} from 'react';
import { FcDislike } from 'react-icons/fc';
import { Progress, Space } from 'antd';
import { Empty } from 'antd';

//* emoji picker
import EmojiPicker, {
  EmojiStyle,
  EmojiClickData,
} from "emoji-picker-react";
// icons used in this screen
import {
  MdMap,
  MdCall,
  MdMoreVert,
  MdOutlineTagFaces,
  MdSend,
  MdAttachFile,
} from 'react-icons/md';
import { MessageTypes, userType } from '../types';
import { socket } from '../pages/ChatPage';
import {user} from '../App';

//* firebase imports
import storage from "../firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SkeletonSection from './skeletonSection';
import PopoverSection from './popover-section';
import { Mic } from 'lucide-react';
import MicrophoneSetup from './microphone';

interface sendBoxProps {
  chatId: string;
  receiver: userType;
  messages: MessageTypes[];
  setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>;
  loading : boolean
  onlineFriends : {}

}

function ChatSection({
  chatId,
  messages,
  receiver,
  setMessages,
  loading,
  onlineFriends
}: sendBoxProps) {
  const [message, setMessage] = React.useState<string>('');
  const [sentMessages, setSentMessages] = useState<MessageTypes[]>([]);
  const [file, setFile] = React.useState<File>();
  const [percent, setPercent] = useState<any>(0);
  const [loadingFailed, setLoadingFailed] = useState<boolean>(false);
  const [sendWithFile, setSendWithFile] = useState<boolean>(false);
  const [isOpenedPickerEmoji, setIsOpenedPickerEmoji] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<boolean>(false);


  useEffect(() => {
    console.log("messages", messages);
    }, [loading]);
  
  const emojiPopup = () => {
    setIsOpenedPickerEmoji(!isOpenedPickerEmoji);
  }
  // Handle file upload event and update state
  function handleChange(event: React.FormEvent) {
    const target = event.target as HTMLInputElement;
    if (target.files &&   target.files.length > 0) {
      setFile(target.files[0]);
    }}

  function handleUpload() {
    if (!file) {
        alert("Please choose a file first!")
        return;
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercent(percent);
        },
        (err) =>setLoadingFailed(true),
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url);
                console.log(percent);
                setSendWithFile(false);
                setPercent(0);
                setFile(undefined);
                setLoadingFailed(false);
                
            });
        }
    );
}   

  async function sendMessage() {
    setAudioMode(false)
    if (message === '' && file === undefined) return;
    if (message === '' && file !== undefined) {
      setSendWithFile(true);
      handleUpload();
     
      return;
    }
    if (message !== '' && file !== undefined) {
      console.log("send message with file");
      
      setSendWithFile(true);
      handleUpload();
      const messageData: MessageTypes = {
        chatId: chatId,
        sender: user as string,
        receiver: receiver._id,
        content: message,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now(),
        ).getMinutes()}`,
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      socket.emit('send-message', messageData);
      setMessage('');
    
      return;
    }
    if(message !== '' && file === undefined){
      const messageData: MessageTypes = {
        chatId: chatId,
        sender: user as string,
        receiver: receiver._id,
        content: message,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now(),
        ).getMinutes()}`,
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      socket.emit('send-message', messageData);
      setMessage('');
    }
  }

  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    setMessage(
      (inputValue) =>
        inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
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
            <MdMap size={20} color="#905FF4" />
          </div>
          <div className="  bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full">
            <MdCall size={20} color="#905FF4" />
          </div>
          <div className="px-3 py-2  h-10  w-40 bg-main-color rounded-full">
            <p className="text-white">Go to conference</p>
          </div>
          <MdMoreVert size={20} color="#BDBDBD" />
        </div>
      </div>
      <hr />
      {/* body */}
      {loading ? 
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
                }`}
              >
                <PopoverSection messageData ={messageData} user={user}/>
               
              </div>
            ))}
          </div>

        {/* send tools */}
        
      </div>
      }
      <hr />
      <div className="p-6 flex justify-between items-center">
        { audioMode ?
        <div className="flex gap-5 items-center">
          <div className="flex flex-row gap-2">
            <label htmlFor="fileInput">
              <MdAttachFile size={23}  color={file ? '#9064F5' : '#BDBDBD'} />
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              multiple={true}
              onChange={handleChange}
              accept="*"
            />
          </div>
          <input
            className="focus:border-transparent focus:outline-none "
            placeholder="Type something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div> : false}
        <div className="flex gap-2 items-center ">
          <MdOutlineTagFaces size={23} color="#BDBDBD" onClick={emojiPopup}/>
          <div className=' absolute bottom-16  '>
            {  isOpenedPickerEmoji &&
              <EmojiPicker   
                onEmojiClick={onClick}
                autoFocusSearch={false}
                emojiStyle={EmojiStyle.NATIVE}
            /> 
            }
          </div>
            
          <MicrophoneSetup audioMode ={audioMode} setAudioMode ={setAudioMode} />
            {!sendWithFile ? 
            <MdSend
              size={23}
              color="#BDBDBD"
              
              onClick={sendMessage}
            /> : (( percent > 0 ) &&
              <Space size={30}> 
                <Progress size={25} type="circle" percent={percent} />
              </Space>
            )}
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
