import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../services/OrderService";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setOrders(data || []);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrders(); // Refresh list
    setDropdownOpen(null); // Close the dropdown after status change
  };

  const handleDelete = async (orderId) => {
    await deleteOrder(orderId);
    fetchOrders();
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleDropdown = (orderId) => {
    setDropdownOpen(dropdownOpen === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📦 Order List</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li
                key={order.orderNumber}
                className="p-6 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="font-serif text-lg text-gray-700 mb-2">
                      Ordered By: {order.orderedBy}
                    </div>
                    <button
                      className="text-blue-500 hover:underline flex items-center"
                      onClick={() => toggleOrderDetails(order.orderNumber)}
                    >
                      {expandedOrder === order.orderNumber ? (
                        <>
                          <ChevronUpIcon className="h-5 w-5" />
                          
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="h-5 w-5" />
                          
                        </>
                      )}
                    </button>
                    {expandedOrder === order.orderNumber && (
                      <div className="mt-2 space-y-4">
                        {order.products.map((product) => (
                          <div key={product._id} className="flex flex-col md:flex-row text-sm text-gray-500 space-y-2 md:space-y-0 md:space-x-6">
                            <p className="font-medium text-gray-700">Product: {product.Name}</p>
                            <p>Quantity: {product.quantity}</p>
                            <p>Price: {product.price}</p>
                          </div>
                        ))}
                        <p className="text-sm text-gray-500 mt-4">
                          Status:{" "}
                          <span
                            className={`px-3 py-1 rounded-full text-white ${
                              order.status === "Pending"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <button
                        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        onClick={() => toggleDropdown(order._id)}
                      >
                        {order.status === "Pending" ? "Pending" : "Complete"}
                      </button>
                      {dropdownOpen === order._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                        </div>
                      )}
                    </div>
                    <button
                      className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      onClick={() => handleDelete(order._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderList;