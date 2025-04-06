import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import OrderList from "./components/OrderList";
import CreateOrder from "./components/CreateOrder";
import Addusers from "./pages/add_users";
import Adminav from "./components/navBar";
import { UserProvider } from "./components/usercontext";
import "./index.css";
import Users from "./pages/User_list";
import Adminlogin from "./pages/admin_login";
import Userdetails from "./pages/user_details";
import Logout from "./components/logout";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios"
import ForgotPassword from "./pages/forgotpassword";
// Page transition animation
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.6, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();
  const [isauthenticated, setisauthenticated] = useState(null);


  useEffect(() => {
    console.log("isauthenticated", isauthenticated);
    const checkAuth = async () => {
      try {
        const token=localStorage.getItem("authToken")
        const response = await axios.get("https://4a1c-102-90-81-110.ngrok-free.app/api/access",
           {headers: {Authorization:`Bearer ${token}`}, 
          withCredentials: true });
        setisauthenticated(response.data.authenticated);
      } catch (error) {
        setisauthenticated(false);
        console.error(error);
      }
    };
    checkAuth();
  }, [isauthenticated]);

  if (isauthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Show Navbar only if user is authenticated */}
        {isauthenticated && <Adminav />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/adminlogin"
              element={
                !isauthenticated ? (
                  <PageTransition>
                    <Adminlogin setAuth={setisauthenticated} />
                  </PageTransition>
                ) : (
                  <Navigate to="/userdetails" />
                )
              }
            />
            <Route
              path="/addusers"
              element={
                isauthenticated ? (
                  <PageTransition>
                    <Addusers />
                  </PageTransition>
                ) : (
                  <Navigate to="/adminlogin" />
                )
              }
            />
            <Route
              path="/requestlist"
              element={
                isauthenticated ? (
                  <PageTransition>
                    <OrderList />
                  </PageTransition>
                ) : (
                  <Navigate to="/adminlogin" />
                )
              }
            />
            <Route
              path="/createorder"
              element={
                isauthenticated ? (
                  <PageTransition>
                    <CreateOrder />
                  </PageTransition>
                ) : (
                  <Navigate to="/adminlogin" />
                )
              }
            />
            <Route
              path="/users"
              element={
                isauthenticated ? (
                  <PageTransition>
                    <Users />
                  </PageTransition>
                ) : (
                  <Navigate to="/adminlogin" />
                )
              }
            />
            <Route
              path="/userdetails"
              element={
                isauthenticated ? (
                  <PageTransition>
                    <Userdetails />
                  </PageTransition>
                ) : (
                  <Navigate to="/adminlogin" />
                )
              }
            />
            <Route path="/forgotpassword"
            element={
              <PageTransition>
                <ForgotPassword/>
              </PageTransition>
            }/>
            <Route
              path="/signout"
              element={<PageTransition><Logout setAuth={setisauthenticated} /></PageTransition>}
            />
            <Route path="*" element={<Navigate to={isauthenticated ? "/userdetails" : "/adminlogin"} />} />
          </Routes>
        </AnimatePresence>
      </div>
    </UserProvider>
  );
};

export default App;
