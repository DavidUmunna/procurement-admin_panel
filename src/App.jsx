import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import OrderList from "./components/OrderList";
import CreateOrder from "./components/CreateOrder";
import Addusers from "./pages/add_users";
import { Menu, X } from "lucide-react"; 
import './index.css';
import Users from "./pages/User_list";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Procurement App</h1>
    
            {/* Hamburger Menu Button (Only visible on md and below) */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            
            {/* Navigation Links (Desktop View) */}
            <ul className="hidden md:flex space-x-6">
              <li><Link path="/" className="px-4 py-2  text-white-500 rounded-lg hover:bg-gray-200 transition font-bold">Orders</Link></li>
              <li><Link path="/create" className=" text-white-500 rounded-lg hover:bg-gray-200 transition font-bold">Create Order</Link></li>
              <li><Link path="/users" className=" text-white-500 rounded-lg hover:bg-gray-200 transition font-bold"></Link>Users</li>
              <li><Link path="/addusers" className=" text-white-500 rounded-lg hover:bg-gray-200 transition font-bold"></Link>Add Users</li>
            </ul>
          </div>
    
          {/* Mobile Menu (Visible when isOpen is true) */}
          {isOpen && (
            <ul className="md:hidden flex flex-col space-y-4 mt-4">
              <li><Link path="/" className="px-4 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold">Orders</Link></li>
              <li><Link path="/create" className="px-4 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold">Create Order</Link></li>
              <li><Link path="/users" className="px-2 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold"></Link>Users</li>
              <li><Link path="/addusers" className="px-4 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold"></Link>Add Users</li>
            </ul>
          )}
    </nav>
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/addusers" element={<Addusers />} />
            <Route path="/" element={<OrderList />} />
            <Route path="/create" element={<CreateOrder />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;