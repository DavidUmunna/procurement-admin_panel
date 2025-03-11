import React, { useState } from "react";
import {createUser} from "../services/userService"
import { Eye, EyeOff } from "react-feather";



const   Add_user=()=>{

    const roles=["staff","admin", "procurement_officer"]
    const [name,setname]=useState("")
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")
    const [role,setrole]=useState(roles[0])
    
    const [showPassword, setShowPassword] = useState(false);
      
    //const [dropdownOpen, setDropdownOpen] = useState()
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const user_data=await createUser({name,email,password,role});

        console.log("Submitting User data:", user_data);
    
        setname("");
        setemail("");
        setpassword("");
        setrole("")
        alert("User Created!");

    }
   

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Creation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2"> Name:</label>
                    <input
                        type="text"
                        placeholder="input name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Email/Username:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4 relative ">
                    <label className="block text-gray-700 font-bold mb-2">Password:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none outlien-offset-1 focus:-outline-offset-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                            type="button"
                            className=" absolute right-3 top-5/6 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                    >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Select Role:
                        <select value={role} onChange={(e) => setrole(e.target.value)}>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                
                <button
                    type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Create User
                </button>
            </form>
        </div>
    </div>
    )
}


export default Add_user;