import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddSupplier() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "", // Added description field
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   

    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const response = await axios.post(`${API_URL}/supplier`,{form}, {
        

        withCredentials:true       
      });

      

     
      setForm({ 
        name: "", 
        email: "", 
        phone: "", 
        address: "", 
        description: "",
        status: "active" 
      });
      navigate("/suppliers"); // redirect after success
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
      <h2 className="text-2xl font-semibold mb-4">Add Vendor</h2>

      {Error && (
        <p className="mb-4">
          {Error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Products/Services Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Describe what this supplier provides"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Submitting..." : "Add Supplier"}
        </button>
      </form>
    </div>
  );
}