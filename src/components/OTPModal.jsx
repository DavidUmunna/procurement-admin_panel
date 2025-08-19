// components/OTPModal.jsx
import { useState } from "react";

export default function OTPModal({ onClose, onSubmit, statusOption,orderId}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP code");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await onSubmit(orderId,statusOption,otp);
     
      onClose();
    } catch (err) {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  onClick={onClose} // closes modal when clicking the background
>
  <div
    className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6"
    onClick={(e) => e.stopPropagation()} // stops clicks inside from closing modal
  >
    <h2 className="text-xl font-bold text-gray-800 mb-4">Enter 6 digit Passcode</h2>
    <p className="text-gray-500 text-sm mb-4">
      A Passcode tht lasts for 5 minutes has been sent to your registered email.  
      Please enter it below to confirm approval. You will be able to use it in for subsequent approvals
    </p>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        maxLength="6"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit OTP"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </form>
  </div>
</div>

  );
}
