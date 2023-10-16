import { useEffect, useState } from 'react';
import  {groups} from '../constants/index';
import { TbMessageStar, TbPlus } from 'react-icons/tb';
import { MdPeople, MdOutlinePowerSettingsNew, MdLogout } from 'react-icons/md';
import { MessageTypes, invitationType, notificationType, userType } from '../types/index';
import useRequestFriend from '../hooks/useRequestFriend';
interface sidebarProps {
  selectReceiver: (user: userType) => void;
  togglePopup: () => void;
  user: string | null;
  notifications : any;
  onlineFriends : {},
  invitations : any;
  isLoadingNotifications : boolean
  messages : MessageTypes[]

}

function SideBar({
  selectReceiver,
  togglePopup,
  user,onlineFriends,
  notifications,
  invitations,
  isLoadingNotifications,
  messages
}: sidebarProps) {
  
  
  const [friends, setFriends] = useState<userType[] | []>([]);
  const { getFriends, requestFriend, isLoading } = useRequestFriend();
  const [messageNotif, setMessageNotif] = useState(new Map<string, number>());
  useEffect(() => {
    if (notifications) {
      const newNotif  = notifications.filter((notify : notificationType) => notify?.type === 'message');
      setMessageNotif(newNotif);
    }
    console.log('messageNotif', messageNotif);
    
  }, [isLoadingNotifications, messages]);
   
  useEffect(() => {
    const getFriendsAsync = async () => {
      const friends = await getFriends(user as string);
      friends ? setFriends([...friends]) : console.log('failed to get friends');
    };
    getFriendsAsync();
  }, [selectReceiver, invitations]);
  
  //! work on if online or not


  return (
    <div className="min-w-[96px]   bg-gray-100  flex flex-col items-center  justify-between gap-5  h-screen   pt-10 	px-3  overflow-x-hidden  overflow-y-hidden w-24	 ">
      <div className="flex  flex-col items-center justify-center gap-3 ">
        <div className="flex flex-col justify-center items-center">
          <p className="mb-5 text-xs text-light-color  font-semibold ">
            {' '}
            Groups
          </p>
          <div className="  bg-white w-10 h-10 flex justify-center items-center rounded-full">
            <TbPlus size={24} color="#905FF4" />
          </div>
          {groups.map((group, index) =>
            index === 3 ? (
              <div key={index} className="flex items-center mt-2 ">
                <div className=" bg-white w-10 h-10 flex justify-center items-center rounded-full  border-3  border-purple-500 border-solid">
                  {group.icon}
                </div>
              </div>
            ) : (
              <div
                key={index}
                onClick={() => console.log(index)}
                className="flex items-center mt-2"
              >
                <div className="  bg-white w-10 h-10 flex justify-center items-center rounded-full">
                  {group.icon}
                </div>
              </div>
            ),
          )}
        </div>
        <div className="flex flex-col justify-center items-center ">
          <p className="mb-5 text-xs text-light-color font-semibold"> People</p>
          <div className=" bg-white w-10 h-10 flex justify-center items-center rounded-full">
            <TbPlus size={24} color="#905FF4" onClick={togglePopup} />
          </div>
          {friends?.map((member, index) =>
            
              <div
                key={index}
                onClick={() => selectReceiver(member)}
                className="flex items-center mt-3 justify-center relative"
              >
                <div className="w-10 h-10 overflow-hidden rounded-full ">
                  <img
                    src={member.image}
                    alt={member.username}
                    className="shadow rounded-full max-w-full h-auto align-middle border-none"
                  />
                {Object.keys(onlineFriends).includes(member._id)?     
                  <div className="absolute w-4 h-4 bg-purple-200 bg-opacity-40 rounded-full -top-0.5 -right-0.5 flex justify-center items-center ">
                    <div className="relative w-2 h-2 bg-purple-600 rounded-full  "></div>
                  </div> 
                  : null
                }
                <div className="absolute w-5 h-5 bg-green-300 bg-opacity-40 rounded-xl  -bottom-0.5 -right-0.5 flex justify-center items-center ">
                    <div className="relative w-4 h-4 bg-green-700 rounded-xl  text-center text-xs text-white"> 2</div>
                </div> 
                </div>
              </div>
          )}
        </div>
      </div>

      <div className="flex flex-col mb-2">
        <div className="  bg-white w-10 h-10 flex justify-center items-center rounded-full mt-2">
          <MdPeople size={24} color="#905FF4" />
        </div>
        <div className="  bg-white w-10 h-10 flex justify-center items-center rounded-full mt-2">
          <MdLogout size={24} color="#905FF4" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
