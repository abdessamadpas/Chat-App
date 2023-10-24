import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Box, Heading, Container,Grid } from '@chakra-ui/react';
import NotificationsCall from './notifications-call';
import OptionsCall from './options-call';
import VideoPlayer from './video-player';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import {socket} from '../pages/ChatPage';
import { IoCallSharp } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";

function VideoSection({receiver, me, caller, callerSignal, name}:any) {

  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    });
  }, []);


  // Define the callUser function
  const callUser = () => {
    console.log("call user");
    
    const peer = new Peer({ initiator: true, trickle: false, stream: stream});
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: receiver._id, signalData: data, from: me, name: name });
    });
    peer.on('stream', (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream; 
    });
    socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {  
    setCallAccepted(true);
    console.log("answer call", callerSignal);
    
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });
    console.log("peer", peer);
    
    peer.on('signal', (data) => {
      console.log("socket emit answer call",data );
      
        socket.emit('answerCall', { signal: data, to: caller });
    });
    peer.on('stream', (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream; 
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  
  return (
    
    <div className='flex flex-col items-center'>
      <div>
        <p> thursday, 13 july, 2023</p>
      </div>
        
        <VideoPlayer name={name} callAccepted={callAccepted} myVideo={myVideo} userVideo={userVideo} callEnded={callEnded} stream={stream} call={callAccepted} />
      <div className='flex flex-row justify-around'>
        <div>
        <button onClick={callUser} className=' bg-blue-500'>
          call
        </button>
      </div>
      {
        (caller && !callAccepted  ) ?
        <div className="flex flex-row absolute top-1 right-1 p-3 bg-[#1F1E31] rounded-full  justify-between items-center gap-20 z-10 ">
          <div className='flex flex-rox gap-2'>
            <div className="w-11 h-11 overflow-hidden rounded-full ">
              <img
                src="https://images.unsplash.com/photo-1557002665-c552e1832483?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                alt="..."
                className="w-full h-full object-cover"
              />
            </div>
            <div className='flex flex-col  text-white'>
              <p>Incoming call</p>
              <p>Abdou</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='bg-[#00ED56] w-10 rounded-full flex justify-center items-center' onClick={answerCall}  >
              <IoCallSharp size={20} color="white" />
            </div>
            <div className='bg-[#FF2200] p-2 rounded-full' onClick={leaveCall}>
              <MdCallEnd size={23} color="white" />
            </div>

          </div> 
         
            
          
        </div> 
        : null
      } 
      </div>

    </div>
    


  )
}

export default VideoSection