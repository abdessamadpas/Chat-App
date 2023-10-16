import React, { useEffect, useState } from 'react';
import SideBar from '../components/side-bar';
import ChatSection from '../components/chat-section';
import RightBar from '../components/right-bar';
import { userType, MessageTypes, invitationType } from '../types';
import io from 'socket.io-client';
import useGetMessages from '../hooks/useGetMessages';
import useGetNotification from '../hooks/useGetNotifications';
import useDeleteNotification from '../hooks/useDeleteNotifications';
import PopupModel from '../components/popup-model';
import useGetUsers from '../hooks/useGetUsers';
import useInvitations from '../hooks/useInvitaions';
const host = 'http://localhost:1337';

export const socket = io(host, {
  transports: ['websocket'],
  reconnection: false,
  rejectUnauthorized: false,
});


 export const userId = localStorage.getItem('userId');

const ChatPage = () => {

  console.log('user connected is ', userId);
  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [invitations, setInvitations] = useState<invitationType[]>([]);
  const [receiver, setReceiver] = useState<userType | null>(null);
  const [unreadmessage, setUnreadmessage] = useState(new Map<string, number>());
  
  const [onlineFriends, setOnlineFriends] = useState({});
  const { fetchMessages, errors } = useGetMessages();
  const {
    errors: notifsErrors,
    notifications,
    isLoading : isLoadingNotifications,
  } = useGetNotification(userId as string);
  const {fetchInvitations , errors : invitationErros}  = useInvitations()
  const deleteNotification = useDeleteNotification();
  const {
    users,
    isLoading: isLoadingUsers,
    errors: usersErrors,
  } = useGetUsers();
  // send ur socket id to the server
  useEffect(() => {
    socket.emit('join-user', userId);
  }, [userId]);

  //todo : popup model
  const [isOpened, setIsOpened] = useState(false);
  const togglePopup = () => {
    setIsOpened(!isOpened);
  };
  // todo fetch invitations
  useEffect(() => {
    const fetchInvitationsAsync = async (userId: string) => {
      const invitations = await fetchInvitations(userId, "receive");
      if (!invitations) return;
      setInvitations(invitations);
    };
    fetchInvitationsAsync(userId as string);
  }, []);


  useEffect(() => {
    console.log(' invitations', invitations);
  }, [invitations]);

//! working hereeeeeeeeeeeeeeeeeeeeeeeeee
  //todo : get all  notifications
  useEffect(() => {
    if (notifications) {
      const newNotif = notifications.filter(notify => notify?.type === 'message');
      setUnreadmessage(new Map(newNotif.map((notify) => [notify.sender?? '', notify.count?? 0])));
    }else(
      setUnreadmessage(new Map())
    
    )
  }, [isLoadingNotifications]);

  const selectReceiver = async (receiver: userType) => {
    console.log('receiver is ', receiver);

    const generatedChatId = [receiver._id, userId].sort().join('-');
    setChatId(generatedChatId);
    setReceiver(receiver);

    const fetchingMessages = async () => {
      setMessages([])
      const fetchedMessages = await fetchMessages(userId, receiver?._id);
      console.log("rhe errror is",fetchedMessages);
      
      fetchedMessages
        ? setMessages([...fetchedMessages])
        : console.log('fetching messages failed', errors);
    };
    fetchingMessages();

    //! delete unread message from unreadmessage map
    //todo : create a new map and delete the unread message from it for Immutability and State Consistency 🤟🏿
    setUnreadmessage((unreadmessage) => {
      const newUnreadmessage = new Map(unreadmessage);
      newUnreadmessage.delete(receiver._id);
      return newUnreadmessage;
    });

    const isnotifyDeleted = await deleteNotification(
      userId as string,
      receiver?._id,
    );
    if (!isnotifyDeleted) console.log('failed delete notifications 🙂');

    socket.emit('join-chat', {
      receiverId: receiver._id,
      senderId: userId,
      chatId: generatedChatId,
    });
  };

  useEffect(() => {
    const handleJoinChat = (data: any) => {
      const { receiverId, chatId } = data;
      if (receiverId !== userId) return;
      setChatId(chatId);
      socket.emit('join-req-accept', chatId);
    };

    const handleReceiveMessages = (newMessage: MessageTypes) => {
      setMessages((messages) => [...messages, newMessage]);
      if (receiver?._id === newMessage.sender) return;
      setUnreadmessage((prevMessages) => {
        const updateUnreadmessages = new Map(prevMessages);

        if (!updateUnreadmessages.has(newMessage.sender)) {
          updateUnreadmessages.set(newMessage.sender, 1);
          return updateUnreadmessages;
        }
        updateUnreadmessages.set(
          newMessage.sender,
          updateUnreadmessages.get(newMessage.sender)! + 1,
        );
        return updateUnreadmessages;
      });
    };
    const receiveInvitations = (newInvit: invitationType) => {
      console.log('receiveInvitations', newInvit);
      setInvitations((invitations)=>[
        ...invitations, newInvit
      ])
    };
    socket.on('receive-friend-request', receiveInvitations);
    socket.on('join-chat-req', handleJoinChat);
    socket.on('receive-message', handleReceiveMessages);

    return () => {
      socket.off('join-chat');
      socket.off('join-chat-req');
      socket.off('join-req-accept');
      socket.off('receive-message');
      socket.off('receive-friend-request');
    };
  }, [receiver]);

  useEffect(() => {
    const handleOnline = (online:any) => {
      console.log(userId, 'Is Online!');
     
        setOnlineFriends( online);
      
    };
  
    const handleOffline = (onlines:any) => {
      setOnlineFriends(onlines);
      console.log(userId, 'Is Offline!');
    };
  
    socket.on('online', handleOnline);
    socket.on('offline', handleOffline);
  
    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off('online', handleOnline);
      socket.off('offline', handleOffline);
    };
  }, [onlineFriends]); // Make sure to include onlineFriends as a dependency
  
  return (
    <main className="w-full  h-screen   overflow-hidden   bg-gray-100 ">
      <div className="flex flex-row  ">
        <SideBar
          selectReceiver={selectReceiver}
          togglePopup={togglePopup}
          user={userId}
          notifications={notifications}
          onlineFriends={onlineFriends}
          invitations = {invitations}
          isLoadingNotifications = {isLoadingNotifications}
          messages={messages}

        />
        {isOpened ? (
          <PopupModel
            togglePopup={togglePopup}
            isOpen={isOpened}
            users={users}
            userId={userId as string}
            invitations={invitations}
            setInvitations={setInvitations}
          />
        ) : null}
        {receiver ? (
          <ChatSection
            chatId={chatId}
            messages={messages}
            setMessages={setMessages}
            receiver={receiver}
          />
        ) : (
          <div className=" flex-initial relative  w-4/5 my-5 rounded-2xl bg-white  h-[calc(100vh-<height-of-your-fixed-div>)]"></div>
        )}
        <RightBar 
          invitations = {invitations}
          setInvitations = {setInvitations}
          />
      </div>
    </main>
  );
};

export default ChatPage;
