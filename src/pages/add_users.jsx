import React, { useEffect, useState } from "react";
import { createUser } from "../services/userService";
import { Eye, EyeOff } from "react-feather";
import { motion,AnimatePresence } from "framer-motion";
//import Navbar from "../components/navBar"

const Add_user = () => {
  const roles = ["staff", "admin", "procurement_officer","human_resources","internal_auditor","global_admin","waste_management_manager","waste_management_supervisor","PVT_manager",
    "lab_supervisor","Environmental_lab_manager","accounts","Director","Financial_manager","QHSE_coordinator","Contracts_manager","Engineering_manager","BD_manager"];
  const [Error,setError]=useState("")
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [Department,setDepartment]=useState("")
  const [password, setpassword] = useState("");
  const [role, setrole] = useState(roles[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setisVisible]=useState(false)
  const [loading, setloading]=useState(false)
  useEffect(()=>{
    setisVisible(true)
    const timer=setTimeout(()=>{
      setisVisible(false)
    },3000)

    return ()=> clearTimeout(timer)
  },[Error])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setloading(true)
      const user_data = await createUser({ name, email, password,Department, role });
      //console.log("Submitting User data:", user_data);
      if (user_data.success===true){

        setname("");
        setemail("");
        setpassword("");
        setDepartment("")
        setrole(roles[0]);
       
      }else{
        setError("user was not created")
        
      }
    }catch(error){
      console.error("user not created:",error)
      if (error.response?.status===401 || error.response?.status===403){
        setError("Session Expired. please Refresh page")


        window.location.href='/adminlogin'
      }else{
        setError("failed operation")
        
      }

    }finally{
      setloading(false)
      
    }
    
  };

  if (loading) {
    return <div className='flex justify-center  items-center h-screen'>
              <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-transparent'>
                 
              </div>
           </div>;
  }

  return (
    <div className="mb-8">
       

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
              <motion.div className="mb-4" whileFocus={{ scale: 1.02 }}>
                <label className="block text-gray-700 font-bold mb-2">Department:</label>
                <select
                  value={Department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all overflow-y-auto  "
                >
                  <option value="" disabled>Select a department</option>
                  <option value="waste_management_dep">Waste Management Department</option>
                  <option value="PVT">PVT Department</option>
                  <option value="Environmental_lab_dep">Environmental Lab Department</option>
                  <option value="accounts_dep">Accounts Department</option>
                  <option value="Human resources">Human Resources</option>
                  <option value="IT">Information Technology</option>
                  <option value="Administration">Administration</option>
                  <option value="Procurement_department">Procurement Department</option>
                  <option value="HSE_dep">HSE Department</option>
                  <option value="Contracts_Department">Contracts Department</option>
                  <option value="Engineering_Department">Engineering Department</option>
                  <option value="Business_Development">Business Development Department</option>
                </select>
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
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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
          <AnimatePresence>
                        {isVisible&& (
                          <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 mt-10 flex  justify-center items-center  text-red-600 border-l-4 border-red-500 bg-red-200"
                          >
                            {Error}
                          </motion.div>
                        )}
          </AnimatePresence>
          
    </div>
    
  );
};

export default Add_user;
