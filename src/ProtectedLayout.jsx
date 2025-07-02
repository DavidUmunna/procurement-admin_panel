import { Navigate, Route, Routes} from "react-router-dom";
import CreateOrder from "./pages/CreateOrder";
import "./index.css";
import Users from "./pages/User_list";
import { Dashboard } from "./pages/Dashboard";
import AddSupplier from "./pages/add_suppliers";
import SupplierList from "./pages/supplierList";
import DepartmentAssignment from "./pages/Department_assignment";
import AssetsManagement from "./pages/Assetmanagement";
import OrdersDashboard from "./pages/orders management/Ordersmanagement";
import UserTasks from "./pages/Usertask";
import InventoryManagement from "./pages/inventorymanagement/ParentComp";
import SkipsManagement from "./pages/skips/parent";
import InventoryLogs from "./pages/inventorymanagement/inventory_logs/index";
import Monitoring from "./pages/Monitoring"
import AppLayout from "./components/AppLayout"
import Addusers from "./pages/add_users"

const ProtectedLayout=({isauthenticated,setisauthenticated})=>{
    return (
        
        <Routes>


            <Route path="admin" element={<AppLayout/>}>

                      <Route
                        path="usertasks"
                        element={
                            isauthenticated ? (
                                
                                
                                <UserTasks />
                                
                          ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                      />
                      <Route
                        path="skipstracking"
                        element={
                          isauthenticated ? (
                              
                              <SkipsManagement />
                              
                          ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                      />
                       <Route
                        path="inventorylogs"
                        element={
                          isauthenticated ? (
                         
                              <InventoryLogs />
                         
                            ) : (
                              <Navigate to="/adminlogin" />
                            )
                        }
                      />
                      <Route
                        path="inventorymanagement"
                        element={
                          isauthenticated ? (
                            
                              <InventoryManagement />
                              
                            ) : (
                                <Navigate to="/adminlogin" />
                            )
                        }
                      />
                      <Route
                        path="addusers"
                        element={
                          isauthenticated ? (
                           
                              <Addusers />
                            
                          ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                      />
                       <Route
                        path="addsupplier"
                        element={
                          isauthenticated ? (
                           
                              <AddSupplier />
                            
                          ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                      />
                      <Route
                        path="requestlist"
                        element={
                          isauthenticated ? (
                           
                              <OrdersDashboard setAuth={setisauthenticated}/>
                            
                          ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                      />
                       <Route
                        path="supplierlist"
                        element={
                          isauthenticated ? (
                           
                              <SupplierList />
                            
                          ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                      />
                      <Route
                        path="createorder"
                        element={
                          isauthenticated ? (
                              
                              <CreateOrder />
                              
                            ) : (
                            <Navigate to="/adminlogin" />
                        )
                    }
                        />
                      <Route
                        path="users"
                        element={
                            isauthenticated ? (
                                
                                <Users />
                            
                            ) : (
                            <Navigate to="/adminlogin" />
                          )
                        }
                        />
                     <Route
                        path="departmentassignment"
                        element={
                          isauthenticated ? (
                              
                              <DepartmentAssignment setAuth={setisauthenticated} />
                           
                          ) : (
                              <Navigate to="/adminlogin" />
                          )
                        }
                      />
                      <Route
                        path="assetsmanagement"
                        element={
                            isauthenticated ? (
                                
                                <AssetsManagement setAuth={setisauthenticated} />
                                
                            ) : (
                            <Navigate to="/adminlogin" />
                        )
                        }
                      />
                      <Route
                        path="monitoring"
                        element={
                          isauthenticated ? (
                              
                              <Monitoring />
                            
                            ) : (
                                <Navigate to="/adminlogin" />
                            )
                        }
                      />
                                            
                    
                      
                      <Route path="dashboard" element={isauthenticated ? <Dashboard />: <Navigate to="/adminlogin" />} />
                      <Route path="*" element={<Navigate to={isauthenticated ? "/dashboard" : "/adminlogin"} />} />
               
        
         </Route>
        
    </Routes>
        
    )

}

export default ProtectedLayout;
