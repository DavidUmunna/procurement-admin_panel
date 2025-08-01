import { RequestItem } from './RequestItem';

export const RequestList = ({ requests, selectedRequests, onToggleRequest, totalAmount }) => (
  <div className="border rounded-lg overflow-hidden mb-6">
    <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
      <h3 className="font-medium">Included Requests</h3>
      <span className="text-sm font-medium">
        Total: ₦{totalAmount}
      </span>
    </div>
    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
      {requests.map((request) => (
        <RequestItem
          key={request._id}
          request={request}
          isSelected={selectedRequests.includes(request._id)}
          onToggle={() => onToggleRequest(request._id)}
        />
      ))}
    </ul>
  </div>
);