import UserDetails from "./user_details"
import React, { useState } from 'react';
import { useUser } from "../components/usercontext";
import { getOrders } from "../services/OrderService";
import { useEffect } from "react";
import axios from "axios"



export const Dashboard=()=>{
    const { user } = useUser();

    const [request,setRequest]=useState()
    const [Approved_req,setAproved_req]=useState(0)
    const [Pending_req,setPending_req]=useState(0)
    const [Rejected_req,setRejected_req]=useState(0)
   
    useEffect(()=>{
        const getUsersData=async ()=>{
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
                    
                    
                    const Approved=orders.reduce((count,item)=>count+(item.status==="Approved"?1:0),0)
                    setAproved_req(Approved)
                    setPending_req(orders.reduce((count,item)=>count+(item.status==="Pending"?1:0),0))
                    setRejected_req(orders.reduce((count,item)=>count+(item.status==="Rejected"?1:0),0))
                    console.log("number approved",Approved)
                 }else{
                    console.error("invalid data format")
                 }
    
    
            
            }catch(err){
                console.error("error fetching orders",err)
    
            }
          }
        getUsersData();
    },[])
       
    console.log(user)
    console.log(request)
    const request_length=(request)=>{
        try{

            return request.length
        }catch(err){
            console.error("request probably was undefined:",err)
        }
    }
    const request_amount=request_length(request)
    
   

    return(
        <div className=" min-h-screen bg-gray-100 ">
            
           
           
                
            <h1 className="text-3xl font-bold text-gray-800">Welcome {user?.name.split(" ")[1]}</h1>
            <p className="text-gray-600 mt-2">Manage your Requests efficiently.</p>
            <UserDetails user={user}  Approved_req={Approved_req} Pending_req={Pending_req} Rejected_req={Rejected_req} request_amount={request_amount} />
            
        </div>
    )
  
}



