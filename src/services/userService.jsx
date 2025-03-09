import axios from "axios";

const circuitBreaker=require("opossum")


const API_URL="http://localhost:5000/api"

const route="users"
const options={
    timeout:3000,
    errorthresholdpercentage:50,
    resettimeout:5000
  }


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

const get_users_breaker=new circuitBreaker(get_users,options)
get_users_breaker.fallback(() => ({ message: "Service is down. Please try again later." }))

get_users_breaker.fire().then((response)=>console.log(response))
.catch(err=>console.error("circuit breaker triggered",err))

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
const create_users_breaker=new circuitBreaker(createUser,options)
create_users_breaker.fallback(() => ({ message: "Service is down. Please try again later." }))

create_users_breaker.fire().then((response)=>console.log(response))
.catch(err=>console.error("circuit breaker triggered",err))