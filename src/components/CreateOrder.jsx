import React, { useState } from "react";
import { createOrder } from "../services/OrderService";


const CreateOrder = () => {
  const [supplier, setSupplier] = useState("Halden");
  const [products, setProducts] = useState([{ Name: "", quantity: 1 ,price:`₦${0}`}]);
  const [orderedBy,setorderedBy]=useState("")
  //const [price,setPrice]=useState(`₦`)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData=await createOrder({ supplier, products, orderedBy });
  
    console.log("Submitting order data:", orderData);
    await createOrder(orderData)
    setorderedBy("");
    setSupplier("Company");
    setProducts([{ Name: "", quantity: 1,price:`₦${0}` }]);
    alert("Order Created!");
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { Name: "", quantity: 1 }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Purchase Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Supplier :</label>
            <input
              type="text"
              placeholder="Optional"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">ordered By:</label>
            <input
              type="text"
              value={orderedBy}
              onChange={(e) => setorderedBy(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">Products</h3>
          {products.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
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
                placeholder="price"
                value={item.price}
                onChange={(e) => handleProductChange(index, "price", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add Product
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;