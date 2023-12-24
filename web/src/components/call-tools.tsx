import { BsMic, BsCamera, BsVolumeMute } from 'react-icons/bs';
import { RiStickyNoteLine, RiMoreLine } from 'react-icons/ri';
import { IoCallOutline } from 'react-icons/io5';
import { SlCallEnd } from 'react-icons/sl';

function CallTools({ callUser, callAccepted, callEnded, leaveCall }: any) {
  return (
    <div className="flex flex-row items-center justify-around bg-slate-300 p-2 gap-8 w-full rounded-lg">
      <div className="flex gap-3 flex-row ">
        <div className="p-2 rounded-full bg-white">
          <BsVolumeMute size={20} />
        </div>
        <div className="p-2 rounded-full bg-white">
          <BsVolumeMute size={20} />
        </div>
        <div className="p-2 rounded-full bg-white">
          <BsVolumeMute size={20} />
        </div>
      </div>
      <div className=" ">
        {!callAccepted && !callEnded ? (
          <div className="p-2 rounded-full bg-white">
            <IoCallOutline size={20} onClick={callUser} />
          </div>
        ) : (
          <div className="p-2 rounded-full bg-white">
            <SlCallEnd size={20} onClick={leaveCall} />
          </div>
        )}
      </div>
      <div className="flex gap-3 flex-row">
        <div className="p-2 rounded-full bg-white">
          <BsCamera size={20} />
        </div>
        <div className="p-2 rounded-full bg-white">
          <BsMic size={20} />
        </div>
        <div className="p-2 rounded-full bg-white">
          <RiMoreLine size={20} />
        </div>
      </div>
    </div>
  );
}

export default CallTools;
