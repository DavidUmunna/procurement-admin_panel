import { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiSearch, FiCheck, FiX } from 'react-icons/fi';

const DepartmentAssignment = () => {
  // State for departments and users
  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT', head: null, users: [101, 102] },
    { id: 2, name: 'HR', head: 103, users: [103, 104] },
    { id: 3, name: 'Finance', head: 105, users: [105] },
  ]);

  const [allUsers, setAllUsers] = useState([
    { id: 101, name: 'John Doe', email: 'john@example.com' },
    { id: 102, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 103, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 104, name: 'Sarah Williams', email: 'sarah@example.com' },
    { id: 105, name: 'David Brown', email: 'david@example.com' },
    { id: 106, name: 'Emily Davis', email: 'emily@example.com' }, // Unassigned user
  ]);

  // UI state
  const [expandedDept, setExpandedDept] = useState(null);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [editingDept, setEditingDept] = useState(null);

  // Filter users not assigned to any department
  const unassignedUsers = allUsers.filter(
    user => !departments.some(dept => dept.users.includes(user.id))
  );

  // Filter users based on search term
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle department expansion
  const toggleDept = (deptId) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  // Add new department
  const addDepartment = () => {
    if (!newDeptName.trim()) return;
    
    const newDept = {
      id: Date.now(),
      name: newDeptName,
      head: null,
      users: []
    };
    
    setDepartments([...departments, newDept]);
    setNewDeptName('');
    setShowAddDeptModal(false);
  };

  // Edit department name
  const editDepartment = () => {
    if (!newDeptName.trim()) return;
    
    setDepartments(departments.map(dept =>
      dept.id === editingDept.id ? { ...dept, name: newDeptName } : dept
    ));
    
    setEditingDept(null);
    setNewDeptName('');
  };

  // Delete department
  const deleteDepartment = (deptId) => {
    setDepartments(departments.filter(dept => dept.id !== deptId));
  };

  // Add user to department
  const addUserToDept = (userId) => {
    setDepartments(departments.map(dept =>
      dept.id === currentDept.id
        ? { ...dept, users: [...dept.users, userId] }
        : dept
    ));
    setShowAddUserModal(false);
  };

  // Remove user from department
  const removeUserFromDept = (deptId, userId) => {
    setDepartments(departments.map(dept =>
      dept.id === deptId
        ? { 
            ...dept, 
            users: dept.users.filter(id => id !== userId),
            head: dept.head === userId ? null : dept.head
          }
        : dept
    ));
  };

  // Set department head
  const setDepartmentHead = (deptId, userId) => {
    setDepartments(departments.map(dept =>
      dept.id === deptId ? { ...dept, head: userId } : dept
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Department Management</h1>
      
      {/* Search and Add Department */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setEditingDept(null);
            setNewDeptName('');
            setShowAddDeptModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
        >
          <FiUserPlus className="mr-2" />
          Add Department
        </button>
      </div>

      {/* Departments List */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleDept(dept.id)}
            >
              <div className="flex items-center">
                <h2 className="font-semibold text-lg text-gray-800">{dept.name}</h2>
                {dept.head && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Head: {allUsers.find(u => u.id === dept.head)?.name}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {dept.users.length} {dept.users.length === 1 ? 'member' : 'members'}
                </span>
                {expandedDept === dept.id ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Expanded Department Details */}
            {expandedDept === dept.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 transition-all duration-300 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Department Members</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setCurrentDept(dept);
                        setShowAddUserModal(true);
                      }}
                      className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded flex items-center transition-colors"
                    >
                      <FiUserPlus className="mr-1" /> Add User
                    </button>
                    <button
                      onClick={() => {
                        setEditingDept(dept);
                        setNewDeptName(dept.name);
                        setShowAddDeptModal(true);
                      }}
                      className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded flex items-center transition-colors"
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => deleteDepartment(dept.id)}
                      className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded flex items-center transition-colors"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>

                {/* Department Members List */}
                <div className="space-y-2">
                  {dept.users.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No members in this department</p>
                  ) : (
                    dept.users.map(userId => {
                      const user = allUsers.find(u => u.id === userId);
                      if (!user) return null;
                      return (
                        <div key={userId} className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 hover:shadow-sm transition-all">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {dept.head === userId ? (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Head</span>
                            ) : (
                              <button
                                onClick={() => setDepartmentHead(dept.id, userId)}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition-colors"
                              >
                                Make Head
                              </button>
                            )}
                            <button
                              onClick={() => removeUserFromDept(dept.id, userId)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FiX />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 animate-scaleIn">
            <h2 className="text-xl font-bold mb-4">
              {editingDept ? 'Edit Department' : 'Add New Department'}
            </h2>
            <input
              type="text"
              placeholder="Department name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddDeptModal(false);
                  setEditingDept(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingDept ? editDepartment : addDepartment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingDept ? 'Save Changes' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User to Department Modal */}
      {showAddUserModal && currentDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 animate-scaleIn">
            <h2 className="text-xl font-bold mb-4">
              Add User to {currentDept.name}
            </h2>
            <div className="max-h-96 overflow-y-auto">
              {unassignedUsers.length === 0 ? (
                <p className="text-gray-500">No unassigned users available</p>
              ) : (
                unassignedUsers.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => addUserToDept(user.id)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <FiCheck size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentAssignment;