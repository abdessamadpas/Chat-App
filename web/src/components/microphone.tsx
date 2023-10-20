import React, { useState, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { MdMicNone } from 'react-icons/md';
import Waveform from './audio-player';

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
    // Create a new MediaRecorder instance using the stream
    const media = new MediaRecorder(stream as MediaStream, { mimeType });
    // Set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
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
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
       const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
       const audioUrl = URL.createObjectURL(audioBlob);
       setAudio(audioUrl);
       setAudioChunks([]);
    };
  };

  const recordAudio =  () => {

    permission ? console.log("permission granted") : getMicrophonePermission();
    if (permission && recordingStatus === "inactive" ) {       
        setAudioMode(true)
        startRecording() 
    }else{ 
        stopRecording()
    }
    }

  return (
    <> 
    
    {audio ? (
        <div className="audio-container flex items-center justify-center">
            <Waveform url={audio} />
        </div>
    ) : <MdMicNone size={23} color="#BDBDBD" onClick={ recordAudio } />}
    </>
  );
}

export default MicrophoneSetup;
