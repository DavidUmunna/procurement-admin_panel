import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder, downloadFile } from "../services/OrderService";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePdf, FaFile } from "react-icons/fa";
import {connect} from "react-redux"
import {useUser} from "./usercontext"
import Searchbar from "./searchbar"
import axios from "axios"


const mapstatetoprop=(state)=>{
  return {
      searchResults:state.searchResults ||[]
  }

}

const OrderList = ({searchResults}) => {
  const {user} = useUser()
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      if (Array.isArray(data)) {
        setOrders(data || []);
      } else {
        console.log(data)
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if(newStatus==="Approved"){
      console.log(orderId,"this is for ap[proved")
      const adminName=user.name
      try {
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/approve`, {adminName,orderId});
        console.log(response.data.message);
    } catch (error) {
        console.error("Error approving order:", error.response?.data?.message || error.message);
    }
    }
    fetchOrders();
    setDropdownOpen(null);
  };

  const handleDelete = async (orderId) => {
    await deleteOrder(orderId);
    setOrders(orders.filter((order) => order._id !== orderId));
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleDropdown = (orderId) => {
    setDropdownOpen(dropdownOpen === orderId ? null : orderId);
  };

  const handleFileDownload = async (fileName, event) => {
    event.preventDefault();
    try {
      const fileData = await downloadFile(fileName);
      console.log(fileData)
      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const displayedOrders=searchResults.length>0? searchResults:orders
  return (
    <div>

      <motion.div>
        <Searchbar/>
      </motion.div>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6">
      
      <motion.div 
        className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-4 sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">📦 Request List</h2>

        {displayedOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <motion.ul className="space-y-4 sm:space-y-6">
            <AnimatePresence>
              {displayedOrders.map((order) => (
                <motion.li
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }}
                  layout
                  className="p-4 sm:p-6 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                      <p className="font-serif text-lg text-gray-700 mb-2">Ordered By: {order.orderedBy}</p>
                      <p className="font-serif text-lg text-gray-700 mb-2">Approvals: {order.Approvals}</p>

                      <p className="font-serif text-lg text-gray-700 mb-2">
                        Products: {order.products.map((item, index) => (
                          <span key={index}>
                            {item.name} (Qty: {item.quantity}, Price: {item.price})
                          </span>
                        ))}
                      </p>
                      <p className="font-serif text-lg text-gray-700 mb-2">User email: {order.email}</p>
                      <p className={`font-serif text-lg mb-2 ${order.urgency === "VeryUrgent" ? "text-red-500" : "text-gray-700"}`}>
                        Urgency: {order.urgency}
                      </p>
                      <p className="font-serif flex text-lg text-gray-700 mb-2">
                        File Uploaded: {order.filenames && order.filenames.length>0 ? (
                          order.filenames.map((filename,index)=>(

                            <a
                            href="#"
                            onClick={(event) => handleFileDownload(filename, event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                            >
                              <FaFilePdf color="red" size={20} title="View File" />
                            </a>
                          ))
                          
                        ) :( <FaFile color="gray" size={20} title="No File Available" />)}
                      </p>
                      <p className="font-serif text-lg text-gray-700 mb-2">Remarks: {order.remarks || "No remarks"}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          onClick={() => toggleDropdown(order._id)}
                        >
                          {order.status}
                        </button>
                        <AnimatePresence >
                          {dropdownOpen === order._id && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                            >
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(order._id, "Completed")}
                              >
                                Complete
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(order._id, "Pending")}
                              >
                                Pending
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(order._id, "Approved")}
                              >
                                Approved
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(order._id, "Rejected")}
                              >
                                Rejected
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={() => handleDelete(order._id)}>Delete</button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </motion.div>
    </div>
    </div>
  );
};

export default connect(mapstatetoprop)(OrderList);