import * as Sentry from "@sentry/react"
import axios from "axios";
import { getCookie } from "../components/Helpers";



const API_URL = `${process.env.REACT_APP_API_URL}/api`

const route="users"


const csrf_token=getCookie("XSRF-TOKEN")


export const get_users=async ()=>{
    try{
        const response = await axios.get(`${API_URL}/${route}`,{headers:{ "ngrok-skip-browser-warning": "true",}});
        
        return response.data;

    }catch (error){
      Sentry.captureMessage("Error fetching users")
      Sentry.captureException(error)
        
        return [];
    }
    
}

export const sendResetLink=async(email)=>{
  try{
    const response=await axios.put(`${API_URL}/${route}/reset`,{email},{headers:{ "ngrok-skip-browser-warning": "true"}})
    
    if (response.data?.success===true){
      
      return response
    }else{
      Sentry.captureMessage("user does not exist")
      
      
    }

  }catch(error){
    const response=error

    //console.error("an error occured:",error)
    return response
  }
}

export const createUser = async (userData) => {
    try {
      const token=localStorage.getItem("sessionId")
     
      const response = await axios.post(`${API_URL}/${route}`,userData,{headers:{"x-csrf-token":csrf_token},withCredentials:true});
     
      return response.data;
    } catch (error) {
       Sentry.captureMessage("Error Creating users")
      Sentry.captureException(error)
      
    }
  };
 

  export const updateUserpassword = async (token, newPassword) => {
    try {
      const response = await axios.put(`${API_URL}/${route}/reset-password`, { token,newPassword });
      return response.data;
    } catch (error) {
      Sentry.captureMessage("Error updating password users")
      Sentry.captureException(error)

      throw error; // Rethrow error for proper handling in calling function
    }
  };
  

export const updateUser= async (userId, payload) => {
    try {
    
      const response = await axios.put(`${API_URL}/${route}/${userId}/updateuser`,  payload,{headers:{"x-csrf-token":csrf_token},withCredentials:true} );
     
      return response.data;
    } catch (error) {
      Sentry.captureMessage("Error updatng user")
      Sentry.captureException(error)

    }
  };

export const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${route}/${userId}`,{headers:{"x-csrf-token":csrf_token},withCredentials:true});
    } catch (error) {
       Sentry.captureMessage("Error Deleting user")
       Sentry.captureException(error)
      
    }
  };