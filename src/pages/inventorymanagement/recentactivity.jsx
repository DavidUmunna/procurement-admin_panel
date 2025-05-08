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
    
      const fetchActivities = async (page = data.pagination?.page, limit = data.pagination?.limit) => {
        setIsLoading(true);
        try {
            const API_URL = `${process.env.REACT_APP_API_URL}/api`;
          const response = await axios.get(`${API_URL}/inventory/activities`, {
            params: { page, limit }
          });
          setactivities(response.data.data)
          setData({
            activities: response.data.data,
            pagination: response.data.pagination
          });

          console.log(response.data.pagination)
          onRefreshComplete?.()
        } catch (error) {
          console.error('Error fetching activities:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      const handlePageChange = (newPage) => {
        fetchActivities(newPage, data.pagination?.limit);
      };
    
      const handleItemsPerPageChange = (newLimit) => {
        fetchActivities(1, newLimit); // Reset to page 1 when changing limit
      };
    
      useEffect(() => {
        fetchActivities();
      }, [refreshFlag]);
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">ActivityLog</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="border-b pb-2 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{activity.action} {activity.itemName} </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  <div className="flex">
                      
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