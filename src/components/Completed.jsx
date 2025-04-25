import React, { useState } from 'react';

const CompletedOrdersList = ({ orders, itemsPerPage = 5 }) => {
  const completedOrders = orders
    .filter(order => order.status === 'Completed')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const totalPages = Math.ceil(completedOrders.length / itemsPerPage);
  const currentOrders = completedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto px-0 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Completed Orders <span className="text-blue-600">({completedOrders.length})</span>
      </h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">productdetails</th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      expandedOrderId === order._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleExpand(order._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <table className="w-full">
                        <tbody>
                          {order.products.map((product, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">{product.name}</td>
                              <td className="px-4 py-2">{product.quantity}</td>
                              <td className="px-4 py-2">{product.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                          expandedOrderId === order._id 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(order._id);
                        }}
                      >
                        {expandedOrderId === order._id ? (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Collapse
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Expand
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order._id && (
                    <tr className="bg-blue-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div 
                          className="overflow-hidden transition-all duration-300 ease-in-out"
                          style={{
                            maxHeight: expandedOrderId === order._id ? '500px' : '0',
                            opacity: expandedOrderId === order._id ? '1' : '0'
                          }}
                        >
                          <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-2">Order Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">name:</p>
                                <p className="font-medium">{order.orderedBy}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Order Date:</p>
                                <p className="font-medium">
                                  {new Date(order.createdAt).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Status:</p>
                                <p className="font-medium text-green-600">Completed</p>
                              </div>
                              <div>
                                <p className="text-gray-500">product details:</p>
                                <p className="font-medium"> {order.products.map((product, index) => (
                                   <tr key={index} className="border-b">
                                   <td className="px-4 py-2">{product.name}</td>
                                   <td className="px-4 py-2">{product.quantity}</td>
                                   <td className="px-4 py-2">{product.price}</td>
                            </tr>
                          ))}</p>
                              </div>
                            </div>
                            {order.remarks && (
                              <div className="mt-4">
                                <p className="text-gray-500">Remarks:</p>
                                <p className="font-medium text-gray-700 italic">"{order.remarks}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrdersList;