import React from 'react';
import { userType } from '../types';
import e from 'express';
import useRequestFriend from '../hooks/useRequestFriend';
import { socket } from '../pages/ChatPage';

interface PopupProps {
  isOpen: boolean;
  togglePopup: () => void;
  users: userType[];
  userId: string;
}

function PopupModel({ togglePopup, isOpen, users, userId }: PopupProps) {
  // const {requestFriend } = useRequestFriend();
  const [search, setSearch] = React.useState<Array<userType>>(users);

  const filterUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (keyword !== '') {
      const results = users.filter((user) => {
        return user.username.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setSearch(results);
    } else {
      setSearch(users);
    }
  };
  const addFriend = (member: userType) => {
    socket.emit('send-friend-request', {
      senderId: userId,
      receiverId: member._id,
    });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg shadow-lg w-2/4 p-5   my-0">
        {/* header model */}
        <div className=" flex flex-row justify-between">
          <p className="">Add a friend</p>
          <button
            className=" text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={togglePopup}
          >
            &#x2715;
          </button>
        </div>
        {/* //* body model */}
        <div className="flex items-center flex-col">
          <div className=" w-full flex flex-row gap-3 py-5">
            <input
              type="text"
              onChange={(e) => filterUsers(e)}
              placeholder="Search..."
              className="border  border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:border-transparent"
            />
            <button className="bg-purple-500 text-white p-2 rounded-lg">
              Search
            </button>
          </div>
          <div className="w-full h-52 overflow-auto ">
            <div className=" flex flex-col gap-6">
              {search.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full ">
                      <img
                        src={member.image}
                        alt="..."
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className=" font-semibold text-sm">
                        {member.username}
                      </p>
                      <p className=" font-extralight text-xs text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <button
                      className="bg-purple-500 text-white p-2 rounded-lg"
                      onClick={() => addFriend(member)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupModel;
