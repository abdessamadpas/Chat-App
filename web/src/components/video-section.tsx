import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { Box, Heading, Container, Grid } from '@chakra-ui/react';
import OptionsCall from './options-call';
import VideoPlayer from './video-player';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { socket } from '../pages/ChatPage';

import CallTools from './call-tools';
import IncomingCall from './IncomingCall';

function VideoSection({ receiver, me, caller, callerSignal, name }: any) {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });
  }, []);

  // Define the callUser function
  const callUser = () => {
    console.log('call user');

    const peer = new Peer({ initiator: true, trickle: false, stream: stream });
    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: receiver._id,
        signalData: data,
        from: me,
        name: name,
      });
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
    console.log('answer call', callerSignal);

    const peer = new Peer({ initiator: false, trickle: false, stream: stream });
    console.log('peer', peer);

    peer.on('signal', (data) => {
      console.log('socket emit answer call', data);

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
    <div className="flex flex-col items-center justify-between w-full h-full">
      <div>
        <p> thursday, 13 july, 2023</p>
      </div>

      <VideoPlayer
        name={name}
        callAccepted={callAccepted}
        myVideo={myVideo}
        userVideo={userVideo}
        callEnded={callEnded}
        stream={stream}
      />
      <div className="flex  items-center justify-between w-full h-full">
        <CallTools
          callUser={callUser}
          callAccepted={callAccepted}
          callEnded={callEnded}
          leaveCall={leaveCall}
        />

        {caller && !callAccepted ? (
          <IncomingCall answerCall={answerCall} leaveCall={leaveCall} />
        ) : null}
      </div>
    </div>
  );
}

export default VideoSection;
