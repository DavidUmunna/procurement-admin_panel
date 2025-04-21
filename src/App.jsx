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
import { Dashboard } from "./pages/Dashboard";
import ForgotPassword from "./pages/forgotpassword";
import Fallback from "./components/errorboundary";
import { ErrorBoundary } from 'react-error-boundary';
import AddSupplier from "./pages/add_suppliers";
import SupplierList from "./pages/supplierList";
import DepartmentAssignment from "./pages/Department_assignment";
import InventoryManagement from "./pages/Inventorymanagement";
import OrdersDashboard from "./components/Ordersmanagement";
import ProtectedRoute from "./components/Protectedroute";
import UnauthorizedPage from "./pages/Unauthorized";

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
  //const {user}=useUser()
  const location = useLocation();
  const [isauthenticated, setisauthenticated] = useState(false);


  useEffect(() => {
    console.log("isauthenticated", isauthenticated);
    const checkAuth = async () => {
      try {
        const token=localStorage.getItem("authToken")
        const response = await axios.get("/api/access",
           {headers: {Authorization:`Bearer ${token}`,}, 
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
    <ErrorBoundary fallback={<Fallback/>}>

      <UserProvider>
        <div className="min-h-screen bg-gray-100 w-full  px-0 ">
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
                    <Navigate to="/dashboard" />
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
                path="/addsupplier"
                element={
                  isauthenticated ? (
                    <PageTransition>
                      <AddSupplier />
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
                      <OrdersDashboard />
                    </PageTransition>
                  ) : (
                    <Navigate to="/adminlogin" />
                  )
                }
              />
               <Route
                path="/supplierlist"
                element={
                  isauthenticated ? (
                    <PageTransition>
                      <SupplierList />
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
                path="/departmentassignment"
                element={
                  isauthenticated ? (
                    <PageTransition>
                    <DepartmentAssignment />
                    </PageTransition>
                  ) : (
                    <Navigate to="/adminlogin" />
                  )
                }
              />
              <Route
                path="/inventorymanagement"
                element={
                  isauthenticated ? (
                    <PageTransition>
                    <InventoryManagement  />
                    </PageTransition>
                  ) : (
                    <Navigate to="/adminlogin" />
                  )
                }
              />
              <Route
                path="/unauthorized"
                element={
                  isauthenticated ? (
                    <PageTransition>
                    <UnauthorizedPage  />
                    </PageTransition>
                  ) : (
                    <Navigate to="/adminlogin" />
                  )
                }
              />
              {/* <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute requiredRoles={['admin', 'global_admin',]}>
                    <PageTransition>
                      <InventoryManagement  />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />*/}
                    
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
              <Route path="/dashboard" element={isauthenticated ? <PageTransition><Dashboard /></PageTransition> : <Navigate to="/signin" />} />
              <Route path="*" element={<Navigate to={isauthenticated ? "/dashboard" : "/adminlogin"} />} />
            </Routes>
          </AnimatePresence>
        </div>
      </UserProvider>
    </ErrorBoundary>  
  );
};

export default App;
