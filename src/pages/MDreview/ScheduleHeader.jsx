export const ScheduleHeader = ({ schedule, onClose }) => (
  <div className="flex justify-between items-center p-6 border-b">
    <h2 className="text-2xl font-bold text-gray-800">
      Review Schedule: {schedule?.name || `PO-${schedule?._id.slice(-4) || ''}`}
    </h2>
    <button 
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700"
      aria-label="Close modal"
    >
      ✕
    </button>
  </div>
);