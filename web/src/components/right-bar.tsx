import React, { useState } from 'react';
import {
  MdNotificationsNone,
  MdOutlineExpandMore,
  MdMoreVert,
  MdOutlineSettings
} from 'react-icons/md';
import NotificationPopup from './notification-popup';
import { invitationType } from '../types';
const attachments = [
  {
    name: 'Very important file.pdf',
    type: 'pdf',
    size: '7.6',
    date: '31/10/23, 11:15 AM',
  },
  {
    name: 'Very important file.doc',
    type: 'doc',

    size: '7.6',
    date: '31/10/23, 11:15 AM',
  },
  {
    name: 'Very important file.txt',
    type: 'txt',

    size: '7.6',
    date: '31/10/23, 11:15 AM',
  },
  {
    name: 'Very important file.pdf',
    type: 'pdf',

    size: '7.6',
    date: '31/10/23, 11:15 AM',
  },
];
const members = [
  {
    name: 'Abdessamad pas',
    date: 'last seen recently',
    leader: true,
    image:
      'https://images.unsplash.com/photo-1557002665-c552e1832483?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  },
  {
    name: 'Zakaria elhajri',
    date: 'last seen recently',
    leader: false,
    image:
      'https://images.unsplash.com/photo-1607081692245-419edffb5462?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  },
  {
    name: 'Chaymae Loukili',
    date: 'last seen recently',
    leader: false,
    image:
      'https://images.unsplash.com/photo-1612000529646-f424a2aa1bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    name: 'Oumaima chi la3ba',
    date: 'last seen recently',
    leader: false,
    image:
      'https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg',
  },
];
interface RightBarProps {
  // openPopup: () => void;
  invitations : invitationType[]
}
function RightBar({invitations}:RightBarProps) {
  const username = localStorage.getItem('username');
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
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
            <MdNotificationsNone
              size={20}
              color="#C6C6C6"
              onClick={openPopup}
            />
            <MdMoreVert size={20} color="#C6C6C6" />
          </div>
        </div>
        {showPopup && (
          <NotificationPopup openPopup = {openPopup} invitations = {invitations}/>
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
