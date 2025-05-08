// ParentComponent.jsx
import { useState } from 'react';
import InventoryManagement from './Inventorymanagement';
import RecentActivity from './recentactivity';

const ParentComponent = () => {
  const [refreshActivities, setRefreshActivities] = useState(false);

  return (
    <div className="container mx-auto p-4 mt-20 ">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">

          <InventoryManagement 
            onInventoryChange={() => setRefreshActivities(prev => !prev)} 
            
            />
        </div>
          <RecentActivity 
            refreshFlag={refreshActivities}
            onRefreshComplete={() => setRefreshActivities(false)}
            className="lg:w-1/3"
          />
      </div>
    </div>
  );
};

export default ParentComponent