import { useEffect, useState } from "react";

interface notificationType {
    sender:string;
     count:number
}

const useGetNotification = (userId: string) => {
  const [notifications, setNotifications] = useState<notificationType[] | []>([]);
  const [errors, setErrors] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:1337/notifications/${userId}`
        );

        if (!response.ok) throw new Error("failed fetching notifications.");

        const result = await response.json();
        
        setNotifications(result.notifications);
      } catch (error) {
        setErrors(error);
      } finally {
        setIsLoading(false);
      }
    };
    getNotifications();
  }, []);
  return { notifications, errors, isLoading };
};


export default useGetNotification;