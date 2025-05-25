import axios from "axios";
//import User from "../../../procurement-users-panel/src/components/user-navbar";

//const circuitBreaker=require("opossum")


const API_URL = `${process.env.REACT_APP_API_URL}/api`

const route="users"



export const get_users=async ()=>{
    try{
        const response = await axios.get(`${API_URL}/${route}`,{headers:{ "ngrok-skip-browser-warning": "true",}});
        
        return response.data;

    }catch (error){
        console.error("Error fetching users:", error);
        return [];
    }
    
}

export const sendResetLink=async(email)=>{
  try{
    const response=await axios.put(`${API_URL}/${route}/reset`,{email},{headers:{ "ngrok-skip-browser-warning": "true"}})
    
    if (response.data?.success===true){
      
      return response
    }else{
      console.log("user doesnt exist")
      
    }

  }catch(error){
    const response=error

    //console.error("an error occured:",error)
    return response
  }
}

export const createUser = async (userData) => {
    try {
      const token=localStorage.getItem("authToken")
     
      const response = await axios.post(`${API_URL}/${route}`,userData,{headers:{Authorization:`Bearer ${token}`}});
     
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
 

  export const updateUserpassword = async (token, newPassword) => {
    try {
      const response = await axios.put(`${API_URL}/${route}/reset-password`, { token,newPassword });
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error; // Rethrow error for proper handling in calling function
    }
  };
  

export const updateUser= async (userId, payload) => {
    try {
      console.log("from client",payload)
      const response = await axios.put(`${API_URL}/${route}/${userId}/updateuser`,  payload );
      console.log("response",response)
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