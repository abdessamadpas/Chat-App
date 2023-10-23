import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Box, Heading, Container,Grid } from '@chakra-ui/react';
import NotificationsCall from './notifications-call';
import OptionsCall from './options-call';
import VideoPlayer from './video-player';
import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';

const socket: Socket = io('http://localhost:1337');

function VideoSection({receiver, me}:any) {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [receivingCall, setReceivingCall] = useState(false);
  const[caller, setCaller] = useState('');
  const[callerSignal, setCallerSignal] = useState<any | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
 const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any | null>(null);


  
  useEffect(() => {
   console.log("receiver", receiver._id);
   
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          console.log("check my video current ",myVideo.current);
          
          myVideo.current.srcObject = currentStream;
        }
      })

    
    socket.on('callUser', ({ from, name: callerName, signal }) => {
        setReceivingCall(true);
        setCaller(from);
        setName(callerName);
        setCallerSignal(signal);
    });
  
  }, []);
  

  // Define the callUser function
  const callUser = () => {
    console.log("call user");
    
    const peer = new Peer({ initiator: true, trickle: false, stream: stream});
    console.log("peer",peer);
    
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: receiver._id, signalData: data, from: me, name: name });
    });
    peer.on('stream', (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream; // Check if userVideo.current is not null
    });
    socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: caller });
    });
    peer.on('stream', (currentStream) => {
        if (userVideo.current) userVideo.current.srcObject = currentStream; // Check if userVideo.current is not null
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  
  return (
    
    <div>
        <p> Video call   </p>
        <VideoPlayer name={name} callAccepted={callAccepted} myVideo={myVideo} userVideo={userVideo} callEnded={callEnded} stream={stream} call={callAccepted} />
      
      <div>
        <button onClick={callUser}>
          call this user
        </button>
      </div>

        <NotificationsCall />
        
    </div>
    


  )
}

export default VideoSection