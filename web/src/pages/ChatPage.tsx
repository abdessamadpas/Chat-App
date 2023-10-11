import React,{ useEffect, useState } from "react";
import SideBar from "../components/side-bar";
import ChatSection from "../components/chat-section";
import RightBar from "../components/right-bar";
import { userType , MessageTypes} from "../types";
import io from "socket.io-client";
import useGetMessages from "../hooks/useGetMessages";
import useGetNotification from "../hooks/useGetNotifications";
import useDeleteNotification from "../hooks/useDeleteNotifications";
import PopupModel from "../components/popup-model";
import useGetUsers from "../hooks/useGetUsers";
export const socket = io("http://localhost:1337");

const ChatPage = () => {
  const userId = localStorage.getItem("userId") ;
  console.log('user connected is ',userId);
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [receiver, setReceiver] = useState<userType | null>(null);
  const [unreadmessage, setUnreadmessage] = useState(new Map<string, number>());
  const {fetchMessages, errors} = useGetMessages();
  const { errors: notifsErrors, notifications, isLoading } = useGetNotification(userId as string );
  const deleteNotification = useDeleteNotification();
  const { users, isLoading : isLoadingUsers, errors : usersErrors } = useGetUsers();


  //todo : popup model
  const [isOpened, setIsOpened] = useState(false);
  const togglePopup = () => {
    setIsOpened(!isOpened);
  };
  useEffect(() => {
    console.log('isOpened',isOpened);
    
  }, [isOpened])


  //todo : get all  messages

  useEffect(() => {
    console.log('fetching messages');
    
    const fetchingMessages = async () => {
      const fetchedMessages = await fetchMessages(userId , receiver?._id );
      fetchedMessages
        ? setMessages([...fetchedMessages])
        : console.log("fetching messages failed", errors);
    };
    fetchingMessages();
  }, [unreadmessage]);
  useEffect(() => { console.log(' messages', messages);
  }, [messages]);

  //todo : get all  notifications
  useEffect(() => {
    notifications &&
    setUnreadmessage(
      new Map(notifications.map((notify) => [notify.sender, notify.count]))
    );
  }, [isLoading]);
  
  const selectReceiver = async (receiver: userType) => {
    console.log('receiver is ',receiver);
    
    const generatedChatId = [receiver._id, userId].sort().join("-");
    setChatId(generatedChatId);
    setReceiver(receiver);
    
    //! delete unread message from unreadmessage map 
    //todo : create a new map and delete the unread message from it for Immutability and State Consistency 🤟🏿
    setUnreadmessage((unreadmessage) => {
      const newUnreadmessage = new Map(unreadmessage);
      newUnreadmessage.delete(receiver._id);
      return newUnreadmessage;
    });
    
    const isnotifyDeleted = await deleteNotification(
      userId as string,
      receiver?._id
    );
    if (!isnotifyDeleted) console.log("failed delete notifications 🙂");

    socket.emit("join-chat", {
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
      socket.emit("join-req-accept", chatId);
    };

    const handleReceiveMessages = (newMessage: MessageTypes) => {
      setMessages((messages) => [...messages, newMessage]);
      // check if he is the receiver
      if (receiver?._id === newMessage.sender) return;

      setUnreadmessage((prevMessages) => {
        const updateUnreadmessages = new Map(prevMessages);

        if (!updateUnreadmessages.has(newMessage.sender)) {
          updateUnreadmessages.set(newMessage.sender, 1);
          return updateUnreadmessages;
        }
        updateUnreadmessages.set(
          newMessage.sender,
          updateUnreadmessages.get(newMessage.sender)! + 1
        );
        return updateUnreadmessages;
      });
    };
    const recieveInvitations = (data: any) => {
      console.log('recieveInvitations',data);
      
    }
    socket.on("receive-friend-request", recieveInvitations);
    socket.on("join-chat-req", handleJoinChat);
    socket.on("receive-message", handleReceiveMessages);


      return () => {
        socket.off("join-chat");
        socket.off("join-chat-req");
        socket.off("join-req-accept");
        socket.off("receive-message");
        socket.off("receive-friend-request");
      };
  }, [receiver]);
  
  useEffect(() => {
    const recieveInvitations = (data: any) => {
      console.log('receiveInvitations', data);
      // Handle the friend request here
    }
    socket.on("receive-friend-request", recieveInvitations);
  
    return () => {
      socket.off("receive-friend-request");
    };
  }, []);
  


  return (
    <main className="  w-full  h-screen   overflow-hidden   bg-gray-100 ">
      <div className="flex flex-row  ">
        <SideBar  
          selectReceiver={selectReceiver}
          receiverId={receiver?._id}
          isOpened = {isOpened}
          togglePopup = {togglePopup}
          user = {userId }
        />
        {isOpened ? <PopupModel 
        togglePopup={togglePopup} 
        isOpen={isOpened} 
        users = {users} 
        userId = {userId as string}
        /> 
        : null}
        {receiver ? 
          <ChatSection 
            chatId={chatId}
            messages={messages}
            setMessages={setMessages}
            receiver={receiver}
          /> :   <div className=' flex-initial relative  w-4/5 my-5 rounded-2xl bg-white  h-[calc(100vh-<height-of-your-fixed-div>)]' >
      </div>
          
        }

        <RightBar/>
      </div>
      
    </main>
  );

};

export default ChatPage;
