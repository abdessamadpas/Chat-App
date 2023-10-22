// src/Context.tsx

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client'; // Import Socket type from socket.io-client
import Peer, { SignalData } from 'simple-peer'; // Import SignalData type from simple-peer

// Define TypeScript types for the context's state and functions
type ContextState = {
  call: {
    isReceivingCall: boolean;
    from: string;
    name: string;
    signal: SignalData | undefined;
  };
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  name: string;
  me: string;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
};

const SocketContext = createContext<ContextState | undefined>(undefined); // Provide context state type

const socket: Socket = io('http://localhost:1337');

const ContextProvider: React.FC = ({ children } : any) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [name, setName] = useState('');
  const [call, setCall] = useState<ContextState['call']>({ isReceivingCall: false, from: '', name: '', signal: undefined });
  const [me, setMe] = useState('');
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => setMe(id));
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', (data: any) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    peer.on('stream', (currentStream: any) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });
    if (call.signal) peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data: any) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });
    peer.on('stream', (currentStream: any) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    window.location.reload();
  };

  const contextValue: ContextState = {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
