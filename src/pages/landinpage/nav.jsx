import React from "react"
import { useNavigate } from "react-router-dom"


const Navbar=()=>{
    const navigate=useNavigate()
    return(
    <div  className="flex justify-top ">

      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">ResourceFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#About us" className="text-gray-600 hover:text-indigo-600">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Get Started
              </button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-indigo-700" onClick={()=>{navigate("/adminlogin")}}>
                Log In
              </button>
            </div>
          </div>
          </div>
       </nav>
    </div>

    )
}

export default Navbar