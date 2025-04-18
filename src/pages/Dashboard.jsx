import UserDetails from "./user_details"
import React, { useState } from 'react';
import { useUser } from "../components/usercontext";
import { getOrders } from "../services/OrderService";
import { useEffect } from "react";
import axios from "axios"

import CostDashboard from "./CostDashboard";




export const Dashboard=()=>{
    const { user } = useUser();
    const admin_roles=["admin","procurement_officer","human_resources","internal_auditor","global_admin"]
    const [request,setRequest]=useState()
    const [orders,setorders]=useState([])
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const email=user?.email||"no email provided"
   
    useEffect(()=>{
       
        if (admin_roles.includes(user.role)){
            fetchorder();

        }else{
            fetchuserOrder(email)
        }
    },[])
    const fetchorder=async ()=>{ 
            if (!user || !user.email) return 

            try{
                  const token=localStorage.getItem("authToken")
                  const userReq=await axios.get("/api/orders",{headers:{Authorization:`Bearer ${token}`, 
                    "ngrok-skip-browser-warning": "true"},
                    withCredential:true})
                  console.log("user orders for count:",userReq)
                  if (Array.isArray(userReq.data||[])){
                    const orders=userReq.data
                    console.log("orders",orders)
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
                  const token=localStorage.getItem("authToken")
                  const userReq=await axios.get(`/api/orders/${email}`,{headers:{Authorization:`Bearer ${token}`, 
                    "ngrok-skip-browser-warning": "true"},
                    withCredential:true})
                  console.log("user orders for count:",userReq)
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

    
    console.log(user)
    console.log("user orders",orders)
    console.log(approvedOrders)
    console.log(pendingOrders)
    const request_length=(request)=>{
        return Array.isArray(request) ? request.length : 0;
    }
    const request_amount=request_length(request)
    const sampleOrders = [
      {
        createdAt: '2024-04-01T00:00:00Z',
        products: [
          { price: 100, quantity: 1 },
          { price: 50, quantity: 2 }
        ]
      },
      {
        createdAt: '2024-04-15T00:00:00Z',
        products: [
          { price: 80, quantity: 1 }
        ]
      }
    ];
    
   

    return(
        <div className=" min-h-screen bg-gray-300 ">
            
           
           
             
            <h1 className="text-3xl font-bold text-gray-800">Welcome {user?.name.split(" ")[1]}</h1>
            <p className="text-gray-600 mt-2">Manage your Requests efficiently.</p>
            <UserDetails user={user}   rejectedOrders={rejectedOrders} request_amount={request_amount} approvedOrders={approvedOrders} pendingOrders={pendingOrders} />
            <CostDashboard orders={orders}/>
            
        </div>
    )
  
}



