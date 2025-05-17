/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from './usercontext';
import { useState, useEffect } from 'react';
import OrderList from './OrderList';
import Duplicates from '../pages/Duplicates';
import { get_user_orders } from '../services/OrderService';
import CompletedOrdersList from './Completed';
import { admin_roles } from './navBar';
import axios from 'axios';
import PaginationControls from "../pages/inventorymanagement/Paginationcontrols";

const OrdersDashboard = ({setAuth}) => {
  const {user}=useUser()
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [filteredorders,setfilteredorders]=useState([])

  const [Data, setData] = useState({
    orders: [],
    pagination: {
      page: 1,
      limit: 5,
      total: 0
    }
  });
  const general_access= ["procurement_officer", "human_resources", "internal_auditor", "global_admin","admin",
    "Financial_manager"];
  const departmental_access=["waste_management","Environmental_lab_manager","PVT_manager"]
  const only_approvals=["accounts"]
  const fetchData = async (page=Data.pagination?.page,limit=Data.pagination?.limit) => {
    setIsLoading(true);
    try {
        
        let response;
        const token=localStorage.getItem("authToken")
        const API_URL = `${process.env.REACT_APP_API_URL}/api`;
        if (general_access.includes(user?.role)) {
          const res = await axios.get(`${API_URL}/orders`,{
            params: { page, limit },
          headers:{Authorization:`Bearer ${token}`, 
            "ngrok-skip-browser-warning": "true"},
            withCredential:true});
            response=res.data.data||[]
          
        
          setData({
            orders: response,
            pagination: res.data.Pagination
          })

        }else if(departmental_access.includes(user?.role)) {
          
            if (!user?.Department) return;
            const token=localStorage.getItem("authToken")
            const API_URL = `${process.env.REACT_APP_API_URL}/api`;
            const department_response = await axios.get(`${API_URL}/orders/department`, {
              params: {
                Department: user.Department,
                page,
                limit,
              },headers:{Authorization:`Bearer ${token}`, 
                "ngrok-skip-browser-warning": "true"},
              withCredentials: true, // If you're using cookies/session
            });
    
          
            response=department_response.data.data||[]
            console.log("response",response)
            setData({
              orders:response,
              pagination:department_response.data.Pagination
            })
         

        }else if(only_approvals.includes(user?.role)){
            const token=localStorage.getItem("authToken")
            const API_URL = `${process.env.REACT_APP_API_URL}/api`;
            const accounts_response = await axios.get(`${API_URL}/orders/accounts`, {
              params: {
                
                page,
                limit,
              },headers:{Authorization:`Bearer ${token}`, 
                "ngrok-skip-browser-warning": "true"},
              withCredentials: true, // If you're using cookies/session
            });
    
          
            response=accounts_response.data.data||[]
            
            setData({
              orders:response,
              pagination:accounts_response.data.Pagination
            })
         


        }
        else {
          const res = await get_user_orders(user?.userId);
          response = res.orders||[];
        }
        console.log(response)
        if (Array.isArray(response)) {
          setOrders(response);
          
          
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        if (err.response?.status===401|| err.response?.status===403){
          setError("Session expired. Please log in again.");
          localStorage.removeItem('authToken');
          
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
    
  useEffect(() => {
   
    if (user) {
      fetchData();
      
    }
  }, [user?.role,setAuth]);

  //const paginated_orders=orders.slice(startIndex,endIndex)
  //const totalPages = Math.ceil(orders.length / itemsperpage);
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    // Optional: Scroll to the selected order
    const element = document.getElementById(`order-${orderId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  console.log(user)
  
  
  const handlePageChange = (newPage) => {
    fetchData(newPage, Data.pagination?.limit);
  };

  const handleItemsPerPageChange = (newLimit) => {
    fetchData(1, newLimit); // Reset to page 1 when changing limit
  };
  console.log(Data.pagination)

  if (isLoading) {
    return <div className='flex justify-center  items-center h-screen'>
              <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-transparent'>
                 
              </div>
           </div>;
  }

  return (
  <div className="flex flex-col lg:flex-row gap-6 p-4 mt-10 h-[calc(100vh-5rem)]">
  {/* Left: Order List (2/3 width on large screens) */}
  <div className="w-full lg:w-2/3 overflow-y-auto">
    <OrderList 
      orders={orders} 
      selectedOrderId={selectedOrderId}
      setOrders={setOrders}
    />
    <div>
      <PaginationControls
        currentPage={Data.pagination?.page}
        totalPages={Data.pagination?.totalPages}
        itemsPerPage={Data.pagination?.limit}
        totalItems={Data.pagination?.total}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        isLoading={isLoading}
      />
    </div>
  </div>

  {/* Right: Responsive column for optional components */}
  {(admin_roles.includes(user?.role) || user?.role === "accounts") && (
    <div className="w-full lg:w-1/3 flex flex-col justify-center ">
      {Duplicates && (
        <div className={`${CompletedOrdersList ? 'flex-1' : 'flex justify-center items-center h-full'}`}>
          <Duplicates 
            orders={orders} 
            onOrderSelect={handleOrderSelect}
          />
        </div>
      )}
      {CompletedOrdersList && (
        <div className={`${Duplicates ? 'flex-1' : 'flex justify-center items-center h-full'} overflow-y-auto`}>
          <CompletedOrdersList orders={orders} />
        </div>
      )}
    </div>
  )}
</div>
  )

};

export default OrdersDashboard;