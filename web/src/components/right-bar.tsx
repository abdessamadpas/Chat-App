import React, { useState } from 'react';
import {
  MdNotificationsNone,
  MdOutlineExpandMore,
  MdMoreVert,
  MdOutlineSettings
} from 'react-icons/md';
import NotificationPopup from './notification-popup';
import { invitationType } from '../types';
import {members, attachments} from '../constants/index'

interface RightBarProps {
  // openPopup: () => void;
  invitations : invitationType[];
  setInvitations : React.Dispatch<React.SetStateAction<invitationType[]>>
}
function RightBar({invitations,setInvitations}:RightBarProps) {
  const username = localStorage.getItem('username');
  const [showPopup, setShowPopup] = useState(false);
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === 'pending'
  );
  
  const openPopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="hidden  lg:block    h-screen overflow-y-auto overflow-x-hidden  w-96  ">
      <div className="   py-16 px-5   ">
        {/* 1 */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center  gap-2 ">
            <div className="w-10 h-10 overflow-hidden rounded-full ">
              <img
                src="https://images.unsplash.com/photo-1551847812-f815b31ae67c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
                alt="..."
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-semibold text-sm ">{username}</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-1 ">
            <div className='relative'>
               <MdNotificationsNone
              size={20}
              color="#C6C6C6"
              onClick={openPopup}
            />
            {pendingInvitations.length > 0 && (
              <div className="absolute   -top-0.5 -right-0.5 flex justify-center items-center ">
                <div className="relative w-2 h-2 bg-purple-600 rounded-full  "></div>
              </div>)}
            </div>
              <MdMoreVert size={20} color="#C6C6C6" />
          </div>
        </div>
        {showPopup && (
          <NotificationPopup openPopup = {openPopup} invitations = {invitations} setInvitations={setInvitations}/>
      )}
        {/* 2 */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <p className="  text-base font-medium text-gray-950">Attachments</p>
            <MdOutlineExpandMore size={20} color="#C6C6C6" />
          </div>
          <div className="flex flex-col">
            {attachments.map((element, index) => (
              <div
                key={index}
                className="flex  justify-start items-center mt-5 gap-3"
              >
                <div className="  bg-white w-10 h-10 flex justify-center items-center rounded-full">
                  <p className=" text-xs  text-text-main-color  font-medium">
                    {element.type}
                  </p>
                </div>
                <div className="">
                  <p className=" font-bold text-sm text-gray-800">
                    {element.name}
                  </p>
                  <p className="font-light  text-xs text-gray-400 tracking-wide">
                    {element.size} mb • {element.date}
                  </p>
                </div>
              </div>
            ))}
            <p className=" text-sm mt-3  text-text-main-color  font-medium">
              {' '}
              View all
            </p>
          </div>
        </div>
        {/* 3 */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <p className="  text-base font-medium text-gray-950">Members</p>
            <MdOutlineExpandMore size={20} color="#C6C6C6" />
          </div>
          <div className="flex flex-col">
            {members.map((element, index) => (
              <div key={index} className=" flex justify-between  gap-9  mt-5  ">
                <div className="flex gap-2">
                  <div className="w-11 h-11 overflow-hidden rounded-full ">
                    <img
                      src={element.image}
                      alt="..."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className=" font-bold text-sm text-gray-800">
                      {element.name}
                    </p>
                    <p className="font-light  text-xs text-gray-400 tracking-wide">
                      {element.date}
                    </p>
                  </div>
                </div>
                {element.leader ? (
                  <p className=" flex-1 text-sm text-gray-400 font-medium">
                    Group leader
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightBar;
