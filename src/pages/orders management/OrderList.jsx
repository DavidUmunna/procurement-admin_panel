import * as Sentry from "@sentry/react"
import React, {  useState,useEffect } from "react";
import {

  updateOrderStatus,
  deleteOrder,
  downloadFile,
  
} from "../../services/OrderService";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePdf, FaFile, FaTrash, FaEllipsisV, FaCheck, FaTimes, FaClock, FaComment } from "react-icons/fa";
import { FiDownload,  } from "react-icons/fi";
import { useUser } from "../../components/usercontext";
import Searchbar from "./searchbar";
import axios from "axios";
import { useSelector } from "react-redux";






const OrderList = ({orders,setOrders, selectedOrderId ,error, setError }) => {
  const { keyword, status, dateRange, orderedby } = useSelector(
    (state) => state.search
  );
  const { user } = useUser();
  //const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState(null);
  const [commentsByOrder, setCommentsByOrder] = useState({});
  const [openCommentOrderId, setOpenCommentOrderId] = useState(null);
  const [isVisible, setIsVisible]=useState(false)
  const [toast, setToast] = useState({ show: false, message: '' });



  const getOverallStatus = (approvals, department) => {
    if (!approvals || approvals.length === 0) return "Pending";
    if (approvals.some(a => a.status === "Rejected")) return "Rejected";
    if (approvals.some(a => a.status === "Completed")) return "Completed";
  
    const approvalCount = approvals.filter(a => a.status === "Approved").length;
    
   let REQUIRED_APPROVALS;

    switch (department) {
      case "waste_management_dep":
        REQUIRED_APPROVALS = 5;
        break;
      case "Environmental_lab_dep":
        REQUIRED_APPROVALS = 4;
        break;
      default:
        REQUIRED_APPROVALS = 3;
    }

  
    if (approvalCount >= REQUIRED_APPROVALS) return "Approved";
    if (approvalCount > 0) return "Partially Approved";
  
    return "Pending";
  };
  
  const getStatusExplanation = (approvals,Department) => {
    const status = getOverallStatus(approvals,Department);
    const approvalsCount = Array.isArray(approvals)?approvals?.filter(a => a.status === "Approved").length : 0;


    let REQUIRED_APPROVALS;

    switch(Department){
      case "waste_management_dep":
        REQUIRED_APPROVALS=5;
        break
      case  "Environmental_lab_dep":
        REQUIRED_APPROVALS=4;
        break;
      default:
        REQUIRED_APPROVALS=3;

        
    }
    
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

  useEffect(()=>{
    let Timer;
    if (error){
      setIsVisible(true)
      Timer=setTimeout(()=>{
        setIsVisible(false)
      },3000)
    }
   
    return ()=>clearTimeout(Timer)


  },[error])

 

 useEffect(() => {
  if (selectedOrderId) {
    setCommentsByOrder(prev => ({
      ...prev,
      [selectedOrderId]: "" // Clear comment for this specific order
    }));
  }
  
}, [selectedOrderId]);

  const handleCommentChange = (orderId) => (e) => {
    setCommentsByOrder(prev => ({
    ...prev,
    [orderId]: e.target.value
  }));
  };

 const handleCommentSubmit = (orderId) => (e) => {
    e.preventDefault();
  
    setOpenCommentOrderId(null);
    setToast({ show: true, message: 'Comment saved successfully!' });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);

  };
 
  
  const handleStatusChange = async (orderId, newStatus) => {
  try {
    setIsLoading(true);
    const API_URL = `${process.env.REACT_APP_API_URL}/api`
    const token = localStorage.getItem("authToken");
    const headers = { 
      Authorization: `Bearer ${token}`,
      withCredentials: true,"ngrok-skip-browser-warning": "true"
    };
    
    // Get the comment for this specific order
    const orderComment = commentsByOrder[orderId] || '';
    
    // Optimistic update
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              Approvals: (() => {
                const existingApprovals = Array.isArray(order.Approvals) ? order.Approvals : [];
                const filteredApprovals = existingApprovals.filter(a => a.admin !== user.name);

                return [
                  ...filteredApprovals, 
                  {
                    admin: user.name,
                    status: newStatus,
                    comment: orderComment, // Use the specific order comment
                    timestamp: new Date().toISOString()
                  }
                ]
              })()
            } 
          : order
      )
      return updatedOrders.sort((a,b) => {
        if (a.status === "Completed" && b.status !== "Completed") return 1;
        if (a.status !== "Completed" && b.status === "Completed") return -1;
        return 0;
      })
    });

    // First update the general status
    await updateOrderStatus(orderId, newStatus);
    
    // Then send specific approve/reject requests
    if (newStatus === "Approved") {
      await axios.put(`${API_URL}/orders/${orderId}/approve`, { 
        adminName: user.name, 
        comment: orderComment, // Use the specific order comment
        orderId 
      }, {headers});
    } else if (newStatus === "Rejected" || newStatus === "Pending") {
      await axios.put(`${API_URL}/orders/${orderId}/reject`, { 
        adminName: user.name,
        comment: orderComment, // Use the specific order comment
        orderId 
      }, {headers});
    } else if (newStatus === "Completed") {
      await axios.put(`${API_URL}/orders/${orderId}/completed`,
        orderId, {headers} 
      )
    }
    
  } catch (error) {
    
    Sentry.captureMessage("Error updating status")
    Sentry.captureException(error)

    setError("Failed to update order status");
    const orderComment = commentsByOrder[orderId] || '';
    // Revert changes if API call fails
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: order.status,
              Approvals: Array.isArray(order.Approvals) ? order.Approvals?.filter(approval => 
                approval.admin !== user.name || approval.status !== newStatus || approval.comment !== orderComment
              ) : []
            } 
          : order
      )
    );
  } finally {
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
      Sentry.captureMessage("Error updating status")
      Sentry.captureException(error)
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
 
   const handleFileDownload = async (fileId,filename, event) => {
    event.stopPropagation();
    try {
      setIsLoading(true);
      const fileData = await downloadFile(fileId,filename);
      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Sentry.captureMessage("Error updating status")
      Sentry.captureException(error)
      setError("Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (order) => {
    let bgColor, textColor, icon;
    const status = order.status==="Completed"?order.status:getOverallStatus(order.Approvals);
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
            Current Status: <span className="ml-2">{order.status==="Completed"?order.status:getOverallStatus(order.Approvals)}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {getStatusExplanation(order.Approvals,order?.staff?.Department)}
          </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600"><span className="font-medium">Request Number:</span> {order.orderNumber || "N/A"}</p>
          <p className="text-gray-600"><span className="font-medium">Requested By:</span> {order.staff?.name}</p>
          <p className="text-gray-600"><span className="font-medium">Employee Email:</span> {order.staff?.email}</p>
          <p className="text-gray-600"><span className="font-medium">Employee Department:</span> {order.staff?.Department}</p>
        </div>
       <div>
  <p className="text-gray-600">
    <span className="font-medium">Date Created:</span> {new Date(order.createdAt).toLocaleDateString()}
  </p>

  {(
    <div className="text-gray-600 mt-2">
      <p className="font-medium">Approvals:</p>

      {order.Approvals?.length > 0 ? (
        <ul className="mt-1 space-y-2 max-h-40 overflow-y-auto list-none ">
          {order.Approvals.map((a, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
              <p><span className="font-semibold">Admin:</span> {a.admin}</p>
              <p><span className="font-semibold">Status:</span> {a.status}</p>
              {a.comment && (
                <p><span className="font-semibold">Comment:</span> {a.comment}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No approvals yet.</p>
      )}
    </div>
  )}

  <p className={`${order.urgency === "VeryUrgent" ? "text-red-600" : "text-gray-600"} mt-2`}>
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
              onClick={(e) => handleFileDownload(order.fileRefs,filename, e)}
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
      <h3 className="mt-2 text-sm font-medium text-gray-900">No Requests found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search filters or create a new Request
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
      
      <div className="max-w-7xl mx-auto ">
        <motion.div 
          className=" mb-6  "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
            <div className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap gap-3">

          <Searchbar />
        
          </div>


        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border z-20 border-gray-200 overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          

          

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : displayedOrders.length === 0 ? (
            renderEmptyState()
          ) : (
            <motion.ul className="divide-y divide-gray-200 max-h-screen overflow-y-auto ">
              <AnimatePresence>
                {displayedOrders.map((order) => (
                  <motion.li
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    id={`order-${order._id}`}
                    className={`p-4 border rounded-lg z-20 ${selectedOrderId === order._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
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

                          {user.canApprove && (
                            <div className="relative ">
                              <button
                                onClick={(e) => toggleDropdown(order._id, e)}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors inset-0"
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
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                  >
                                    <div className="py-1">
                                      {["Pending", "Approved", "Rejected", "Completed"]
                                        .filter(
                                          (statusOption) =>
                                            statusOption !== "Completed" || user?.Department === "accounts_dep"
                                        )
                                        .map((statusOption) => (
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
                                              {statusOption === "Approved" && (
                                                <FaCheck className="text-green-500" />
                                              )}
                                              {statusOption === "Rejected" && (
                                                <FaTimes className="text-red-500" />
                                              )}
                                              {statusOption === "Pending" && (
                                                <FaClock className="text-yellow-500" />
                                              )}
                                              {statusOption === "Completed" && user?.Department === "accounts_dep" && (
                                                <FaCheck className="text-blue-500" />
                                              )}

                                            </span>
                                            {statusOption}
                                          </button>
                                        ))}
                                      {user.role==="global_admin"&&(<button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(order._id);
                                        }}
                                      >
                                        <FaTrash className="mr-2" />
                                        Delete
                                      </button>)}
                                       <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => setOpenCommentOrderId(prev => prev === order._id ? null : order._id)}
                                       >
                                        <FaComment className="mr-2" />
                                        <span>{openCommentOrderId === order._id ? 'Hide' : 'Add'} Comment</span>
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {openCommentOrderId===order._id && (
                            <div key={order._id}
                            id={`order-${order._id}`}

                              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                 <div 
                                   className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                                   onClick={e => e.stopPropagation()}  // prevent backdrop click
                                 >
                                <form onSubmit={handleCommentSubmit(order._id)} className="space-y-4" >
                                  <div>
                                    <label 
                                      htmlFor={`comment-${order._id}` }
                                      className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                      Make your comment here
                                    </label>
                                    <input
                                      
                                      type="text"
                                      name="comment"
                                      value={commentsByOrder[order._id] || ""}
                                      onChange={handleCommentChange(order._id)}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="Type your comment…"
                                      />
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                      >
                                      Submit Comment
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>  setOpenCommentOrderId(prev => prev === order._id ? null : order._id)}
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                      >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                                </div>
                            </div>
                                )
                              }

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
        {isVisible && (
            <div className="p-4 flex  justify-center items-center  text-red-600 border-l-4 border-red-500 bg-red-200">
              {error}
            </div>
          )}
          {toast.show && (
            <div className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg">
              {toast.message}
            </div>
          )}

      </div>
    </div>
  );
};

export default OrderList;