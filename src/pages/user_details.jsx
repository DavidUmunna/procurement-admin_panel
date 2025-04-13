import React from "react";
import { useUser } from "../components/usercontext";
import request_img from "../components/assets/quote-request.png"
import user_img from "../components/assets/user.png"
//import Navbar from "../components/navBar";

const UserDetails = ({ user ,request_amount,Approved_req,Pending_req,Rejected_req}) => {
  
   
  return (
     <div className="flex justify-center  md:mx-auto flex-wrap">
    
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 px-10 text-center sm:mx-auto mt-10 ">
              {user?
              <>
              <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  {user?.imageurl ? (
                    <img src={user_img} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                      {user.name.charAt(0).toUpperCase()} {/* Display first letter as fallback */}
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-500">{user.role}</p>
              </div>
              <div className="mt-6 space-y-4 text-gray-700">
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-medium">📧</span>
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium">📞</span>
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
              </>:null}
              
            </div>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-4 px-10 text-center sm:mx-auto mt-10">
    
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex justify-center items-center  overflow-hidden bg-gray-200">
                  {request_amount ? (
                    <img   src={request_img} alt={user.name} className="w-10 h-10 m-4 " />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                      {user.name.charAt(0).toUpperCase()} {/* Display first letter as fallback */}
                    </div>
                  )}
                </div>
                
              </div>
              <div className="mt-6 space-y-4 text-gray-700">
                <div className="bg-gray-400 rounded-2xl p-1">
    
                  <h3 className=" text-xl font-semibold text-gray-800  ">Request Amount:{request_amount}</h3>
                </div>
                <div className="bg-green-300 rounded-2xl p-2">
                  <h3 className=" text-xl font-semibold text-gray-800">Approved Requests:{Approved_req}</h3>
                </div>
                <div className="bg-yellow-300 rounded-2xl p-2">
    
                  <h3 className=" text-xl font-semibold text-gray-800">Pending Requests:{Pending_req}</h3>
                </div>
                <div className="bg-red-300 rounded-2xl p-2">
                  <h3 className="text-xl font-semibold text-gray-800">Rejected Requests:{Rejected_req}</h3>
                </div>
              </div>
            </div>
    
         </div>
  );
};

export default UserDetails;
