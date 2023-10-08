import { userType } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
const useGetUsers = () => {
  const [users, setUsers] = useState<userType[]>([]);
  const [errors, setErrors] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiemFrYXJpYSIsImVtYWlsIjoiemFrYXJpYUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRsWUFxODQ5N1psWUhObHhOOG9oRVMuWTNOUUhWZUg0bGszcW5Lbm5zVW1JLnMzWi9jY2lvbSIsImZyaWVuZHMiOltdLCJibG9ja3MiOltdLCJfaWQiOiI2NTIyYzc2NWFmOTY3YmZhYzhkY2QyYTQiLCJtZXNzYWdlcyI6W10sIm5vdGlmaWNhdGlvbnMiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTEwLTA4VDE1OjE0OjQ1LjUwMVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTEwLTA4VDE1OjE0OjQ1LjUwMVoiLCJfX3YiOjB9LCJpYXQiOjE2OTY3NzgwODUsImV4cCI6MTcwNzc1MDg4NX0.jLy9mVCVhCQNv8JM45kJbaZs-qpzx0PwSLS2YsyYUcc"

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
     
        axios.get("http://localhost:1337/auth/getAllUsers" ,{headers: {
          'Authorization': `Basic ${token}` 
        }}).then((res) => {
          console.log(res) 
          setUsers(res.data.data);  
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err)    
                setErrors(err);

            });
    
}
    fetchUsers();
  }, [] );

  return {users, isLoading, errors}
};

export default useGetUsers