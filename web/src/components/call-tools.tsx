import React from 'react'
import { BsMic, BsCamera, BsVolumeMute} from "react-icons/bs";
import { RiStickyNoteLine, RiMoreLine } from "react-icons/ri";
function CallTools({callUser}:any) {
  return (
    <div className='flex flex-row bg-slate-300 p-2 items-center gap-8'>
        <div className='flex gap-3 flex-row'>
            <div className='p-2 rounded-full bg-white'>
                <RiStickyNoteLine    size={20}/>
            </div>
            <div className='p-2 rounded-full bg-white'>
                <BsVolumeMute    size={20}/>
            </div>
            <div className='p-2 rounded-full bg-white'>
                <BsVolumeMute    size={20}/>
            </div>
            <div>

            </div>
        </div>
        <div className=''>
            <p> End Call  </p>
        </div>
        <div className='flex gap-3 flex-row'>
            <div className='p-2 rounded-full bg-white'>
                <BsCamera    size={20}/>
            </div>
            <div className='p-2 rounded-full bg-white'>
                <BsMic    size={20}/>
            </div>
            <div className='p-2 rounded-full bg-white'>
                <RiMoreLine    size={20}/>
            </div>
        </div>
    </div>  
    )
}

export default CallTools