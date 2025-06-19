/* eslint-disable react-hooks/exhaustive-deps */
import * as Sentry from '@sentry/react';
import UserDetails from "./user_details"
import React, { useState } from 'react';
import { useUser } from "../components/usercontext";
import { useEffect } from "react";
import axios from "axios"

import CostDashboard from "./CostDashboard";
import { get_user_orders } from '../services/OrderService';





export const Dashboard=()=>{
    const { user } = useUser();
    const [request,setRequest]=useState()
    const [orders,setorders]=useState([])
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [completedOrders, setcompletedOrders] = useState([]);
    const general_access= ["procurement_officer", "human_resources", "internal_auditor", "global_admin",
      "Financial_manager","accounts","Director",];
    const departmental_access=["waste_management_manager","waste_management_supervisor","PVT_manager","Environmental_lab_manager","PVT_manager","lab_supervisor","QHSE_coordinator",
      "Contracts_manager","Engineering_manager"]
    const admin_roles = ["procurement_officer", "human_resources", "internal_auditor", "global_admin","lab_supervisor",
       "Financial_manager","waste_management_manager","accounts","waste_management_supervisor","Environmental_lab_manager","PVT_manager",
       "QHSE_coordinator","Contracts_manager","Engineering_manager"];

    useEffect(()=>{
        const email=user?.email||"no email provided"

        const fetchorder=async ()=>{ 
            if (!user || !user.email) return 

            try{ 
                  let response;
                  if (general_access.includes(user?.role)){

                    const API_URL = `${process.env.REACT_APP_API_URL}/api`
                    const token=localStorage.getItem("authToken")
                    const userReq=await axios.get(`${API_URL}/orders/all`,{headers:{Authorization:`Bearer ${token}`, 
                      "ngrok-skip-browser-warning": "true"},
                      withCredentials:true})
                     
                      response=userReq.data.data
                    }else if(departmental_access.includes(user?.role)){
                      if (!user?.Department) return;
                      const API_URL = `${process.env.REACT_APP_API_URL}/api`
                      const token=localStorage.getItem("authToken")
                      const userReq=await axios.get(`${API_URL}/orders/department/all`,{params: {
                        Department: user.Department,
                       
                      },headers:{Authorization:`Bearer ${token}`, 
                      "ngrok-skip-browser-warning": "true"},
                      withCredentials:true})
                      
                      response=userReq.data.data
                    }else{
                      const userReq= await get_user_orders(user?.userId)
                      response=userReq.orders
                    }
                    if (Array.isArray(response)){
                          
                    console.log("its an array",response)
                    setRequest(response)
                    setorders(response)

                    
                    
                   
                    setApprovedOrders(response?.filter((order) => order.status === "Approved"));
                    setPendingOrders(response?.filter((order) => order.status === "Pending"));
                    setRejectedOrders(response?.filter((order) => order.status === "Rejected"));
                    setcompletedOrders(response?.filter((order) => order.status === "Completed"));
                   
                    //console.log("number approved",Approved)
                 }else{
                  
                    Sentry.captureMessage("invalid format")
                 
                }
    
    
            
            }catch(error){
            
                Sentry.captureException(error)
    
            }
          }
          
          

            fetchorder();

    },[user])
   

   
    const request_length=(request)=>{
      return Array.isArray(request) ? request.length : 0;
    }
    const request_amount=request_length(request)
    console.log("request",request_amount)
    

    
    
   

    return(
        <div className=" min-h-screen bg-gray-300  mt-14">
            
           
           
             
            <h1 className="text-3xl font-bold text-gray-800">Welcome {user?.name.split(" ")[1]}</h1>
            <p className="text-gray-600 mt-2">Manage your Requests efficiently.</p>
            <UserDetails user={user}   rejectedOrders={rejectedOrders||[]} request_amount={request_amount} 
            approvedOrders={approvedOrders||[]} pendingOrders={pendingOrders||[]} completedOrders={completedOrders||[]}
             />
            {admin_roles.includes(user?.role)&&<CostDashboard orders={orders}/>}
            
        </div>
    )
  
}



