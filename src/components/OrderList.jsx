import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  downloadFile,
  
} from "../services/OrderService";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePdf, FaFile, FaTrash, FaEllipsisV, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { FiDownload, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useUser } from "./usercontext";
import Searchbar from "./searchbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { setStatus } from "../js/reducer/rootreducer";


const ADMIN_ROLES = [ "procurement_officer", "human_resources", "internal_auditor", "global_admin"];

const OrderList = ({orders,setOrders, selectedOrderId}) => {
  const { keyword, status, dateRange, orderedby } = useSelector(
    (state) => state.search
  );
  const { user } = useUser();
  //const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOverallStatus = (approvals) => {
    if (!approvals || approvals.length === 0) return "Pending";
    if (approvals.some(a => a.status === "Rejected")) return "Rejected";
    if (approvals.some(a=>a.status==="Completed")) return "Completed"
    
    const approvalCount = approvals.filter(a => a.status === "Approved").length;
    const REQUIRED_APPROVALS = 2; // Change this to your business logic
    
    if (approvalCount >= REQUIRED_APPROVALS) return "Approved";
    if (approvalCount > 0) return "Partially Approved";
    
    return "Pending";
  };
  const getStatusExplanation = (approvals) => {
    const status = getOverallStatus(approvals);
    const approvalsCount = Array.isArray(approvals)?approvals?.filter(a => a.status === "Approved").length : 0;
    const REQUIRED_APPROVALS=2
    
    switch(status) {
      case "Approved":
        return `Approved by ${approvalsCount} administrator(s)`;
      case "Partially Approved":
        return `Partially approved (${approvalsCount} of ${REQUIRED_APPROVALS} required approvals)`;
      case "Rejected":
        const rejectors = approvals?.filter(a => a.status === "Rejected").map(a => a.admin).join(", ");
        return `Rejected by ${rejectors}`;
      default:
        return "Awaiting review";
    }
  };
  

 
 

  const filterOrders = (orders, filters) => {
    const { orderedby, keyword, status, dateRange } = filters;
  
    
    return orders.filter((order) => {
      if (orderedby && order.orderedBy.toLowerCase() !== orderedby.toLowerCase()) {
        return false;
      }
      
      if (keyword) {
        const searchTerm = keyword.toLowerCase();
        const matchesOrderNumber = order.orderNumber?.toLowerCase().includes(searchTerm);
        const matchesOrderedBy = order.orderedBy?.toLowerCase().includes(searchTerm);
        const matchesTitle = order.Title?.toLowerCase().includes(searchTerm);
        
        if (!matchesOrderNumber && !matchesOrderedBy && !matchesTitle) {
          return false;
        }
      }
      
      if (status && order.status !== status) {
        return false;
      }
      
      if (dateRange?.start && dateRange?.end) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        if (orderDate < startDate || orderDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { 
        Authorization: `Bearer ${token}`,
        withCredentials: true,"ngrok-skip-browser-warning": "true"
      };
      // Optimistic update - immediately update both status and approvals
      setOrders(prevOrders => {
        const updatedOrders=prevOrders.map(order => 
          order._id === orderId 
            ? { 
                ...order, 
                status: newStatus,
                Approvals: (()=>{
                  const existingApprovals= Array.isArray(order.Approvals) ? order.Approvals : [];
                  const filteredApprovals=existingApprovals.filter(a=>a.admin!==user.name)

                  return  [
                    ...filteredApprovals, 
                    {
                      admin: user.name,
                      status: newStatus,
                      timestamp: new Date().toISOString()
                    }
                  ] })()
                
              } 
            : order
        )
        return updatedOrders.sort((a,b)=>{
          if (a.status === "Completed" && b.status !== "Completed") return 1;
          if (a.status !== "Completed" && b.status === "Completed") return -1;
          return 0;
        })
    });
  
  
      // First update the general status
      await updateOrderStatus(orderId, newStatus);
      
      // Then send specific approve/reject requests
      if (newStatus === "Approved") {
        await axios.put(`api/orders/${orderId}/approve`, { 
          adminName: user.name, 
          orderId 
        }, {headers});
      } else if (newStatus === "Rejected" || newStatus === "Pending") {
        await axios.put(`api/orders/${orderId}/reject`, { 
          adminName: user.name, 
          orderId 
        }, {headers});
      }
      
  
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update order status");
      
      // Revert changes if API call fails
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { 
                ...order, 
                status: order.status, // Revert status
                Approvals: Array.isArray(order.Approvals)?order.Approvals?.filter(approval => 
                  approval.admin !== user.name || approval.status !== newStatus
                ):[] // Remove the failed approval
              } 
            : order
        )
      );   } finally {
      setIsLoading(false);
      setDropdownOpen(null);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      setIsLoading(false);
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId))
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleDropdown = (orderId, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === orderId ? null : orderId);
  };

   const handleFileDownload = async (fileName, event) => {
    event.stopPropagation();
    try {
      setIsLoading(true);
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
      setError("Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (order) => {
    let bgColor, textColor, icon;
    const status = getOverallStatus(order.Approvals);
    switch (status) {
      case "Approved":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <FaCheck className="mr-1" />;
        break;
      case "Rejected":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        icon = <FaTimes className="mr-1" />;
        break;
      case "Pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <FaClock className="mr-1" />;
        break;
      case "Completed":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <FaCheck className="mr-1" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {status}
      </span>
    );
  };

  const renderOrderDetails = (order) => (
    <motion.div
      className="mt-4 space-y-3 text-sm"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-700">
            Current Status: <span className="ml-2">{getOverallStatus(order.Approvals)}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {getStatusExplanation(order.Approvals)}
          </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600"><span className="font-medium">Order Number:</span> {order.orderNumber || "N/A"}</p>
          <p className="text-gray-600"><span className="font-medium">Ordered By:</span> {order.orderedBy}</p>
          <p className="text-gray-600"><span className="font-medium">User Email:</span> {order.email}</p>
        </div>
        <div>
          <p className="text-gray-600"><span className="font-medium">Date Created:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="text-gray-600">
            <span className="font-medium">Approvals:</span>
            {console.log("order approvals",orders.map(order=>order.Approvals))} 
            {order.Approvals?.length > 0 
              ? order.Approvals.map(a => `${a.admin} (${a.status})`).join(", ")
              : "None"}
          </p>
          <p className={`${order.urgency === "VeryUrgent" ? "text-red-600" : "text-gray-600"}`}>
            <span className="font-medium">Urgency:</span> {order.urgency}
          </p>
        </div>
      </div>

      <div>
        <p className="font-medium text-gray-600">Products:</p>
        <ul className="mt-1 space-y-1">
          {order.products?.map((item, index) => (
            <li key={index} className="text-gray-600">
              • {item.name} (Qty: {item.quantity}, Price: ₦{item.price})
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-600">Files:</span>
        {order.filenames?.length > 0 ? (
          order.filenames.map((filename, index) => (
            <button
              key={index}
              onClick={(e) => handleFileDownload(filename, e)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaFilePdf className="mr-1" /> {filename}
            </button>
          ))
        ) : (
          <span className="text-gray-500 flex items-center">
            <FaFile className="mr-1" /> No files attached
          </span>
        )}
      </div>

      {order.remarks && (
        <div>
          <p className="font-medium text-gray-600">Remarks:</p>
          <p className="text-gray-600">{order.remarks}</p>
        </div>
      )}
    </motion.div>
  );

  const renderEmptyState = () => (
    <div className="p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
        <FaFile className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search filters or create a new order
      </p>
    </div>
  );

  const displayedOrders = filterOrders(orders, {
    keyword,
    status,
    dateRange,
    orderedby,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Searchbar />
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">📦</span> Request List
              {isLoading && (
                <span className="ml-3 text-sm text-gray-500">Loading...</span>
              )}
            </h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 border-l-4 border-red-500">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : displayedOrders.length === 0 ? (
            renderEmptyState()
          ) : (
            <motion.ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {displayedOrders.map((order) => (
                  <motion.li
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    id={`order-${order._id}`}
                    className={`p-4 border rounded-lg ${selectedOrderId === order._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div 
                      className="p-4 sm:p-6 cursor-pointer"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                              {order.Title || "Untitled Order"}
                            </h3>
                            {getStatusBadge(order)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            #{order.orderNumber} • {order.orderedBy}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          
                          {order.filenames?.length > 0 && (
                            <button
                              onClick={(e) => handleFileDownload(order.filenames[0], e)}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              title="Download file"
                            >
                              <FiDownload />
                            </button>
                          )}

                          {ADMIN_ROLES.includes(user?.role) && (
                            <div className="relative">
                              <button
                                onClick={(e) => toggleDropdown(order._id, e)}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Order actions"
                              >
                                <FaEllipsisV />
                              </button>

                              <AnimatePresence>
                                {dropdownOpen === order._id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute  right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                  >
                                    <div className="py-1">
                                      {["Pending", "Approved", "Rejected", "Completed"].map((statusOption) => (
                                        <button
                                          key={statusOption}
                                          className={`flex items-center w-full px-4 py-2 text-sm ${
                                            order.status === statusOption 
                                              ? "bg-blue-50 text-blue-600" 
                                              : "text-gray-700 hover:bg-gray-100"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(order._id, statusOption);
                                          }}
                                        >
                                          <span className="mr-5">
                                            {statusOption === "Approved" && <FaCheck className="text-green-500" />}
                                            {statusOption === "Rejected" && <FaTimes className="text-red-500" />}
                                            {statusOption === "Pending" && <FaClock className="text-yellow-500" />}
                                            {statusOption === "Completed" && <FaCheck className="text-blue-500" />}
                                          </span>
                                          {statusOption}
                                        </button>
                                      ))}
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(order._id);
                                        }}
                                      >
                                        <FaTrash className="mr-2" />
                                        Delete
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedOrder === order._id && renderOrderDetails(order)}
                      </AnimatePresence>
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

export default OrderList;