import { useUser } from './usercontext';
import { useState, useEffect } from 'react';
import OrderList from './OrderList';
import Duplicates from '../pages/Duplicates';
import { getOrders,get_user_orders } from '../services/OrderService';
import CompletedOrdersList from './Completed';
const ADMIN_ROLES = ["admin", "procurement_officer", "human_resources", "internal_auditor", "global_admin"];
const OrdersDashboard = ({setAuth}) => {
  const {user}=useUser()
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsperpage=7
  const [currentpage,setcurrentpage]=useState(1)

  const startIndex=(currentpage-1)*itemsperpage
  const endIndex=startIndex+itemsperpage
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
          setOrders(data.reverse());
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        if (err.response?.status===401|| err.response?.status===403){
          setError("Session expired. Please log in again.");
          localStorage.removeItem('authToken');
          setAuth(false)
          window.location.href = '/adminlogin'; 
        }else{

          console.error(err);
          setError("Failed to load orders. Please try again later.");
        }
  
        // Redirect to login page
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.email) {
      fetchData();
    }
  }, [user?.email, user?.role,setAuth]);

  const paginated_orders=orders.slice(startIndex,endIndex)
  const totalPages = Math.ceil(orders.length / itemsperpage);
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    // Optional: Scroll to the selected order
    const element = document.getElementById(`order-${orderId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (isLoading) {
    return <div className='flex justify-center  items-center h-screen'>
              <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-transparent'>
                 
              </div>
           </div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 mt-10">
      {/* Main Order List (takes 2/3 width on large screens) */}
      <div className="lg:w-2/3">
        
        <OrderList 
          orders={paginated_orders} 
          selectedOrderId={selectedOrderId}
          setOrders={setOrders}
        />
        <div className="flex items-center justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded text-white transition ${
                  currentpage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={currentpage === 1}
                onClick={() => setcurrentpage(prev => prev - 1)}
              >
                ◀ Previous
              </button>
      
              <span className="text-lg font-medium">
                Page {currentpage} of {totalPages}
              </span>
      
              <button
                className={`px-4 py-2 rounded text-white transition ${
                  currentpage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={currentpage === totalPages}
                onClick={() => setcurrentpage(prev => prev + 1)}
              >
                Next ▶
              </button>
        </div>
      </div>
      
      {/* Duplicates Panel (takes 1/3 width on large screens) */}
      <div className='"lg:w-1/3 mb-8"'> 
          <div >
            <Duplicates 
              orders={orders} 
              onOrderSelect={handleOrderSelect}
            />
          </div>
          <div className='mt-4 overflow-x-auto'>
            <CompletedOrdersList
            orders={orders}
            itemsPerPage={itemsperpage}/>
          </div>
      </div>
      {error}
    </div>
  );
};

export default OrdersDashboard;