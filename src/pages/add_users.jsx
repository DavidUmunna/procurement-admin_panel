import React, { useState } from "react";
import {createUser} from "../services/userService"


const Add_user=()=>{
    const [name,setname]=useState("")
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")
    const [role,setrole]=useState("")

    const handleSubmit=async (e)=>{
        e.preventDefault()
        const user_data=await createUser({name,email,password,role});

        console.log("Submitting User data:", user_data);
    
        setname("");
        setemail("");
        setpassword("");
        alert("User Created!");

    }
}


export default Add_user;