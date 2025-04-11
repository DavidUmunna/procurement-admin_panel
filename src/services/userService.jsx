import axios from "axios";
//import User from "../../../procurement-users-panel/src/components/user-navbar";

//const circuitBreaker=require("opossum")


const API_URL=" https://localhost:5000/api"

const route="users"



export const get_users=async ()=>{
    try{
        const response = await axios.get(`${API_URL}/${route}`,{headers:{ "ngrok-skip-browser-warning": "true",}});
        console.log(response)
        return response.data;

    }catch (error){
        console.error("Error fetching users:", error);
        return [];
    }
    
}

export const getuserbymail=async(email)=>{
  try{
    const response=await axios.get(`${API_URL}/${route}/${email}`,{headers:{ "ngrok-skip-browser-warning": "true"}})
    if (response){
      console.log("user email exists")
      return response
    }else{
      console.log("user doesnt exist")
    }

  }catch(error){
      console.error("an error occured:",error)
  }
}

export const createUser = async (userData) => {
    try {
      console.log(userData)
      const response = await axios.post(`${API_URL}/${route}`,userData,{ headers:{ "ngrok-skip-browser-warning": "true"}});
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
 

  export const updateUserpassword = async (email, newPassword) => {
    try {
      const response = await axios.put(`${API_URL}/${route}/${email}`, { email,newPassword },{headers:{ "ngrok-skip-browser-warning": "true"}});
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error; // Rethrow error for proper handling in calling function
    }
  };
  

export const updateUser= async (userId, status) => {
    try {
      const response = await axios.put(`${API_URL}/${route}/${userId}`, { status },{headers:{ "ngrok-skip-browser-warning": "true"}});
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