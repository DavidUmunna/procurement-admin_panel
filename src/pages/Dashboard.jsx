/* eslint-disable react-hooks/exhaustive-deps */
import * as Sentry from '@sentry/react';
import UserDetails from "./user_details"
import React, { useState } from 'react';
import { useUser } from "../components/usercontext";
import { useEffect } from "react";
import axios from "axios"
import CostDashboard from "./CostDashboard";
import { get_user_orders } from '../services/OrderService';
import { fetch_RBAC_DASH } from '../services/rbac_service';





export const Dashboard=()=>{
    const { user } = useUser();
    const [request,setRequest]=useState()
    const [orders,setorders]=useState([])
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [completedOrders, setcompletedOrders] = useState([]);

    const [ADMIN_ROLES_DASHBOARD,set_ADMIN_ROLES_DASHBOARD]=useState([])
    
    

    const rbac_=async()=>{
      try{
        const response=await fetch_RBAC_DASH()
        const data=response.data.data

        set_ADMIN_ROLES_DASHBOARD(data.ADMIN_ROLES_DASHBOARD)
        return data
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
    useEffect(()=>{


        const fetchorder=async (rbacData={})=>{ 
            if (!user || !user.email) return 

            try{ 
                  let response;
                  const {GENERAL_ACCESS=[],DEPARTMENTAL_ACCESS=[]}=rbacData
                  if (GENERAL_ACCESS.includes(user?.role)){
                
                    const API_URL = `${process.env.REACT_APP_API_URL}/api`
                    const token=localStorage.getItem("sessionId")
                    const userReq=await axios.get(`${API_URL}/orders/all`,{headers:{"x-session-id":token, 
                      "ngrok-skip-browser-warning": "true"},
                      withCredentials:true})
                     
                      response=userReq.data.data
                    }else if(DEPARTMENTAL_ACCESS.includes(user?.role)){
                      if (!user?.Department) return;
                      const API_URL = `${process.env.REACT_APP_API_URL}/api`
                      const token=localStorage.getItem("sessionId")
                      const userReq=await axios.get(`${API_URL}/orders/department/all`,{params: {
                        Department: user.Department,
                       
                      },headers:{"x-session-id":token, 
                      "ngrok-skip-browser-warning": "true"},
                      withCredentials:true})
                      
                      response=userReq.data.data
                    }else{
                      const userReq= await get_user_orders(user?.userId)
                      response=userReq.orders
                    }
                    if (Array.isArray(response)){
                          

                    setRequest(response)
                    setorders(response)

                    
                    
                   
                    setApprovedOrders(response?.filter((order) => order.status === "Approved"));
                    setPendingOrders(response?.filter((order) => order.status === "Pending"));
                    setRejectedOrders(response?.filter((order) => order.status === "Rejected"));
                    setcompletedOrders(response?.filter((order) => order.status === "Completed"));
                   

                 }else{
                  
                    Sentry.captureMessage("invalid format")
                 
                }
    
    
            
            }catch(error){
              if (error.response?.status===401|| error.response?.status===403){
                       
                        //localStorage.removeItem('sessionId');
                        
                        window.location.href = '/adminlogin'; 
                      }else{
                        
                        Sentry.captureException(error);
                       
                      }

    
            }
          }
          
          
      const init=async()=>{
        const rbacData=await rbac_()
        if (rbacData){

          fetchorder(rbacData);
        }
      }

      init();
            

    },[user])
   

   
    const request_length=(request)=>{
      return Array.isArray(request) ? request.length : 0;
    }
    const request_amount=request_length(request)

    

    
    
   

    return(
        <div className=" min-h-screen bg-gray-300  mt-14">
            
           
           
             
            <h1 className="text-3xl font-bold text-gray-800">Welcome {user?.name.split(" ")[1]}</h1>
            <p className="text-gray-600 mt-2">Manage your Requests efficiently.</p>
            <UserDetails user={user}   rejectedOrders={rejectedOrders||[]} request_amount={request_amount} 
            approvedOrders={approvedOrders||[]} pendingOrders={pendingOrders||[]} completedOrders={completedOrders||[]}
             />
            {ADMIN_ROLES_DASHBOARD.includes(user?.role)&&<CostDashboard orders={orders}/>}
            
        </div>
    )
  
}



