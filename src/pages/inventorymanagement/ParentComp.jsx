// ParentComponent.jsx
import { useState } from 'react';
import InventoryManagement from './Inventorymanagement';
import RecentActivity from './recentactivity';

const ParentComponent = () => {
  const [refreshActivities, setRefreshActivities] = useState(false);
  const [loading,setloading]=useState(false)

    if (loading){
      return <div className='flex justify-center  items-center h-screen'>
              <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-transparent'>
                 
              </div>
           </div>;
    }

  return (
    <div className="container mx-auto p-4 mt-20 ">
      <div className="flex flex-col lg:flex-row gap-6">
        

          <InventoryManagement 
            onInventoryChange={() => setRefreshActivities(prev => !prev)} 
            setloading={setloading}
            loading={loading}
            />
        
          <RecentActivity 
            refreshFlag={refreshActivities}
            onRefreshComplete={() => setRefreshActivities(false)}
            className="lg:w-1/3 "
          />
      </div>
    </div>
  );
};

export default ParentComponent