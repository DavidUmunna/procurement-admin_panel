import { useUser } from './usercontext';
import { useState, useEffect } from 'react';
import OrderList from './OrderList';
import Duplicates from '../pages/Duplicates';
import { getOrders,get_user_orders } from '../services/OrderService';
const ADMIN_ROLES = ["admin", "procurement_officer", "human_resources", "internal_auditor", "global_admin"];
const OrdersDashboard = () => {
  const {user}=useUser()
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data;
        if (ADMIN_ROLES.includes(user?.role)) {
          data = await getOrders();
        } else {
          const response = await get_user_orders(user?.email);
          data = response.orders;
        }

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user?.email, user?.role]);

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    // Optional: Scroll to the selected order
    const element = document.getElementById(`order-${orderId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Main Order List (takes 2/3 width on large screens) */}
      <div className="lg:w-2/3">
        <OrderList 
          orders={orders} 
          selectedOrderId={selectedOrderId}
        />
      </div>
      
      {/* Duplicates Panel (takes 1/3 width on large screens) */}
      <div className="lg:w-1/3">
        <Duplicates 
          orders={orders} 
          onOrderSelect={handleOrderSelect}
        />
      </div>
    </div>
  );
};

export default OrdersDashboard;