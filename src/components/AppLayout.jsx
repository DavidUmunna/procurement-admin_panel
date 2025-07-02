import { Outlet } from "react-router-dom";
import Navbar from "./navBar";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function AppLayout() {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Persistent Navbar */}
      <Navbar />
      
      {/* Animated content area */}
      <main className="flex-1 relative">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.25,
            ease: "easeInOut",
            type: "tween" 
          }}
          className="absolute inset-0"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default AppLayout;