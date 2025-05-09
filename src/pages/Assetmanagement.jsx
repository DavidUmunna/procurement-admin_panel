import React,{ useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiChevronDown, FiChevronUp,  FiSearch } from 'react-icons/fi';
import { useUser } from '../components/usercontext';
import Assetsanalysis from "../components/Assetsanalysis";
import AssetsConditionChart from './Asssetvisuals';
import axios from 'axios';


const ADMIN_ROLES=['admin','global_admin','human_resources','internal_auditor']
const AssetManagement = ({setAuth}) => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);

  // State
  const [AssetItems, setAssetItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    condition: 'New',
    description: '',
    
    location:'',
    
    value: 0
  });
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [Error,setError]=useState("")

  // Fetch Asset data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const API_URL = `${process.env.REACT_APP_API_URL}/api`
        const [AssetRes, statsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/assets`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/assets/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/assets/categories`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          }),
        ]);
      
        setAssetItems(AssetRes.data.data);
        setStats(statsRes.data.data);
        setCategories(categoriesRes.data.data);
      
      } catch (err) {  // add `: any` if you want better type safety
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem('authToken');
          setAuth(false);
          window.location.href = '/adminlogin'; 
        } else {
          console.error('Failed to fetch data:', err);
        }
      } finally {
        setLoading(false);
      }
      
    }
    fetchData();

}, [setAuth]);
  console.log(categories)
  const formatCategory = (category) => {
    const formatted = category
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/(^|\s)\S/g, l => l.toUpperCase()); // Capitalize first letters
    
    // Special case for "PVT" to keep it uppercase
    return category === 'PVT' ? 'PVT' : formatted;
  };

  // Filter and sort
  const filteredItems = AssetItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(item => 
      selectedCategory === 'All' || item.category === selectedCategory
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'value' ? parseInt(value)  : value
    });
  };
  
/*const handleExpand = (id) => {
  setExpandedItem((prev) => (prev === id ? null : id));
};*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${API_URL}/assets`, {
        ...formData,
        addedBy: user.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAssetItems([...AssetItems, res.data.data]);
      resetForm();
      setShowForm(false);
    } catch (err) {
      if (err.response?.status===401|| err.response?.status===403){
        setError("Session expired. Please log in again.");
        localStorage.removeItem('authToken');
        setAuth(false)
        window.location.href = '/adminlogin'; 
      }else{

        console.error('Create failed:', err.response?.data || err.message);
      }

      
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const token = localStorage.getItem('authToken');
      const res = await axios.put(`${API_URL}/assets/${editingItem._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAssetItems(AssetItems.map(item => 
        item._id === editingItem._id ? res.data.data : item
      ));
      resetForm();
      setEditingItem(null);
      setShowForm(false);
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssetItems(AssetItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 1,
      condition: 'New',
      description: '',
      value: 0
    });
  };

  const setupEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      condition: item.condition,
      description: item.description || '',
      location:item.location,
      value: item.value || 0
    });
    setShowForm(true);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  console.log("filtered items",filteredItems)

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (loading) return <div className="text-center py-8">Loading Assets...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm mt-12">
      {/* Header and Controls */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Asset Management</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Assets..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
              className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              
              {Array.isArray(categories?.categories) && categories.categories.length > 0 ? (
                categories.categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategory(category)}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
        </div>
        
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowForm(true);
          }}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          <FiPlus className="mr-2" />
          Add Asset Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit Asset Item' : 'Add New Asset Item'}
              </h2>
              
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={editingItem ? handleUpdate : handleSubmit}>

              <div className="space-y-4">
                {/* Form fields remain the same as your original */}
                {/* ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
               >
                  <option value="">Select a category</option>
                {Array.isArray(categories?.categories) && categories.categories.length > 0 ? (
                  categories.categories.map((category) => (
                    <option key={category} value={category}>
                      {formatCategory(category)}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monetary Value</label>
                    <input
                      type="number"
                      name="value"
                      min="1"
                      value={formData.value}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition*</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">location</label>
                    <input
                      type="text"
                      name="location.warehouse"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              
                

              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiSave className="mr-2" />
                  {editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Summary Cards */}
      {stats&&(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalItems || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Quantity</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalQuantity || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalCategories || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
          <p className="text-2xl font-bold text-gray-800">
            ₦{stats.totalvalue ? stats.totalvalue.toLocaleString() : 0}
          </p>
        </div>
      </div>)}

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Table headers */}
                    <th onClick={() => requestSort('name')}>Item Name</th>
                    <th onClick={() => requestSort('category')}>Category</th>
                    <th onClick={() => requestSort('quantity')}>Quantity</th>
                    <th onClick={() => requestSort('condition')}>Condition</th>
                    <th onClick={() => requestSort('lastUpdated')}>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No Assets items found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <React.Fragment key={item._id}>

                      <tr key={item._id} className="hover:bg-gray-50">
                        {/* Table cells */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button onClick={() => toggleItem(item._id)}>
                              {expandedItem === item._id ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            <div className="ml-2">{item.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="category-badge">{item.category}</span>
                        </td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">
                          <span className={`condition-badge ${item.condition}`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4">{item.lastUpdated.split("T")[0]}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setupEdit(item)}>
                            <FiEdit2 className="edit-icon" />
                          </button>
                          <button onClick={() => deleteItem(item._id)}>
                            <FiTrash2 className="delete-icon" />
                          </button>
                        </td>
                        
                      </tr>
                      {expandedItem===item._id&&(
                    <tr>
                     {console.log(expandedItem)}
                     <td colSpan="6" className="px-6 py-4 bg-gray-50">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <h4 className="font-medium">SKU:</h4>
                           <p>{item.sku || 'Not specified'}</p>
                         </div>
                         <div>
                           <h4 className="font-medium">Description:</h4>
                           <p>{item.description || 'No description'}</p>
                         </div>
                       </div>
                     </td>
                   </tr>
                  )}
                 </React.Fragment>
                    )))}
                </tbody>
              </table>
              </div>
          
            {/* Expanded row details */}
           
          </div>
      </div>

      {/* Analytics */}
      <div className='items-center flex justify-center '>

        {ADMIN_ROLES.includes(user.role)&&(<div className=" mt-8 flex flex-wrap px-4 md:flex-nowrap   max-w-full">
          <div className="h-50 mt-20 md:h-80 flex items-center justify-center bg-gray-50 rounded">
            <Assetsanalysis AssetItems={AssetItems} />
          </div>
          
          <div className="bg-white h-50  mt-25 rounded-lg  bordermt-10 border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-1">
              <AssetsConditionChart AssetItems={AssetItems} />
            </div>
          </div>
        </div>)}
        {Error}
      </div>
    </div>
  );
};

export default AssetManagement; 