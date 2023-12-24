import React, { useState, useRef } from 'react';
import { MdMicNone } from 'react-icons/md';
import Waveform from './audio-player';
import { PiWaveformBold, PiRecordLight } from 'react-icons/pi';
import { CiTrash } from 'react-icons/ci';
import { FcCheckmark, FcSynchronize } from 'react-icons/fc';

function AudioMode({ setAudioRecorded, audio, setAudio }: any) {
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mimeType: string = 'audio/webm';
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingStatus, setRecordingStatus] = useState<string>('inactive');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
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
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };
  React.useEffect(() => {
    console.log(audio);
  }, [audio]);

  const startRecording = async () => {
    console.log('start recording');
    setRecordingStatus('recording');
    const media = new MediaRecorder(stream as MediaStream, { mimeType });
    mediaRecorder.current = media;
    setElapsedSeconds(0);

    mediaRecorder.current.start();
    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    if (mediaRecorder.current === null) return;
    setRecordingStatus('inactive');
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });

      setAudioRecorded(audioBlob);

      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const recordAudio = () => {
    if (!permission) getMicrophonePermission();
    permission && recordingStatus === 'inactive'
      ? startRecording()
      : stopRecording();
  };

  const formatTime = (totalSeconds: any) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const cancelRecording = () => {
    setAudio(null);
    setAudioChunks([]);
    setRecordingStatus('inactive');
    setElapsedSeconds(0);
  };

  const restartRecording = () => {
    cancelRecording();
    clearInterval(timer);

    startRecording();
    setElapsedSeconds(0);
  };
  React.useEffect(() => {
    console.log(elapsedSeconds);
  }, [elapsedSeconds]);
  let timer: any;

  React.useEffect(() => {
    if (recordingStatus === 'recording') {
      clearInterval(timer);
      const startTime = Date.now();
      console.log('start time', startTime);

      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds(0);
        const currentTime = Date.now();
        const elapsedMilliseconds = currentTime - startTime;
        const seconds = Math.floor(elapsedMilliseconds / 1000);
        setElapsedSeconds(seconds);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [recordingStatus, audioChunks]);

  return (
    <>
      {audio ? (
        <div className="audio-container flex items-center justify-center gap-3">
          <CiTrash
            size={23}
            color="#4E5E78"
            style={{ marginLeft: '5px' }}
            onClick={cancelRecording}
          />
          <Waveform url={audio} />
        </div>
      ) : recordingStatus === 'recording' ? (
        <>
          <br />
          <FcSynchronize
            size={23}
            color="#BDBDBD"
            style={{ marginLeft: ' 20px', marginRight: '10px' }}
            onClick={restartRecording}
          />
          <PiWaveformBold
            size={23}
            color="#22C563"
            style={{ marginRight: '2px  ' }}
          />
          <div className="  flex flex-row gap-2">
            <p className="text-green-500 font-semibold w-9">
              {formatTime(elapsedSeconds)}
            </p>
            <div className="mr-8">
              <FcCheckmark size={23} color="#BDBDBD" onClick={recordAudio} />
            </div>
          </div>
        </>
      ) : (
        <MdMicNone size={23} color="#BDBDBD" onClick={recordAudio} />
      )}
    </>
  );
}

export default AudioMode;
