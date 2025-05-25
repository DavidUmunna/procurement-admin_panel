/* eslint-disable react-hooks/exhaustive-deps */

import React,{useState,useEffect} from "react"
import PaginationControls from "./Paginationcontrols";
import axios from "axios";


// RecentActivity Component
const RecentActivity = ({ refreshFlag, onRefreshComplete }) => {
    const [data, setData] = useState({
        activities: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        }
      });
      const [activities,setactivities]=useState([])
      const [isLoading, setIsLoading] = useState(false);
      const [categories, setCategories] = useState("");
      const [selectedCategory, setSelectedCategory] = useState('All');

    
      const fetchActivities = async (page = data.pagination?.page, limit = data.pagination?.limit) => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('authToken');
          const params= { page, limit }
          if (categories) params.category = categories;
          const API_URL = `${process.env.REACT_APP_API_URL}/api`;
          const response = await axios.get(`${API_URL}/inventory/activities`, {
            params: { params }, 
          headers: { Authorization: `Bearer ${token}`,"ngrok-skip-browser-warning":"true" }
      
          });
          setactivities(response.data.data)
          setData({
            activities: response.data.data,
            pagination: response.data.pagination
          });

         
          onRefreshComplete?.()
        } catch (error) {
          console.error('Error fetching activities:', error);
        } finally {
          setIsLoading(false);
        }
      };
      const fetchcategory=async()=>{
        try{
          const token = localStorage.getItem('authToken');
          const API_URL = `${process.env.REACT_APP_API_URL}/api`;
          const response=await axios.get(`${API_URL}/inventory/categories`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          })
      

          setCategories(response.data.data.categories||[])


        }catch(error){

        }
      }
   
   const filteredItems = activities.filter(item => {
      return selectedCategory === 'All' || item?.category === selectedCategory;
    })
    
      const handlePageChange = (newPage) => {
        fetchActivities(newPage, data.pagination?.limit);
      };
    
      const handleItemsPerPageChange = (newLimit) => {
        fetchActivities(1, newLimit); // Reset to page 1 when changing limit
      };
    
      useEffect(() => {
        fetchActivities();
        fetchcategory()
      }, [refreshFlag]);
    console.log("categories",categories)
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">ActivityLog</h2>
      <div className="space-y-4">
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Filter by Category:</label>
         <select
          name="category"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {(Array.isArray(categories) && categories.length > 0) ? (
            categories.map((category) => (
              <option key={category?._id || category?.name} value={category?.name || ""}>
                {category?.name || "Unnamed Category"}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>

        </div>
        {filteredItems.length > 0 ? (
          filteredItems.map((activity, index) => (
            <div key={index} className="border-b pb-2 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{activity.action} {activity?.itemName} </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  <div className="flex  ">
                      <p className="text-sm text-gray-500 mr-4">
                        Modified by:{activity?.userName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.category}
                      </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.action === 'Added' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {activity.quantity} {activity.unit || 'units'}
                </span>
              </div>
              {activity.user && (
                <p className="text-xs text-gray-400 mt-1">
                  By {activity.user}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
      <div>
      {/* Your data display */}
      <PaginationControls
        currentPage={data.pagination?.page}
        totalPages={data.pagination?.totalPages}
        itemsPerPage={data.pagination?.limit}
        totalItems={data.pagination?.total}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        isLoading={isLoading}
      />
    </div>
    </div>
  );
};


export default RecentActivity