import axios from 'axios';
;
const API_URL = "http://localhost:5000/api";

const route="signin"




export const logoutUser = async (token) => {
    try {
      await axios.post(`${API_URL}/${route}/logout`,{},{headers:{Authorization:`Bearer${token}`}});
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }