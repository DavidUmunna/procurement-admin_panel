import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import OrderList from "./components/OrderList";
import CreateOrder from "./components/CreateOrder";

import './index.css';
import Users from "./pages/User";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-black p-4 shadow-lg">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-lg font-bold mb-4 md:mb-0">Procurement App</div>
            <div className="space-x-4">
              <Link to="/" className="px-4 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold">
                Orders
              </Link>
              <Link to="/create" className="px-4 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold">
                Create Order
              </Link>
              <Link to="/src/pages/User.jsx" className="px-4 py-2 bg-white text-yellow-500 rounded-lg hover:bg-gray-200 transition font-bold">
                Users
              </Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <Routes>
            
            <Route path="/" element={<OrderList />} />
            <Route path="/create" element={<CreateOrder />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;