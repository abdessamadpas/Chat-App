import { useEffect, useState } from 'react';
import { notificationType } from '../types';


const useGetNotification = (userId: string, type : string) => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [errors, setErrors] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:1337/notifications/${userId}/${type}`,
        );

        if (!response.ok) throw new Error('failed fetching notifications.');
          const result = await response.json();          
          setNotificationsCount(result.notifications[0].count);
      } catch (error) {
        setErrors(error);
      } finally {
        setIsLoading(false);
      }
    };
    getNotifications();
  }, []);
  return { notificationsCount,setNotificationsCount, errors, isLoading };
};

export default useGetNotification;
