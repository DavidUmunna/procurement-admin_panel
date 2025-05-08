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
    
    useEffect(()=>{
        const email=user?.email||"no email provided"
        //const admin_roles=["admin","procurement_officer","human_resources","internal_auditor","global_admin"]
        const fetchorder=async ()=>{ 
            if (!user || !user.email) return 

            try{
                  const API_URL = `${process.env.REACT_APP_API_URL}/api`
                  const token=localStorage.getItem("authToken")
                  const userReq=await axios.get(`${API_URL}/orders`,{headers:{Authorization:`Bearer ${token}`, 
                    "ngrok-skip-browser-warning": "true"},
                    withCredential:true})
                  
                  if (Array.isArray(userReq.data||[])){
                    const orders=userReq.data
                    
                    setRequest(orders)
                    setorders(orders)
                    
                    
                   
                    setApprovedOrders(orders.filter((order) => order.status === "Approved"));
                    setPendingOrders(orders.filter((order) => order.status === "Pending"));
                    setRejectedOrders(orders.filter((order) => order.status === "Rejected"));
                   
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
                  const userReq=await axios.get(`${API_URL}/orders/${email}`,{headers:{Authorization:`Bearer ${token}`, 
                    "ngrok-skip-browser-warning": "true"},
                    withCredential:true})
                  
                  if (Array.isArray(userReq.data||[])){
                    const orders=userReq.data
                    console.log("orders",orders)
                    setorders(orders)
                    
                    
                    
                    setApprovedOrders(orders.filter((order) => order.status === "Approved"));
                    setPendingOrders(orders.filter((order) => order.status === "Pending"));
                    setRejectedOrders(orders.filter((order) => order.status === "Rejected"));
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
            <UserDetails user={user}   rejectedOrders={rejectedOrders} request_amount={request_amount} approvedOrders={approvedOrders} pendingOrders={pendingOrders} />
            {admin_roles.includes(user?.role)&&<CostDashboard orders={orders}/>}
            
        </div>
    )
  
}



