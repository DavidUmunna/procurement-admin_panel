import { useState } from "react";
import { motion } from "framer-motion";
import { updateUserpassword, getuserbymail } from "../services/userService";
import {useNavigate} from "react-router-dom"


export default function ForgotPassword() {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const email_verification = await getuserbymail(email);
      if (email_verification) {
        console.log("Email verified");
        setStep(2);
      } else {
        setError("Email not found. Please check again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    console.log(email)
    if (newPassword !== confirmPassword) {
      
      setError("Passwords do not match.");
      return;
    }


    setLoading(true);
    try {
      
      const response = await updateUserpassword(email, newPassword);
      if (response) {
        console.log("User password updated successfully");
        setStep(3);
      } else {
        setError("User password update failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      navigate("/adminlogin")
      setLoading(false);
    }
  };
  const handleloginredirect=(e)=>{
    navigate("/adminlogin")
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        {step === 1 && (
          <motion.div exit={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <p className="text-gray-600 mb-4">Enter your email to receive a reset link.</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex ">

                
                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="mt-4 w-full mx-2 bg-blue-500 text-white py-2  rounded disabled:bg-gray-400"
                >
                  {loading ? "Processing..." : "Send Reset Link"}
                </button>
                <button
                onClick={handleloginredirect}
                disabled={loading}
                className="mt-4 w-full mx-4 bg-blue-500 text-white py-2 rounded disabled:bg-gray-400"
                >
                  LoginPage

                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div exit={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div exit={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4">Success!</h2>
            <p className="text-green-600">Your password has been reset successfully.</p>

          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
