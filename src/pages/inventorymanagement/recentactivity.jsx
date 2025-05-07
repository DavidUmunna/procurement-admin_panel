import React from "react"

// RecentActivity Component
const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="border-b pb-2 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{activity.action} {activity.itemName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
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
    </div>
  );
};


export default RecentActivity