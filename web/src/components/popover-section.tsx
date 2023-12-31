import { useMemo, useState } from 'react';
import { Popover } from 'antd';
import Waveform from './audio-player';
import { Image, Space } from 'antd';
import { saveAs } from 'file-saver';

import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';


function PopoverSection({ messageData, user }: { messageData: any; user: any }) {
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

  const onDownload = async(imageSrc : string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      saveAs(blob, 'image.jpg'); // Save the Blob with the specified filename
    } catch (error) {
      console.error('Error downloading the image', error);
    }
  };
  return (
    <Popover placement="left" content={formatDate(messageData.createdAt)} trigger={'click'}>
      {messageData.type === 'text' && (
        <div
          className={`min-h-fit md:max-w-[40%] max-w-[30%] mt-3 text-white py-[14px] px-[18px] rounded-3xl md:text-sm text-xs self-end break-words 
        ${messageData.sender === user
          ? regex_emoji.test(messageData.content) ? "bg-[#905FF4] hover:bg-purple-200" : "bg-[#905FF4] text-white float-right rounded-br-none"
          : regex_emoji.test(messageData.content) ? "bg-[#1a2238] hover:bg-[#304785]" : "bg-[#1a2238] text-black float-left rounded-bl-none"
        }`}>
          {regex_emoji.test(messageData.content) ? (
            <p className='text-xl hover:scale-150'>{messageData.content}</p>
          ) : (
            <p>{messageData.content}</p>
          )}
        </div>
      )}
      {messageData.type === 'file' && (
        <div
          className={`min-h-fit md:max-w-[40%] max-w-[30%] mt-3 text-white py-[3px] px-[3px] rounded-3xl md:text-sm text-xs self-end break-words 
        ${messageData.sender === user
          ? "bg-[#905FF4] text-white float-right rounded-br-none"
          : "bg-[#1a2238] text-black float-left rounded-bl-none"
        }`}>
          {/* <img src={messageData.content} alt="image" className='rounded-3xl rounded-br-none w-36 h-auto' /> */}
          <Image
            width={200}
            src={messageData.content}
            className=' rounded-3xl rounded-br-none w-36 h-auto'
            preview={{
             
            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
              },
            ) => (
              <Space size={19} className="toolbar-wrapper">
                <DownloadOutlined  onClick={()=>onDownload(messageData.content)} />
                <SwapOutlined rotate={90} onClick={onFlipY} />
                <SwapOutlined onClick={onFlipX} />
                <RotateLeftOutlined onClick={onRotateLeft} />
                <RotateRightOutlined onClick={onRotateRight} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              </Space>
            ),
          }}
        />
        </div>
      )}
      {messageData.type === 'audio' && (
  <div
    className={`min-h-fit md:max-w-[40%] max-w-[30%]  mt-3 text-white py-[14px] px-[18px] rounded-3xl md:text-sm text-xs self-end break-words 
    ${messageData.sender === user
      ? "bg-[#c09eff70] text-white float-right rounded-br-none"
      : "bg-[#1a2238] text-black float-left rounded-bl-none"
    }`}
  >
    <Waveform
      url={messageData.content}
    
      />
  </div>
)}
    </Popover>
  );
}

export default PopoverSection;
