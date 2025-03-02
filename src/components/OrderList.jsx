import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../services/OrderService";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  //const [error, setError] = useState(null);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        const data = await getOrders();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders|| []);
        } else {
          throw new Error("Invalid data format");
        }
    }catch (err){ console.error(err)

    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrders(); // Refresh list
  };

  const handleDelete = async (orderId) => {
    await deleteOrder(orderId);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="p-4 border border-gray-300 rounded-lg flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.supplier}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded-lg text-white ${
                        order.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleStatusChange(order._id, "Completed")}
                  >
                    Complete
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
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
