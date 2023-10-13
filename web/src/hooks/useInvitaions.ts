import { useState } from 'react';

const useInvitations = () => {
  const [errors, setErros] = useState<unknown>(null);

  const fetchInvitations = async (senderId: any) => {
    try {
      const response = await fetch(
        `http://localhost:1337/invitations/${senderId}`,
      );

      if (!response.ok) throw new Error('failed get invitations');
      const result = await response.json();      
      return result.invitations;
    } catch (error) {
      console.log(error);
      setErros(error);
      return null;
    }
  };

  return { fetchInvitations, errors };
};

export default useInvitations;
