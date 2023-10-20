import React, { useMemo, useState } from 'react';
import {  Popover } from 'antd';

function PopoverSection({messageData, user}:
     {messageData : any, user : any}) {
    const [showArrow, setShowArrow] = useState(true);
  const [arrowAtCenter, setArrowAtCenter] = useState(false);
  const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;

  const mergedArrow = useMemo(() => {
    if (arrowAtCenter) return { pointAtCenter: true };
    return showArrow;
  }, [showArrow, arrowAtCenter]);

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    return date.toLocaleString('en-US', options);
  }
  const placement= messageData.sender === user ? "right" : "left"
  
  return (
    <Popover placement= {placement}  content={formatDate(messageData.createdAt)} arrow={mergedArrow}>
         <div
                  className={`min-h-fit md:max-w-[40%] max-w-[30%] mt-3  text-white py-[14px] px-[18px] rounded-3xl  md:text-sm text-xs self-end break-words 
                  ${
                    messageData.sender === user
                      ? `${regex_emoji.test(messageData.content ) ? "bg-[#905FF4] hover:bg-purple-200" :"bg-[#905FF4]"}  text-white float-right rounded-br-none`
                      : `${regex_emoji.test(messageData.content ) ? "bg-[#1a2238] hover:bg-[#304785]" :"bg-[#1a2238]"}  text-black float-left rounded-bl-none`
                  }
                  `}
                >
                  { regex_emoji.test(messageData.content ) ? <p className=' text-xl   hover:scale-150  '>{messageData.content}</p> : <p>{messageData.content}</p>} 
                </div>
    </Popover>
  )
}

export default PopoverSection