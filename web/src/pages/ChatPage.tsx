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
import SelectReceiverNone from '../components/selectNoReceiver';
import useDragger from '../hooks/useDragabele';

//?* socket connection 
const host = 'http://localhost:1337';
export const socket = io(host, {
  transports: ['websocket'],
  reconnection: false,
  rejectUnauthorized: false,
});
export const userId = localStorage.getItem('userId');

const ChatPage = () => {

  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [invitations, setInvitations] = useState<invitationType[]>([]);
  const [receiver, setReceiver] = useState<userType | null>(null);
  const [unreadmessage, setUnreadmessage] = useState(new Map<string, number>());
  const deleteNotification = useDeleteNotification();
  const [onlineFriends, setOnlineFriends] = useState({});
  const { fetchMessages, errors, loading } = useGetMessages();
  const [shownMessage, setshownMessage] = useState({});
  const [me, setMe] = useState('');
  const {
    notificationsCount : notificationsMessages,
    isLoading : isLoadingNotifMessages,
    setNotificationsCount : setNotificationsMessages,
  } = useGetNotification(userId as string, 'message');
  const {
    errors: notifsErrors,
    notificationsCount : notificationsRequestFriends,
    isLoading : isLoadingNotificationsRequestFriends,
  } = useGetNotification(userId as string, 'requestFriend');

  const {fetchInvitations , errors : invitationErros}  = useInvitations()
  const { users, isLoading: isLoadingUsers, errors: usersErrors,} = useGetUsers();
  
  //todo : for a call
  const [receivingCall, setReceivingCall] = useState(false);
  const[caller, setCaller] = useState('');
  const[callerSignal, setCallerSignal] = useState<any | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    socket.on('callUser',(data) => {
      console.log("u get a call from call user");
      
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.callerName);
      setCallerSignal(data.signalData);
  });
  }, []);

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
    // This effect will be triggered whenever notificationsMessages changes
    setNotificationsMessages(notificationsMessages);
  }, [notificationsMessages, messages, unreadmessage]);

  
  const selectReceiver = async (receiver: userType) => {
    const generatedChatId = [receiver._id, userId].sort().join('-');
    setChatId(generatedChatId);
    setReceiver(receiver);

    const fetchingMessages = async () => {
      setMessages([])
      const fetchedMessages = await fetchMessages(userId, receiver?._id);      
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
    setNotificationsMessages(0);
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
      // setNotificationsMessages((count) => count+1);
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
      setInvitations((invitations)=>[
        ...invitations, newInvit
      ])
    };
    socket.on('receive-friend-request', receiveInvitations);
    socket.on('join-chat-req', handleJoinChat);
    socket.on('receive-message', handleReceiveMessages);
    socket.on('me', (id) => setMe(id));

    return () => {
      socket.off('join-chat');
      socket.off('join-chat-req');
      socket.off('join-req-accept');
      socket.off('receive-message');
      socket.off('receive-friend-request');
    };
  }, [receiver]);

  useEffect(() => {
    socket.on('receive-message-notif', (data: any) => {
      setNotificationsMessages((count) => count+1);
      setshownMessage(data);
    });
    return () => {socket.off('receive-message-notif');}   
  }, []);
  
  useEffect(() => {
    const handleOnline = (online:any) => {
        setOnlineFriends( online);
    };
    const handleOffline = (onlines:any) => {
      setOnlineFriends(onlines);
    };
    socket.on('online', handleOnline);
    socket.on('offline', handleOffline);
    return () => {
    socket.off('online', handleOnline);
    socket.off('offline', handleOffline);
    };
  }, [onlineFriends]); 
  //  useDragger("pink-box")
 
  return (
    <main className="w-full  h-screen p-2   overflow-hidden   bg-gray-100  relative">
        {/* <div id='pink-box' className=' absolute top-0 left-0 cursor-pointer z-10 h-32 w-52 bg-slate-950'  > </div>  */}

      <div    className="flex flex-row  ">
      
        <SideBar
          selectReceiver={selectReceiver}
          togglePopup={togglePopup}
          user={userId}
          notifications={notificationsMessages}
          setNotifications={setNotificationsMessages}
          onlineFriends={onlineFriends}
          invitations = {invitations}
          isLoadingNotifications = {isLoadingNotifMessages}
          messages={messages}
          shownMessage={shownMessage}
          setshownMessage={setshownMessage}

        />
        {isOpened ? (
          <PopupModel
            togglePopup={togglePopup}
            users={users}
            userId={userId as string}
            invitations={invitations}
          />
        ) : null}
        {receiver ? (
          <ChatSection
            chatId={chatId}
            messages={messages}
            setMessages={setMessages}
            onlineFriends={onlineFriends}
            receiver={receiver}
            loading = {loading}

            me = {me}
            name = {name}
            callerSignal = {callerSignal}
            caller = {caller}
            receivingCall = {receivingCall}
            setReceivingCall = {setReceivingCall}
          


          />
        ) : (
          <SelectReceiverNone/>        
          )}
       {receiver ? ( <RightBar 
          invitations = {invitations}
          setInvitations = {setInvitations}
          />) : null}
      </div>
    </main>
  );
};

export default ChatPage;
