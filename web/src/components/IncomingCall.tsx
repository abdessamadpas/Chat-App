import React from 'react'
import { IoCallSharp } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
function IncomingCall({answerCall, leaveCall}:any) {
  return (
    <div className="flex flex-row absolute top-1 right-1 p-3 bg-[#1F1E31] rounded-full  justify-between items-center gap-20 z-10 ">
            <div className="flex flex-rox gap-2">
              <div className="w-11 h-11 overflow-hidden rounded-full ">
                <img
                  src="https://images.unsplash.com/photo-1557002665-c552e1832483?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                  alt="..."
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col  text-white">
                <p>Incoming call</p>
                <p>Abdou</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className="bg-[#00ED56] w-10 rounded-full flex justify-center items-center"
                onClick={answerCall}
              >
                <IoCallSharp size={20} color="white" />
              </div>
              <div
                className="bg-[#FF2200] p-2 rounded-full"
                onClick={leaveCall}
              >
                <MdCallEnd size={23} color="white" />
              </div>
            </div>
          </div>
  )
}

export default IncomingCall