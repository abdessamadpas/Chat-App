import React from 'react';
import {userId} from '../pages/ChatPage'
import {
  MdCheck,
  MdClose,
  MdOutlineSettings
} from 'react-icons/md';
import { invitationType } from '../types';
import { socket } from '../pages/ChatPage';
interface PopupProps {
  openPopup: () => void;
  invitations : invitationType[]
}
function NotificationPopup({openPopup, invitations}:PopupProps) {
  console.log("invitations" , invitations);

  const acceptFriend = ( invitation : invitationType) => {
    socket.emit('send-friend-request-status', {
      status: 'accept',
      userId :  userId,
      friendId : invitation.sender
  })};
  const rejectFriend = (invitation : invitationType) => {
    socket.emit('send-friend-request-status', {
      status: 'reject',
      userId :  userId,
      friendId : invitation.sender
  })
  };
  return  <div className=" bg-white p-2 rounded-xl border shadow-md absolute w-96 right-5  " >
  <div className='flex flex-row justify-between items-center'>
    <p className="text-sm font-medium text-gray-950 py-2 px-1">Recent Notification</p>
    <div className='flex flex-row gap-2'>
    <p className="text-sm font-medium  text-green-600">Mark all as read</p>
    <MdOutlineSettings
      size={20}
      color="#83AFA0"
      onClick={openPopup}
    />
    </div>
  </div>
  <hr/>

  <div className='h-96 overflow-auto'>
    {
      invitations.map((invitation, index) => 
    <div className=' flex flex-row justify-between items-center'>
      <div className='px-2 py-3 flex flex-row justify-start items-center gap-2' >
        <div className="w-10 h-10 overflow-hidden rounded-xl ">
          <img
            src="https://images.unsplash.com/photo-1551847812-f815b31ae67c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="..." 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className=' text-xs'>invitation</p>
          <p className=' text-xs text-gray-500'> from  <span className=' font-semibold  text-black'>@{invitation.name}</span> </p>
          <p className='  text-xs text-gray-500'>1 hours ago</p>
        </div>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        <div className=" bg-purple-100  w-8 h-8 flex justify-center items-center rounded-full">
          <MdCheck
            size={20}
            color="red"
            onClick={()=>acceptFriend(invitation)}
          />
        </div>
        <div className="  bg-purple-400 w-8 h-8 flex justify-center items-center rounded-full">
          <MdClose
            size={20}
            color="white"
            onClick={()=>rejectFriend(invitation)}
          />
        </div>
      </div>
    </div> 
    )}
  </div>
</div>;
}

export default NotificationPopup;