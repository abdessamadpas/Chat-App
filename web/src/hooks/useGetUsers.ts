import { userType } from "../types";
import { useEffect, useState } from "react";

const useGetUsers = (currentUserId:string) => {
  const [users, setUsers] = useState<userType[]>([]);
  const [errors, setErros] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8080/userslist");
        if (!response.ok) throw new Error("failed get users");
        const result = await response.json();
        const usersFilter = result?.users?.filter(
          (userData: userType) => userData.id !== currentUserId
        );
        setUsers(usersFilter);
      } catch (error) {
        console.log(error);
        setErros(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return {users, isLoading, errors}
};

export default useGetUsers