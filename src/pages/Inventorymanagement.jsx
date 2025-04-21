import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiChevronDown, FiChevronUp, FiFilter, FiSearch } from 'react-icons/fi';
import { useUser } from '../components/usercontext';
import InventoryAnalytics from "../components/InventoryAnalytics";
import InventoryConditionChart from './Inventoryvisuals';
import axios from 'axios';

const InventoryManagement = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);

  // State
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    condition: 'New',
    description: '',
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

  // Fetch inventory data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [inventoryRes, statsRes,categoriesRes] = await Promise.all([
          axios.get('/api/inventory', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/inventory/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/inventory/categories', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setInventoryItems(inventoryRes.data.data);
        setStats(statsRes.data.data);
        setCategories(categoriesRes.data.data)
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
   
  const formatCategory = (category) => {
    const formatted = category
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/(^|\s)\S/g, l => l.toUpperCase()); // Capitalize first letters
    
    // Special case for "PVT" to keep it uppercase
    return category === 'PVT' ? 'PVT' : formatted;
  };

  // Filter and sort
  const filteredItems = inventoryItems
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
      [name]: name === 'quantity' || name === 'value' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post('/api/inventory', {
        ...formData,
        addedBy: user.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInventoryItems([...inventoryItems, res.data.data]);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Create failed:', err.response?.data || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.put(`/api/inventory/${editingItem._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInventoryItems(inventoryItems.map(item => 
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
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryItems(inventoryItems.filter(item => item._id !== id));
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

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (loading) return <div className="text-center py-8">Loading inventory...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      {/* Header and Controls */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
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
            {categories.map(category => (
              <option key={category} value={category}>
                {formatCategory(category)}
                </option>
            ))}
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
          Add Inventory Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
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
                <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
               >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {formatCategory(category  )}
                      </option>
                    ))}
                </select>
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

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            ₦{stats.totalValue ? stats.totalValue.toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table structure remains the same */}
        {/* ... */}
      </div>

      {/* Analytics */}
      <div className="mt-8 px-4 sm:px-6 lg:px-8">
        <div className="h-64 mt-20 md:h-80 flex items-center justify-center bg-gray-50 rounded">
          <InventoryAnalytics inventoryItems={inventoryItems} />
        </div>
        
        <div className="bg-white p-6 mt-25 rounded-lg shadow-sm bordermt-10 border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InventoryConditionChart inventoryItems={inventoryItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;