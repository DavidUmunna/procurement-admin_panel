import axios from 'axios';
;
const API_URL = "http://vigilant_khayyam:5000/api";

const route="admin-user/admin-login"
const route_logout="signin"


export const loginUser=async(email,password)=>{
  try{
    const response=axios.post(`${API_URL}/${route}`,)
    return response.data
  }catch(err){

  }
}

export const logoutUser = async (token) => {
    try {
      await axios.post(`${API_URL}/${route_logout}/logout`,{},{headers:{Authorization:`Bearer${token}`}});
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }