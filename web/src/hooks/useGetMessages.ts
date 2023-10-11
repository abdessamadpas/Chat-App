import { useState } from 'react';

const useGetMessages = () => {
  const [errors, setErros] = useState<unknown>(null);

  const fetchMessages = async (senderId: any, receiverId: any) => {
    try {
      const response = await fetch(
        `http://localhost:1337/messages/${senderId}/${receiverId}`,
      );

      if (!response.ok) throw new Error('failed get messages');

      const result = await response.json();

      return result.data;
    } catch (error) {
      console.log(error);
      setErros(error);
      return null;
    }
  };

  return { fetchMessages, errors };
};

export default useGetMessages;
