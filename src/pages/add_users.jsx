import React, { useState } from "react";
import { createUser } from "../services/userService";
import { Eye, EyeOff } from "react-feather";
import { motion } from "framer-motion";
//import Navbar from "../components/navBar"

const Add_user = () => {
  const roles = ["staff", "admin", "procurement_officer"];
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState(roles[0]);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const user_data = await createUser({ name, email, password, role });
      console.log("Submitting User data:", user_data);
      setname("");
      setemail("");
      setpassword("");
      setrole(roles[0]);
      alert("User Created!");
    }catch(error){
      console.error("user not created:",error)

    }
    
  };

  return (
    <div>
       

            <motion.div 
          className="min-h-screen bg-gray-100 flex justify-center items-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Creation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div className="mb-4" whileFocus={{ scale: 1.02 }}>
                <label className="block text-gray-700 font-bold mb-2"> Name:</label>
                <input
                  type="text"
                  placeholder="Input name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </motion.div>
    
              <motion.div className="mb-4" whileFocus={{ scale: 1.02 }}>
                <label className="block text-gray-700 font-bold mb-2">Email/Username:</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </motion.div>
    
              <motion.div className="mb-4 relative" whileFocus={{ scale: 1.02 }}>
                <label className="block text-gray-700 font-bold mb-2">Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-5/6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>
    
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Role:
                  <select
                    value={role}
                    onChange={(e) => setrole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </motion.div>
    
              <motion.button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create User
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
    </div>
    
  );
};

export default Add_user;
