import React, { useState } from "react";
import { createOrder } from "../services/OrderService";
//import Navbar from "./navBar";
import { motion, AnimatePresence } from "framer-motion";
import {useUser} from "./usercontext"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const inputVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { yoyo: Infinity } },
};

const CreateOrder = () => {
  const { user } = useUser();
  const [supplier, setSupplier] = useState("Halden");
  const [products, setProducts] = useState([{ Name: "", quantity: 1, price: `₦${0}` }]);
  const [orderedBy, setOrderedBy] = useState("");
  const [urgency, setUrgency] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [email, setemail]=useState("")
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setemail(user.email)
    const orderData = await createOrder({ supplier, orderedBy,email, urgency, file, remarks });

    console.log("Submitting order data:", orderData);

    setOrderedBy("");
    setSupplier("Company");
    setProducts([{ Name: "", quantity: 1, price: `₦${0}` }]);
    setUrgency("");
    setFile(null);
    setRemarks("");
    alert("Order Created!");
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { Name: "", quantity: 1, price: `₦${0}` }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div>
      <motion.div
        className="min-h-screen bg-gray-100 flex justify-center items-center p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Purchase Request</h2>
          <motion.form onSubmit={handleSubmit} className="space-y-4">
            <motion.div className="mb-4" variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-gray-700 font-bold mb-2">Supplier:</label>
              <input
                type="text"
                placeholder="Optional"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
            <motion.div className="mb-4" variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-gray-700 font-bold mb-2">Ordered By:</label>
              <input
                type="text"
                value={orderedBy}
                onChange={(e) => setOrderedBy(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Urgency Dropdown */}
            <label className="block mb-2">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select Urgency</option>
              <option value="VeryUrgent">Very Urgent</option>
              <option value="Urgent">Urgent</option>
              <option value="Not Urgent">Not Urgent</option>
            </select>

            {/* File Upload */}
            <label className="block mb-2">Upload Document/Picture</label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="w-full p-2 border rounded mb-4" 
            />

            {/* Remarks Text Area */}
            <label className="block mb-2">Remarks/Message</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Describe your request..."
            ></textarea>

            {/*<h3 className="text-xl font-semibold text-gray-800 mb-2">Products</h3>
            <AnimatePresence>
              {products.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={item.Name}
                    onChange={(e) => handleProductChange(index, "Name", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleProductChange(index, "price", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              ))}
            </AnimatePresence>*/}
            <motion.button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Create Order</motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateOrder;
