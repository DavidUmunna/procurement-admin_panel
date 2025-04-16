import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  downloadFile,
  get_user_orders,
} from "../services/OrderService";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePdf, FaFile } from "react-icons/fa";
import { useUser } from "./usercontext";
import Searchbar from "./searchbar";
import axios from "axios";
import { useSelector } from "react-redux";

const OrderList = () => {
  const { keyword, status, dateRange, orderedby } = useSelector(
    (state) => state.search
  );
  const admin_roles=["admin","prcurement_officer","human_resources","internal_auditor","global_admin"]

  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const email=user?.email
  useEffect(() => {
    if (admin_roles.includes(user.role)){

      fetchOrders();
    }else{
      fetch_user_orders(email)
    }
  }, [user?.email]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      if (Array.isArray(data)) {
        setOrders(data || []);
      } else {
        console.log(data);
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetch_user_orders=async(email)=>{
    try{
       const data=await get_user_orders(email)
       if (Array.isArray(data.orders)) {
        setOrders(data.orders || []);
      } else {
        console.log(data.orders);
        throw new Error("Invalid data format");
      }
    }catch(error){
        console.error(error)
    }
  }

  const filterOrders = (orders, filters) => {
    return orders.filter((order) => {
      const { orderedby, keyword, status, dateRange } = filters;

      if (orderedby) {
        return (
          order.orderedBy.toLowerCase() === orderedby.toLowerCase()
        );
      }
      if (keyword) {
        return (
          order.orderNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          order.orderedBy.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      if (status) {
        return order.status === status;
      }
      if (dateRange) {
        const matchesDateRange =
          dateRange.start && dateRange.end
            ? new Date(order.date) >= new Date(dateRange.start) &&
              new Date(order.date) <= new Date(dateRange.end)
            : true;
        return matchesDateRange;
      }

      return orders;
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (newStatus === "Approved") {
      const adminName = user.name;
      try {
        const response = await axios.put(
          `api/orders/${orderId}/approve`,
          { adminName, orderId }
        );
        console.log(response.data.message);
      } catch (error) {
        console.error(
          "Error approving order:",
          error.response?.data?.message || error.message
        );
      }
    }
    if (newStatus === "Rejected") {
      const adminName=user.name;
      try{
        const response = await axios.put(
          `api/orders/${orderId}/reject`,
          { adminName, orderId }
        );
        console.log(response.data.message);

      }catch(error){
        console.error(
          "Error rejecting order:",
          error.response?.data?.message || error.message
        );

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

  const displayedOrders = filterOrders(orders, {
    keyword,
    status,
    dateRange,
    orderedby,
  });

  return (
    <div>
      <motion.div className="flex justify-center">
        <Searchbar />
      </motion.div>

      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6">
        <motion.div
          className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-4 sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            📦 Request List
          </h2>

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
                    className="p-4 sm:p-6 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => toggleOrderDetails(order._id)}
                    >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                          Order Number: <span className="text-blue-500">{order.orderNumber}</span>
                        </h3>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 md:mt-0">
                      <div className="relative">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(order._id);
                            }}
                          >
                            {order.status}
                          </button>
                            {user?.canApprove&&(
                          <AnimatePresence>
                            {dropdownOpen === order._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                                className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {["Completed", "Pending", "Approved", "Rejected"].map((statusOption) => (
                                  <button
                                    key={statusOption}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(order._id, statusOption);
                                    }}
                                  >
                                    {statusOption}
                                  </button>)
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>)}
                        </div>
                        {user?.canApprove&&(

                          <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          >
                            Delete
                          </button>
                          )
                        }
                        
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                        className="mt-4 space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-700"><strong>Ordered By:</strong> {order.orderedBy}</p>
                          <p className="text-gray-700"><strong>Approvals:</strong> {order.Approvals || "None"}</p>
                          <p className="text-gray-700"><strong>User Email:</strong> {order.email}</p>
                          <p className="text-gray-700 font-serif">
                            <strong>Products:</strong>{" "}
                            {order.products.map((item, index) => (
                              <span key={index}>
                                {item.name} (Qty: {item.quantity}, Price: {item.price}){" "}
                              </span>
                            ))}
                          </p>
                          <p className={`font-serif ${order.urgency === "VeryUrgent" ? "text-red-500" : "text-gray-700"}`}>
                          <strong>Urgency:</strong> {order.urgency}
                          </p>
                          <p className="text-gray-700 flex items-center gap-2">
                            <strong>File Uploaded:</strong>
                            {order.filenames && order.filenames.length > 0 ? (
                              order.filenames.map((filename, index) => (
                                <a
                                  key={index}
                                  href="#"
                                  onClick={(event) => handleFileDownload(filename, event)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  <FaFilePdf color="red" size={20} title="View File" />
                                </a>
                              ))
                            ) : (
                              <FaFile color="gray" size={20} title="No File Available" />
                            )}
                          </p>
                          <p className="text-gray-700"><strong>Remarks:</strong> {order.remarks || "No remarks"}</p>
                          <p className="text-gray-700"><strong>Date Created:</strong> {order.createdAt.split("T")[0]}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  
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

export default OrderList;
