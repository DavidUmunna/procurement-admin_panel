/*disable eslint react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "./usercontext";
import { motion } from "framer-motion";
import axios from "axios";
import * as Sentry from "@sentry/react"
export default function SignOut({ setAuth }) {
    const { user,setUser } = useUser();
    const [error,setError]=useState(null)

    useEffect(() => {
        setAuth(false);
        const logout_backend=async()=>{
            try{
               
                
            
                const API = `${process.env.REACT_APP_API_URL}/api`
                const response=await axios.post(`${API}/admin-user/logout`,{userId:user.userId},{withCredentials:true})
                if (response.success===true){


                    setUser(null);
                    localStorage.removeItem("user");
                     
                }else if(error.response){
                    setError("An Error Occurred")
                }
            }catch(error){
                if (error.message === "Network Error" || error.code === "ERR_NETWORK"){
                        window.location.href = '/adminlogin';
                      }else if (error.response?.status===401|| error.response?.status===403){
                                             
                        //localStorage.removeItem('sessionId');
                        
                        window.location.href = '/adminlogin'; 
                      }else{
                        
                        Sentry.captureException(error);
                       
                      }
                
            }
        }
        logout_backend()
        setTimeout(() => {
                window.location.href = '/adminlogin';
        }, 600);
        
        

        
         // Delay for smoother transition
    }, []);
    if (error){
        return <div className="p-4 flex  justify-center items-end min-h-screen text-red-600 border-l-4 border-red-500 bg-red-200">
              {error}
            </div>
    }
    return (
       <motion.div
      className="flex justify-center items-center h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-lg font-semibold text-gray-800"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Signing out...
      </motion.h2>
    </motion.div>
    );
}