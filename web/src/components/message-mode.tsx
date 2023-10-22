import React ,{useState}from 'react'
import {
    MdOutlineTagFaces,
    MdSend,
    MdAttachFile,
} from 'react-icons/md';
import { Progress, Space } from 'antd';
import AudioMode from './audio-mode';

//* emoji picker
  import EmojiPicker, {
    EmojiStyle,
    EmojiClickData,
} from "emoji-picker-react";





function MessageMode({setAudioRecorded, message, setMessage, 
  file, setFile, percent, sendWithFile, sendMessage, audio, setAudio

}: any) {
  const [isOpenedPickerEmoji, setIsOpenedPickerEmoji] = useState<boolean>(false);


  function onClickEmoji(emojiData: EmojiClickData, event: MouseEvent) {
    setMessage(
      (inputValue:any) =>
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

    </div> 
    <div className= {`  flex gap-2 items-center justify-between `}>
        <MdOutlineTagFaces size={30} color="#BDBDBD" onClick={emojiPopup}/>
   
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
          <AudioMode  
            setAudioRecorded = {setAudioRecorded}
            audio={audio}
            setAudio={setAudio}
           />

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

export default MessageMode