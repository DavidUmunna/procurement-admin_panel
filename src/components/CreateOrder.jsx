import React, { useState, useEffect } from "react";
import { createOrder } from "../services/OrderService";
import {  FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "./usercontext";
//import { Form } from "react-router-dom";

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
  const { user} = useUser();
  const [supplier, setSupplier] = useState("Halden");
  const [products, setProducts] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [orderedBy, setOrderedBy] = useState("");
  const [urgency, setUrgency] = useState("");
  const [files, setFiles] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [email, setEmail] = useState("");
  const [filename,setfilename]=useState("")

  useEffect(() => {
    if (user) {
      setOrderedBy(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleFileChange = (event) => {
    const uploadedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(uploadedFiles);
    if (uploadedFiles.length>0){
      setfilename(uploadedFiles[0].name)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(filename)
    //const form=e.target
    const formData = new FormData();
    //let formdataobject=Object.fromEntries(formData.entries())
    const payload= {
        supplier,
        orderedBy,
        email,
        filename,
        urgency,
        remarks,
        products, // Sending products separately as a JSON object
      }
    //console.log(formdataobject)
    formData.append("email", email);
    files.forEach((file) => {
      formData.append("files", file);
    }); 
    
    try {
      
      const fileupload=await createOrder({formData:formData,orderData:payload});
      if (files.length>0){

        //setUser((prev)=>({...prev,filename:fileupload.files.map(file=>file.filename)}))
        console.log("file uploaded:",fileupload.file);
      }
      

    
    

    
      //const orderData = await createOrder({ supplier, orderedBy,email,products, urgency, files, remarks });
  
      //console.log("Submitting order data:", orderData);
  
      setOrderedBy("");
      


      //console.log("Order created:", orderData);


      setSupplier("Halden");
      setProducts([{ name: "", quantity: 1, price: 0 }]);
      setUrgency("");
      setFiles([]);
      setRemarks("");
      alert("Order Created!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: 1, price: 0 }]);
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

            <label className="block mb-2">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select Urgency</option>
              <option className="text-red-500" value="VeryUrgent">Very Urgent</option>
              <option value="Urgent">Urgent</option>
              <option value="NotUrgent">Not Urgent</option>
            </select>

            <div className="flex flex-col items-center justify-center w-full">
              <label className="w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition p-4">
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                {files.length === 0 ? (
                  <div className="flex flex-col items-center text-gray-500">
                    <FileText size={40} />
                    <p className="text-sm mt-2">Click or drag files here (not more than 16mb)</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((file, index) => (
                      <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm">
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <label className="block mb-2">Remarks/Message</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Describe your request..."
            ></textarea>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Request</h3>
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
                    value={item.name}
                    onChange={(e) => handleProductChange(index, "name", e.target.value)}
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
                  <motion.button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={addProduct}
              className="p-2 y-4 w-full bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              variants={buttonVariants}
              whileHover="hover"
            >
              Add Product
            </motion.button>
            <motion.button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Create Request</motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateOrder;