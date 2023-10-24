import React from 'react'
import { Grid, Box, Heading } from "@chakra-ui/react"

function VideoPlayer({ name, callAccepted, myVideo, userVideo, callEnded, stream, call }:any) {
  return (
   
    <div className='w-full h-full' >
            {/* my video */}
            {
                stream && (
                   <div className=' w-full h-full relative  '>
                       <video playsInline muted ref={myVideo} autoPlay  className='rounded-3xl'  />
                       
                       {
                        callAccepted && !callEnded && (
                    
                                <div  className=' w-20 h-28 absolute bottom-0 right-2'>
                                    <p>to</p>
                                    <video playsInline ref={userVideo} autoPlay  className='rounded-xl'  />
                                </div>
                        )
            }
                   </div>
                        
                
                )
            }
           
        </div>
  )
}

export default VideoPlayer