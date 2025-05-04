import { useEffect, useState } from "react";
import { get_users, deleteUser } from "../services/userService";
import { motion, AnimatePresence } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

// Department colors mapping
const departmentColors = {
  Engineering: "bg-blue-100 text-blue-800",
  Design: "bg-purple-100 text-purple-800",
  Marketing: "bg-pink-100 text-pink-800",
  Sales: "bg-green-100 text-green-800",
  HR: "bg-yellow-100 text-yellow-800",
  Operations: "bg-indigo-100 text-indigo-800",
  Default: "bg-gray-100 text-gray-800"
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch_users();
  }, []);

  const fetch_users = async () => {
    try {
      const user_data = await get_users();
      if (Array.isArray(user_data)) {
        setUsers(user_data || []);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    setUsers(users.filter((user) => user._id !== userId));
  };

  const filteredUsers = filter === "all" 
    ? users 
    : users.filter(user => user.department === filter);

  const departments = [...new Set(users.map(user => user.department))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 mt-10">
      <motion.div
        className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">👥 User Management</h2>
              <p className="text-gray-500 mt-1">{users.length} team members</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <motion.div 
            className="p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">No users found{filter !== "all" && ` in ${filter} department`}.</p>
          </motion.div>
        ) : (
          <motion.ul 
            className="divide-y divide-gray-100"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredUsers.map((person) => (
                <motion.li
                  key={person._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <motion.img
                        alt={person.name}
                        src={person.imageurl || "https://ui-avatars.com/api/?name="+person.name+"&background=random"}
                        className="size-12 sm:size-14 flex-none rounded-full bg-gray-100 border-2 border-white shadow"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{person.name}</p>
                          {person.role === "Admin" && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">Admin</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{person.email}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            departmentColors[person.department] || departmentColors.Default
                          }`}>
                            {person.Department || "No Department"}
                          </span>
                          {person.role && person.role !== "Admin" && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                              {person.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:justify-normal gap-3">
                      <motion.button
                        onClick={() => handleDelete(person._id)}
                        className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition font-medium flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
}