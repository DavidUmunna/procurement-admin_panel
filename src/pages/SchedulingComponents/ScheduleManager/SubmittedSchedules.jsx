import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import {useState} from "react"
import * as Sentry from "@sentry/react"
import { FiTrash } from 'react-icons/fi';
import axios from 'axios';
import PaginationControls from '../../../components/Paginationcontrols';
import ScheduleSearchBar from './ScheduleSearchBar';
const statusColors = {
  "Submitted to MD": "bg-yellow-100 text-yellow-800",
  "Reviewed by MD": "bg-blue-100 text-blue-800",
  "Approved For Funding": "bg-green-100 text-green-800",
  "Funded": "bg-purple-100 text-purple-800"
};

const SubmittedSchedules = ({ refreshKey }) => {
  const API = process.env.REACT_APP_API_URL;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filteredSchedules, setFilteredSchedules]=useState([])
  
  const { data, isLoading } = useQuery(
    ['submittedSchedules', refreshKey, page, limit],
    () => axios.get(`${API}/api/scheduling/disbursement-schedules`, {
      params: {
        status: '!Draft',
        page,
        limit,
        
      }
    }).then(res => ({
    
      schedules: res.data.schedules,
      pagination: res.data.Pagination
    })),
    {
      staleTime: 3* 60 * 1000,
      keepPreviousData: true,
      onSuccess: (data) => setFilteredSchedules(data.schedules)
    }
  );
  const handleDelete=async(scheduleId)=>{
    try{
      const response=await axios.delete(`${API}/api/scheduling/disbursement-schedules/${scheduleId}`,{withCredentials:true})
      console.log(response)
      setFilteredSchedules((prevSchedules) =>
      prevSchedules.filter((schedule) => schedule._id !== scheduleId)
      );
      toast.success("deleted successfully")
    }catch(error){
      Sentry.captureException(error)
      toast.error(error.message)
    }
  }
  
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing items per page
  };

  // Client-side filtering fallback (optional)
 

  return (
    <div className="space-y-4">
      <ScheduleSearchBar 
        schedules={data?.schedules}
        onSearch={setFilteredSchedules}
      />
      
      {isLoading && !data?.schedules ? (
        <div className="text-center py-4">Loading schedules...</div>
      ) : (
        <div className="space-y-4">
          {filteredSchedules?.map(schedule => (
            <div key={schedule._id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">
                  {schedule.name || 'Untitled Schedule'} - {new Date(schedule.createdAt).toLocaleDateString()}
                </h3>
                <div className='flex mx-3  align-middle'>

                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[schedule.status]}`}>
                  {schedule.status}
                </span>
                <button 
                className='ml-2'
                onClick={()=>handleDelete(schedule._id)}>
                    <FiTrash/>
                </button>
                </div>
              </div>
              <div className="p-4 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">₦{schedule.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Number</p>
                  <p className="font-medium">{schedule.requests.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requests (To Be Posted)</p>
                  <ul className="font-medium list-disc list-inside">
                    {schedule.requests
                      .filter(request => request.included === true)
                      .map((request, index) => (
                        <li key={index}>{request.requestId.Title}</li>
                      ))}
                  </ul>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Requests(Removed)</p>
                  <ul className="font-medium list-disc list-inside">
                    {schedule.requests
                      .filter(request => request.included === false)
                      .map((request, index) => (
                        <li key={index}>{request.requestId.Title}</li>
                      ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-gray-500">MD Review Date</p>
                  <p className="font-medium">
                    {schedule.reviewedByMDAt ? new Date(schedule.reviewedByMDAt).toLocaleDateString() : 'Pending'}
                  </p>
                </div>
              </div>
              {schedule.mdComments && (
                <div className="bg-blue-50 p-4 border-t">
                  <p className="text-sm font-medium text-gray-700">MD Comments:</p>
                  <p className="text-sm text-gray-600 mt-1 break-words ">{schedule.mdComments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {data?.pagination && filteredSchedules.length > 0 && (
        <PaginationControls
          currentPage={page}
          totalPages={data.pagination.totalPages}
          itemsPerPage={limit}
          totalItems={data.pagination.total}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default SubmittedSchedules;