import React,{useState} from "react";
import { useUser } from "../components/usercontext";
import request_img from "../components/assets/quote-request.png"
import user_img from "../components/assets/user.png"
//import Navbar from "../components/navBar";

const UserDetails = ({ user ,request_amount,approvedOrders,rejectedOrders,pendingOrders}) => {
  const [showApproved, setShowApproved] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
   
  return (
     <div className="flex justify-center  md:mx-auto flex-wrap bg-gray-300 rounded-2xl max-h-full pb-5">
    
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 px-10 text-center sm:mx-auto mt-10 ">
              {user?
              <>
              <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  {user?.imageurl ? (
                    <img src={user_img} alt={user.name || "user"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                      { "U"} {/* Display first letter as fallback */}
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
            <div className="w-20 h-20 rounded-full flex justify-center items-center overflow-hidden bg-gray-200">
              {request_amount ? (
                <img src={request_img} alt={user.name || "user"} className="w-10 h-10 m-4" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                  {user?.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
      
            <div className="mt-6 space-y-4 text-gray-700 w-full max-w-md">
              <div className="bg-gray-400 rounded-2xl p-2">
                <h3 className="text-xl font-semibold text-gray-800">Request Amount: {request_amount}</h3>
              </div>
      
              {/* Approved */}
              <div className="bg-green-400 rounded-2xl p-2 shadow-md hover:translate-y-1">
                <button
                  className="w-full text-left text-xl font-semibold text-white "
                  onClick={() => setShowApproved(!showApproved)}
                >
                  {approvedOrders.length} Approved Requests
                </button>
                {showApproved && (
                  <div className="max-h-[300px] overflow-y-auto">

                      <ul className="mt-2 bg-white text-sm text-gray-800 rounded p-2 shadow">
                        {approvedOrders.map((req, index) => (
                          <li key={index} className="border-b py-1 last:border-none">{req.orderNumber}-{req.orderedBy}</li>
                        ))}
                      </ul>
                  </div>
                )}
              </div>
      
              {/* Pending */}
              <div className="bg-yellow-500 rounded-2xl p-2 shadow-md hover:translate-y-1">
                <button
                  className="w-full text-left text-xl font-semibold text-white"
                  onClick={() => setShowPending(!showPending)}
                >
                   {pendingOrders.length} Pending Requests
                </button>
                {showPending && (
                  <div  className="max-h-[300px] overflow-y-auto">

                      <ul className="mt-2 bg-white text-sm text-gray-800 rounded p-2 shadow">
                        {pendingOrders.map((req, index) => (
                          <li key={index} className="border-b py-1 last:border-none">{req.orderNumber}-{req.orderedBy}</li>
                        ))}
                      </ul>
                  </div>
                )}
              </div>
      
              {/* Rejected */}
              <div className="bg-red-500 rounded-2xl p-2 shadow-md hover:translate-y-1">
                <button
                  className="w-full text-left text-xl font-semibold text-white"
                  onClick={() => setShowRejected(!showRejected)}
                >
                   {rejectedOrders.length}  Rejected Requests
                </button>
                {showRejected && (
                  <ul className="mt-2 bg-white text-sm text-gray-800 rounded p-2 shadow">
                    {rejectedOrders.map((req, index) => (
                      <li key={index} className="border-b py-1 last:border-none">{req.orderNumber}-{req.orderedBy}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
    
    
        </div>
    </div>
  );
};

export default UserDetails;
