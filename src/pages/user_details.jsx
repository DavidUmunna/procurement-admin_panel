import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiMail, FiPhone, FiCalendar, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import requestImg from "../components/assets/quote-request.avif";
import userImg from "../components/assets/user.avif";

const UserDetails = ({ 
  user, 
  request_amount, 
  approvedOrders = [], 
  rejectedOrders = [], 
  pendingOrders = [] 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    approved: false,
    pending: false,
    rejected: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvalRate: 0,
    avgProcessingTime: 0
  });

  useEffect(() => {
    // Calculate statistics when orders change
    const total = approvedOrders.length + rejectedOrders.length + pendingOrders.length;
    const rate = total > 0 ? Math.round((approvedOrders.length / total) * 100) : 0;
    
    setStats({
      totalRequests: total,
      approvalRate: rate,
      avgProcessingTime: calculateAvgProcessingTime()
    });
  }, [approvedOrders, rejectedOrders, pendingOrders]);

  const calculateAvgProcessingTime = () => {
    if (approvedOrders.length === 0) return 0;
    
    const totalDays = approvedOrders.reduce((sum, order) => {
      if (!order.createdAt || !order.approvedAt) return sum;
      const created = new Date(order.createdAt);
      const approved = new Date(order.approvedAt);
      return sum + Math.ceil((approved - created) / (1000 * 60 * 60 * 24));
    }, 0);
    
    return Math.round(totalDays / approvedOrders.length);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.map(n => n[0]).join("").toUpperCase();
  };

  const statusConfig = {
    approved: {
      color: "bg-green-500",
      icon: "✅",
      title: "Approved Requests"
    },
    pending: {
      color: "bg-yellow-500",
      icon: "⏳",
      title: "Pending Requests"
    },
    rejected: {
      color: "bg-red-500",
      icon: "❌",
      title: "Rejected Requests"
    }
  };

  const renderOrderList = (orders, type) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: expandedSections[type] ? 1 : 0,
        height: expandedSections[type] ? "auto" : 0
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-2 bg-white rounded-lg shadow-inner p-3 max-h-60 overflow-y-auto">
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {orders.map((req, index) => (
              <motion.li 
                key={`${type}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">#{req.orderNumber}</p>
                  <p className="text-sm text-gray-600">{req.Title}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(req.createdAt)}
                </span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No {type} requests found</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden lg:col-span-1"
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 h-32"></div>
            <div className="px-6 pb-8 relative">
              <div className="flex justify-center -mt-16">
                <div className="relative">
                  {user?.imageurl ? (
                    <img 
                      src={userImg} 
                      alt={user.name || "User"} 
                      className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-100 shadow-md flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {getInitials(user?.name)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center mt-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.name || "Unknown User"}
                </h2>
                <p className="text-blue-600 font-medium">{user?.role || "No role specified"}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="text-gray-500 text-lg" />
                  <span className="text-gray-700">{user?.email || "No email provided"}</span>
                </div>
                
                {user?.phone && (
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-gray-500 text-lg" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                )}
                
                {user?.createdAt && (
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="text-gray-500 text-lg" />
                    <span className="text-gray-700">
                      Joined: {formatDate(user.createdAt.split("T")[0])}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Request Statistics and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <div className="flex justify-center">
                  <img src={requestImg} alt="Requests" className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-700">Total Requests</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalRequests}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <div className="flex justify-center">
                  <span className="h-12 w-12 flex items-center justify-center text-2xl">📊</span>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-700">Approval Rate</h3>
                <p className="text-3xl font-bold text-green-600">{stats.approvalRate}%</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <div className="flex justify-center">
                  <span className="h-12 w-12 flex items-center justify-center text-2xl">⏱️</span>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-700">Avg. Processing</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.avgProcessingTime} {stats.avgProcessingTime === 1 ? "day" : "days"}
                </p>
              </motion.div>
            </div>

            {/* Request Details */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Request Details</h2>
                
                {/* Request Amount */}
                <div className="mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 shadow-inner">
                    <h3 className="text-lg font-semibold text-blue-800 text-center">
                      Total Request Amount: {request_amount?.toLocaleString() || "0"}
                    </h3>
                  </div>
                </div>
                
                {/* Request Status Sections */}
                {Object.entries(statusConfig).map(([type, config]) => {
                  const orders = type === "approved" ? approvedOrders : 
                                 type === "pending" ? pendingOrders : rejectedOrders;
                  return (
                    <div key={type} className="mb-6 last:mb-0">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className={`w-full ${config.color} rounded-xl p-4 shadow-lg text-white flex justify-between items-center`}
                        onClick={() => toggleSection(type)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-xl">{config.icon}</span>
                          <span className="text-lg font-semibold">
                            {orders.length} {config.title}
                          </span>
                        </div>
                        {expandedSections[type] ? (
                          <FiChevronUp className="text-xl" />
                        ) : (
                          <FiChevronDown className="text-xl" />
                        )}
                      </motion.button>
                      
                      {renderOrderList(orders, type)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;