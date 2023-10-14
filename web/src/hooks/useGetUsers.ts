import { userType } from '../types';
import { useEffect, useState } from 'react';
import axios from 'axios';
const userId = localStorage.getItem('userId')
const useGetUsers = () => {
  const [users, setUsers] = useState<userType[]>([]);

  const [errors, setErrors] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem('token') || '';
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:1337/auth/getAllUsers', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
  
      const users = res.data.data
        .map((user: userType) => user)
        .filter((user:userType) => user._id !== userId);
  
      setUsers(users);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setErrors(err);
    }
  };
  
  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      // Handle the case where there is no token (e.g., redirect to login)
    }
  }, [token]);

  return { users, isLoading, errors };
};

export default useGetUsers;
