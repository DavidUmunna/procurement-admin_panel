import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import OrderList from "./components/OrderList";
import CreateOrder from "./components/CreateOrder";
import Addusers from "./pages/add_users";
import Adminav from "./components/navBar";
import './index.css';
import Users from "./pages/User_list";

const App = () => {
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div>
          <Adminav/>
        </div>
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/addusers" element={<Addusers />} />
            <Route path="/" element={<OrderList />} />
            <Route path="/createorder" element={<CreateOrder />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;