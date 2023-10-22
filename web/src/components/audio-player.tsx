import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

  import { CiPlay1, CiPause1 } from "react-icons/ci";
interface WaveformProps {
  url: string;
}

const formWaveSurferOptions = (ref: React.RefObject<HTMLDivElement>) => ({
  container: ref.current as Element,
  waveColor: "#F3E8FF",
  progressColor: "#905FF4",
  cursorColor: "#905FF4",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 30,
  normalize: true,
  partialRender: true,
});

const Waveform: React.FC<WaveformProps> = ({ url }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef);
    wavesurfer.current = WaveSurfer.create(options as any);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [url]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      setPlay(!playing);
      wavesurfer.current.playPause();
    }
  };



  return (
    <div className="flex flex-row w-50 items-center justify-around ">
      <div id="waveform" ref={waveformRef} className="w-56  " />
      <div className="controls mx-4">
        {!playing ?
            <CiPlay1 size={23} color="#905FF4" onClick={handlePlayPause} />
        : 
            <CiPause1 size={23} color="#905FF4" onClick={handlePlayPause} />
        }
      </div>
    </div>
  );
};

export default Waveform;
