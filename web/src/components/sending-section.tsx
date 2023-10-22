import React,{useState,useEffect} from 'react';
import MessageMode from './message-mode';
//* firebase imports
import storage from "../firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { MessageTypes, userType } from '../types';
import {user} from '../App';
import { socket } from '../pages/ChatPage';
import { Blob } from 'node:buffer';

function SendingSection( {chatId, receiver, setMessages}: any) {
 
  const [file, setFile] = useState<File>();
  const [percent, setPercent] = useState<any>(0);
  const [sendWithFile, setSendWithFile] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [audio, setAudio] = useState<any>(null);
  const [audioRecorded, setAudioRecorded] = useState<Blob | null>(null);
  
  function uploadFileToFirebase() {
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
        (err) =>console.log(err),
        () => {
          // extract url and update message object
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            const messageData: MessageTypes = {
              chatId: chatId,
              sender: user as string,
              receiver: receiver._id,
              type: "file",
              content: url,
              time: `${new Date(Date.now()).getHours()}:${new Date(
                Date.now(),
              ).getMinutes()}`,
            };
            setMessages((prevMessages: MessageTypes[]) => [...prevMessages, messageData]);
            socket.emit('send-message', messageData);
              setSendWithFile(false);
              setPercent(0);
              setFile(undefined);
              
          });
        }
      );
    }   
  
      
  const uploadAudioToFirebase = async (audioBlob: Blob) => {
    const uniqueIdentifier = generateRandomString(8);
    const storageRef = ref(storage, `/audio/audioFile_${uniqueIdentifier}.webm`)
    const uploadTask = uploadBytesResumable(storageRef, audioRecorded as any );
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          
          // update progress
          setPercent(percent);
        },
        (err) =>console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            const messageData: MessageTypes = {
              chatId: chatId,
              sender: user as string,
              receiver: receiver._id,
              type: "audio",
              content: url,
              time: `${new Date(Date.now()).getHours()}:${new Date(
                Date.now(),
              ).getMinutes()}`,
            };
            setMessages((prevMessages: MessageTypes[]) => [...prevMessages, messageData]);
            socket.emit('send-message', messageData);
            setPercent(0);
            setAudioRecorded(null);
            setAudio(null);

            
        }).catch(err => console.log(err));
      }
      );
    };
        
  async function sendMessage() {
  
    if (message === '' && file === undefined && audioRecorded == null) return;
    const messageData: MessageTypes = {
      chatId: chatId,
      sender: user as string,
      receiver: receiver._id,
      content: message,
      time: `${new Date(Date.now()).getHours()}:${new Date(
        Date.now(),
      ).getMinutes()}`,
    };
    if (file !== undefined) {
      setSendWithFile(true);
      uploadFileToFirebase();

    }
    
    if (audioRecorded !== null) {
      uploadAudioToFirebase(audioRecorded);
    }

    if (message !== '') {
      console.log("send message ");
      const messageData: MessageTypes = {
        chatId: chatId,
        sender: user as string,
        receiver: receiver._id,
        type: "text",
        content: message,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now(),
        ).getMinutes()}`,
      };
      setMessages((prevMessages: MessageTypes[]) => [...prevMessages, messageData]);
      socket.emit('send-message', messageData);
      setMessage('');

    }
    // setAudio(null);
    
  }
function generateRandomString(length : number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
     
        
        return (
          
      < MessageMode
        message={message}
        setMessage={setMessage}
        file={file}
        setFile= {setFile}
        percent={percent}
        sendWithFile={sendWithFile}
        sendMessage={sendMessage} 
        setAudioRecorded = {setAudioRecorded}
        audio = {audio}
        setAudio = {setAudio}
    />
   
  )
}

export default SendingSection