import React, { useState, useRef } from 'react';
import { MdMicNone } from 'react-icons/md';
import Waveform from './audio-player';
import { PiWaveformBold , PiRecordLight} from "react-icons/pi";

function MicrophoneSetup({ audioMode ,setAudioMode}: any) {
    const [permission, setPermission] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mimeType: string = "audio/webm";
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<any>(null);
    const [recordingStatus, setRecordingStatus] = useState<string>("inactive");

    const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
        try {
        const streamData = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        setPermission(true);
        setStream(streamData);
        } catch (err) {
        alert((err as Error).message);
        }
    } else {
        alert("The MediaRecorder API is not supported in your browser.");
    }
    }; 
  const startRecording = async () => {
    console.log("start recording");
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream as MediaStream, { mimeType });
    // Set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    setAudioMode(true);
    // Invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };


  const stopRecording = () => {
    if (mediaRecorder.current === null) return;
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
       const audioBlob = new Blob(audioChunks, { type: mimeType });
       const audioUrl = URL.createObjectURL(audioBlob);
       setAudio(audioUrl);
       setAudioChunks([]);
    };
    };

  const recordAudio =  () => {
   if( !permission) getMicrophonePermission();
    permission && recordingStatus === "inactive"  ?   startRecording()  : stopRecording()     
    };
    
  return (
    <> 
    
    {audio ? (
        <div className="audio-container flex items-center justify-center">
            <Waveform url={audio} />
        </div> 
        ) : 
        recordingStatus === "recording" ?
        <PiWaveformBold size={23} color="#BDBDBD" onClick={ recordAudio } />
    :
        <MdMicNone size={23} color="#BDBDBD" onClick={ recordAudio } />
    }
    </>
  );
}

export default MicrophoneSetup;
