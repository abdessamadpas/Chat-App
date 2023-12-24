
function VideoPlayer({
  name,
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  stream,
}: any) {
  return (
    <div className="w-full h-full">
      {/* my video */}
      {stream && (
        <div className=" w-[70%] h-[100%] relative  ">
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="rounded-3xl w-full h-full"
          />

          {callAccepted && !callEnded && (
            <div className=" w-20 h-28 absolute bottom-0 right-2">
              <p>to</p>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="rounded-xl"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
