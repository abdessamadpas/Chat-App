    import React, {useState, useEffect} from 'react';
    import {
        MdMap,
        MdCall,
        MdMoreVert,
        MdOutlineTagFaces,
        MdSend,
        MdAttachFile,
    } from 'react-icons/md';
        
  //* emoji picker
    import EmojiPicker, {
        EmojiStyle,
        EmojiClickData,
    } from "emoji-picker-react";

  // icons used in this screen
    import { Progress, Space } from 'antd';
    import MicrophoneSetup from './microphone';

    //* firebase imports
    import storage from "../firebaseConfig"
    import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    import { MessageTypes, userType } from '../types';
    import {user} from '../App';
    import { socket } from '../pages/ChatPage';


function SendingSection( {chatId, receiver, setMessages}: any) {
    const [message, setMessage] = React.useState<string>('');
    const [sentMessages, setSentMessages] = useState<MessageTypes[]>([]);
    const [isOpenedPickerEmoji, setIsOpenedPickerEmoji] = useState<boolean>(false);
    const [file, setFile] = React.useState<File>();
    const [percent, setPercent] = useState<any>(0);
    const [loadingFailed, setLoadingFailed] = useState<boolean>(false);
    const [sendWithFile, setSendWithFile] = useState<boolean>(false);
    const [audioMode, setAudioMode] = useState<boolean>(false);
  
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
          setMessages((prevMessages: MessageTypes[]) => [...prevMessages, messageData]);
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
          setMessages((prevMessages: MessageTypes[]) => [...prevMessages, messageData]);
          socket.emit('send-message', messageData);
          setMessage('');
        }
      }
    
      function onClickEmoji(emojiData: EmojiClickData, event: MouseEvent) {
        setMessage(
          (inputValue) =>
            inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        );
      }
    const emojiPopup = () => {
        setIsOpenedPickerEmoji(!isOpenedPickerEmoji);
      }
      // Handle file upload event and update state
      function handleChange(event: React.FormEvent) {
        const target = event.target as HTMLInputElement;
        if (target.files &&   target.files.length > 0) {
          setFile(target.files[0]);
        }}
 
 
    return (
    <div className="p-6 flex justify-between items-center">
    { !audioMode ?
    <div className="flex gap-5 items-center flex-1">
      <div className="flex flex-row gap-2 ">
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
    <div className= {` ${audioMode ? "w-full": "" } flex gap-2 items-center justify-between `}>
      { !audioMode ?
        <MdOutlineTagFaces size={30} color="#BDBDBD" onClick={emojiPopup}/>
        : 
          null 
        }
        <div className=' absolute bottom-16  '>
          {  isOpenedPickerEmoji &&
            <EmojiPicker   
              onEmojiClick={onClickEmoji}
              autoFocusSearch={false}
              emojiStyle={EmojiStyle.NATIVE}
            /> 
          }
        </div>
      
        <div className='flex justify-between items-center w-full'>
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
  )
}

export default SendingSection