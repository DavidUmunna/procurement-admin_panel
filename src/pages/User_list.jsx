
import { useEffect,useState } from "react";
import { get_users, deleteUser} from "../services/userService"


// Assuming you have an API function for deleting users

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

  // Function to delete a user
  const handleDelete = async (orderId) => {
      await deleteUser(orderId);
      fetch_users();
    };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          👤 User List
        </h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No Users found.</p>
        ) : (
          <li role="list" className="divide-y divide-gray-100">
            {users.map((person) => (
              <li key={person.email} className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <img
                    alt=""
                    src={person.imageUrl}
                    className="size-12 flex-none rounded-full bg-gray-50"
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-900">{person.name}</p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{person.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm/6 text-gray-900">{person.role}</p>
                  <button
                    onClick={() => handleDelete(person._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition font-bold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </li>
        )}
      </div>
    </div>
  );
}
