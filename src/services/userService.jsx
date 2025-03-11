import axios from "axios";
//import User from "../../../procurement-users-panel/src/components/user-navbar";

//const circuitBreaker=require("opossum")


const API_URL="http://localhost:5000/api"

const route="users"



export const get_users=async ()=>{
    try{
        const response = await axios.get(`${API_URL}/${route}`);
        console.log(response)
        return response.data;

    }catch (error){
        console.error("Error fetching users:", error);
        return [];
    }
    
}



export const createUser = async (userData) => {
    try {
      console.log(userData)
      const response = await axios.post(`${API_URL}/${route}`, userData);
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };


export const updateUser= async (userId, status) => {
    try {
      const response = await axios.put(`${API_URL}/${route}/${userId}`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

export const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${route}/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };