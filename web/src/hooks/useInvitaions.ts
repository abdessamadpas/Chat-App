import { useState } from 'react';

const useInvitations = () => {
  const [errors, setErros] = useState<unknown>(null);

  const fetchInvitations = async (senderId: any, type : string) => {
    try {
      const response = await fetch(
        `http://localhost:1337/invitations/${senderId}`,
      );

      if (!response.ok) throw new Error('failed get invitations');
      const result = await response.json();  
      if (type === 'all') {
        return result.invitations;
      }
      if (type === "send") {
        const filter = result.invitations.filter((invitation: any) => {    
          return invitation.status === "send"
        } )
        return filter;
      }
        
      if (type === "receive") {
        const filter = result.invitations.filter((invitation: any) => {
          return invitation.status === "receive" && invitation.status !== "pending"
        } )
        return filter;
      }    
    
   
      
    } catch (error) {
      console.log(error);
      setErros(error);
      return null;
    }
  };

  return { fetchInvitations, errors };
};

export default useInvitations;
