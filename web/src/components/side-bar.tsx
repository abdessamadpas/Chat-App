import React, {useEffect, useState} from 'react'
import { GrAdd } from "react-icons/gr";
import { SlFeed, SlGraduation, SlTag,SlPresent,SlPeople, SlExclamation } from "react-icons/sl";
import { FcGallery, FcCollaboration,FcParallelTasks, FcDislike } from "react-icons/fc";
import { TbUsers, TbZoomQuestion , TbPlus} from "react-icons/tb";
import { MdPeople, MdOutlinePowerSettingsNew , MdLogout} from "react-icons/md";
import axios from 'axios';
import { userType } from '../types/index';
import useGetUsers  from '../hooks/useGetUsers';
interface sidebarProps {
  selectReceiver: (user: userType) => void;
  receiverId: string | undefined;
  isOpened: boolean;
  togglePopup: () => void;
}

function SideBar( {selectReceiver,receiverId, isOpened, togglePopup} : sidebarProps) {
  const groups = [
  {
    
    name: 'Group 1',
    icon :             <FcGallery size={24}  />,
    members : 2

  },
  {
    name: 'Group 2',
    icon :             <FcCollaboration  size={24} />,
    members : 2

  },
  {
    name: 'Group 3',
    icon :             <FcParallelTasks  size={24} />,
    members : 2

  },
  {
    name: 'Group 4',
    icon :             <FcDislike   size={24}/>,
    members : 2

  }
  ]
  const members = [
    {
      name : 'Abdessamad pas',
      date : 'last seen recently',
      leader : true,
      image : "https://images.unsplash.com/photo-1557002665-c552e1832483?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
    },
    {
      name : 'Zakaria elhajri',
      date : 'last seen recently',
      leader : false,
      image : "https://images.unsplash.com/photo-1607081692245-419edffb5462?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
  
    },
    {
      name : 'Chaymae Loukili',
      date : 'last seen recently',
      leader : false,
      image : "https://images.unsplash.com/photo-1612000529646-f424a2aa1bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  
    },
    {
      name : 'Oumaima chi la3ba',
      date : 'last seen recently',
      leader : false,
      image : "https://images.unsplash.com/photo-1551847812-f815b31ae67c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
  
    },
   
  ]

 
const { users, isLoading, errors } = useGetUsers();

if (isLoading) {
  return <div>Loading...</div>;
}

if (errors) {
  return <div>Error: </div>;
}
  return (
    <div className='min-w-[96px]   bg-gray-100  flex flex-col items-center  justify-between gap-5  h-screen   pt-10 	px-3  overflow-x-hidden  overflow-y-hidden w-24	 '>
      <div className='flex  flex-col items-center justify-center gap-3 '>
        <div className='flex flex-col justify-center items-center'>
          <p className='mb-5 text-xs text-light-color  font-semibold '> Groups</p>
          <div className='  bg-white w-10 h-10 flex justify-center items-center rounded-full'>
            <TbPlus size={24} color='#905FF4' onClick={togglePopup}  />
          </div>
          {groups.map((group,index) => (
            index === 3  ?  
              <div key={index} 
              className='flex items-center mt-2 '>
                <div className=' bg-white w-10 h-10 flex justify-center items-center rounded-full  border-3  border-purple-500 border-solid'>
                  {group.icon}
                </div>
              </div>  : 
              <div key={index} onClick={()=> console.log(index)
              } className='flex items-center mt-2'>
                <div className='  bg-white w-10 h-10 flex justify-center items-center rounded-full'>
                  {group.icon}
                </div>
              </div>
            ))}   
      </div>
      <div className='flex flex-col justify-center items-center '>
          <p className='mb-5 text-xs text-light-color font-semibold'> People</p>
        <div className='  bg-white w-10 h-10 flex justify-center items-center rounded-full'>
          <TbPlus size={24} color='#905FF4'  />
        </div>
        { users.map((member,index) => (
          index ===1 ? 
            <div key={index} onClick={()=> selectReceiver(member)}  className='flex items-center mt-3 justify-center relative'>
              <div className="w-10 h-10 overflow-hidden rounded-full ">
              <img src={member.image} alt={member.username} className="shadow rounded-full max-w-full h-auto align-middle border-none" />
              <div className="absolute w-4 h-4 bg-purple-200 bg-opacity-40 rounded-full -top-0.5 -right-0.5 flex justify-center items-center ">
                <div className="relative w-2 h-2 bg-purple-600 rounded-full  "></div>
              </div>
              </div>
              
            </div>
            : 
             <div key={index} onClick={()=> selectReceiver(member)}  className='flex items-center mt-3 justify-center relative'>
              <div className="w-10 h-10 overflow-hidden rounded-full ">
                <img src={member.image} alt={member.username}  className="shadow rounded-full max-w-full h-auto align-middle border-none" />
              </div>
             
           </div>
           ))}
        
      </div>  
    </div>
     
      <div className='flex flex-col mb-2'>
        <div className='  bg-white w-10 h-10 flex justify-center items-center rounded-full mt-2'>
          <MdPeople size={24} color='#905FF4'  />
        </div>
        <div className='  bg-white w-10 h-10 flex justify-center items-center rounded-full mt-2'>
          <MdLogout  size={24} color='#905FF4'   />
        </div>
      </div>
      
        
    </div>
  )
}

export default SideBar