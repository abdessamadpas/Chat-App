import { userType } from "../types";
import { useState } from "react";

const useRequestFriend = () => {
    const [isLoading, setIsLoading] = useState(false);


    const getFriends = async (userId:string) => {
setIsLoading(true)
      try {
        
        const response = await fetch(
          `http://localhost:1337/friends/${userId}`,
          {method: "GET"}
        );
        if (!response.ok) throw new Error("failed fetching friends.");
        const result = await response.json();
        setIsLoading(false)
        return result;
    } catch (error) {
        return false;
     }
    };

    const requestFriend = async (userId:string, receiverId:string) => {
        try {
            const response = await fetch(
            `http://localhost:1337/addfriend/${userId}/${receiverId}`,
            {method: "POST"}
            );
            if (!response.ok) throw new Error("failed fetching friends.");
            const result = await response.json();
            return result;
        } catch (error) {
            return false;
         }
    }
    return {getFriends , requestFriend, isLoading};
  };
  
  export default useRequestFriend;
  