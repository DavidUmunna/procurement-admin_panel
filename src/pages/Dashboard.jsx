/* eslint-disable react-hooks/exhaustive-deps */
import UserDetails from "./user_details"
import React, { useState } from 'react';
import { useUser } from "../components/usercontext";
import { useEffect } from "react";
import axios from "axios"
import { admin_roles } from "../components/navBar";
import CostDashboard from "./CostDashboard";





export const Dashboard=()=>{
    const { user } = useUser();
    const [request,setRequest]=useState()
    const [orders,setorders]=useState([])
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [completedOrders, setcompletedOrders] = useState([]);
    const general_access= ["procurement_officer", "human_resources", "internal_auditor", "global_admin","admin",
      "Financial_manager","accounts","Director",];
    const departmental_access=["waste_management_manager","waste_management_supervisor","PVT_manager","Environmental_lab_manager","PVT_manager","lab_supervisor"]
    
    useEffect(()=>{
        const email=user?.email||"no email provided"
        //const admin_roles=["admin","procurement_officer","human_resources","internal_auditor","global_admin"]
        const fetchorder=async ()=>{ 
            if (!user || !user.email) return 

            try{ 
                  let response;
                  if (general_access.includes(user?.role)){

                    const API_URL = `${process.env.REACT_APP_API_URL}/api`
                    const token=localStorage.getItem("authToken")
                    const userReq=await axios.get(`${API_URL}/orders/all`,{headers:{Authorization:`Bearer ${token}`, 
                      "ngrok-skip-browser-warning": "true"},
                      withCredential:true})
                     
                      response=userReq.data.data
                    }else if(departmental_access.includes(user?.role)){
                      if (!user?.Department) return;
                      const API_URL = `${process.env.REACT_APP_API_URL}/api`
                      const token=localStorage.getItem("authToken")
                      const userReq=await axios.get(`${API_URL}/orders/department/all`,{params: {
                        Department: user.Department,
                       
                      },headers:{Authorization:`Bearer ${token}`, 
                      "ngrok-skip-browser-warning": "true"},
                      withCredential:true})
                      
                      response=userReq.data.data
                    }
                    if (Array.isArray(response||[])){
                          
                    
                    setRequest(response)
                    setorders(response)
                    
                    
                   
                    setApprovedOrders(response?.filter((order) => order.status === "Approved"));
                    setPendingOrders(response?.filter((order) => order.status === "Pending"));
                    setRejectedOrders(response?.filter((order) => order.status === "Rejected"));
                    setcompletedOrders(response?.filter((order) => order.status === "Completed"));
                   
                    //console.log("number approved",Approved)
                 }else{
                    console.error("invalid data format")
                 }
    
    
            
            }catch(err){
                console.error("error fetching orders",err)
    
            }
          }
          const fetchuserOrder=async (email)=>{
            if (!user || !user.email) return 
            
            try{
                  const API_URL = `${process.env.REACT_APP_API_URL}/api`
                  const token=localStorage.getItem("authToken")
                  const userReq=await axios.get(`${API_URL}/orders/${user.userId}`,{headers:{Authorization:`Bearer ${token}`, 
                    "ngrok-skip-browser-warning": "true"},
                    withCredential:true})
                  //console.log("user requests",userReq)
                  if (Array.isArray(userReq.response||[])){
                    const orders=userReq.data
                    
                    setorders(orders)
                    setRequest(userReq.data)
                    
                    
                    
                    setApprovedOrders(orders.filter((order) => order.status === "Approved"));
                    setPendingOrders(orders.filter((order) => order.status === "Pending"));
                    setRejectedOrders(orders.filter((order) => order.status === "Rejected"));
                    setcompletedOrders(orders.filter((order) => order.status === "Completed"));
                    //console.log("number approved",Approved)
                 }else{
                    console.error("invalid data format")
                 }
    
    
            
            }catch(err){
                console.error("error fetching orders",err)
    
            }

          }
        if (admin_roles.includes(user?.role)){
            fetchorder();

        }else{
            fetchuserOrder(email)
        }
    },[user?.role,user])
   

   
    const request_length=(request)=>{
        return Array.isArray(request) ? request.length : 0;
    }
    const request_amount=request_length(request)
    

    
    
   

    return(
        <div className=" min-h-screen bg-gray-300  mt-14">
            
           
           
             
            <h1 className="text-3xl font-bold text-gray-800">Welcome {user?.name.split(" ")[1]}</h1>
            <p className="text-gray-600 mt-2">Manage your Requests efficiently.</p>
            <UserDetails user={user}   rejectedOrders={rejectedOrders} request_amount={request_amount} 
            approvedOrders={approvedOrders} pendingOrders={pendingOrders} completedOrders={completedOrders}
             />
            {admin_roles.includes(user?.role)&&<CostDashboard orders={orders}/>}
            
        </div>
    )
  
}



