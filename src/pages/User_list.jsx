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

export default function UserList() {
  const [users, setUsers] = useState([]);

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
    setUsers(users.filter((user) => user._id !== userId)); // Remove user with animation
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6">
      <motion.div
        className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-4 sm:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          👤 User List
        </h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No Users found.</p>
        ) : (
          <motion.ul 
            className="divide-y divide-gray-100"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {users.map((person) => (
                <motion.li
                  key={person._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex justify-between gap-x-6 py-5"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <motion.img
                      alt=""
                      src={person.imageurl}
                      className="size-12 flex-none rounded-full bg-gray-50"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                      <p className="mt-1 truncate text-xs text-gray-500">{person.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-900">{person.role}</p>
                    <motion.button
                      onClick={() => handleDelete(person._id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition font-bold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Delete
                    </motion.button>
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
