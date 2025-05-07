import React, { useState, useEffect } from 'react';
import { useUser } from '../../components/usercontext';
import { useNavigate } from 'react-router';
import axios from "axios";
import RecentActivity from './recentactivity';
import {Plus,Minus} from "lucide-react"

const InventoryManagement = ({ setAuth }) => {
  const navigate=useNavigate()
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [formdata, setformdata] = useState({
    name: '',
    category: '',
    quantity: 1,
  });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });
  // eslint-disable-next-line
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const API_URL = `${process.env.REACT_APP_API_URL}/api`;
        const [inventoryRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/inventory`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/inventory/categories`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          }),
        ]);
        
        setInventoryItems(inventoryRes.data.data);
        const newData = categoriesRes.data.data.categories;
        console.log(newData)
        setCategories(newData);

        setTimeout(()=>console.log(categories),3000)
        
        
        // Fetch recent activities
        const activitiesRes = await axios.get(`${API_URL}/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: true,
        });
        setActivities(activitiesRes.data.data);
        
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem('authToken');
          navigate("/logout")
          window.location.href = '/adminlogin'; 
        } else {
          console.error('Failed to fetch data:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setformdata({
      name: '',
      category: '',
      quantity: 1,
    });
  };

  const addQuantity = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = `${process.env.REACT_APP_API_URL}/api`;
      const res = await axios.put(`${API_URL}/inventory/${itemId}`, {
        quantity: 1,
        userId: user.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("resp",res)
      setInventoryItems(inventoryItems.map(item => 
        item._id === itemId ? res.data.data : item
      ));
      
      // Add to activities
      const updatedItem = inventoryItems.find(item => item._id === itemId);
      setActivities([{
        action: 'Added',
        name: updatedItem.name,
        quantity: 1,
        timestamp: new Date().toISOString(),
        user: user.name
      }, ...activities]);
      
    } catch (err) {
      console.error('Failed to add quantity:', err);
    }
  };

  const removeQuantity = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = `${process.env.REACT_APP_API_URL}/api`;
      const res = await axios.put(`${API_URL}/inventory/${itemId}`, {
        quantity: -1,
        userId: user.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("resp",res)
      setInventoryItems(inventoryItems.map(item => 
        item._id === itemId ? res.data.data : item
      ));
      
      // Add to activities
      const updatedItem = inventoryItems.find(item => item._id === itemId);
      setActivities([{
        action: 'Removed',
        name: updatedItem.name,
        quantity: 1,
        timestamp: new Date().toISOString(),
        user: user.name
      }, ...activities]);
      
    } catch (err) {
      console.error('Failed to remove quantity:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: name === 'quantity' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`;
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${API_URL}/inventory`, {
        ...formdata,
        addedBy: user.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInventoryItems([...inventoryItems, res.data.data]);
      
      // Add to activities
      setActivities([{
        action: 'Added',
        name: formdata.name,
        quantity: formdata.quantity,
        timestamp: new Date().toISOString(),
        user: user.name
      }, ...activities]);
      
      resetForm();
      setShowForm(false);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem('authToken');
        setAuth(false);
        window.location.href = '/adminlogin'; 
      } else {
        console.error('Create failed:', err.response?.data || err.message);
      }
    }
  };
  console.log(inventoryItems)

  const filteredItems = inventoryItems
  ?.filter(item => {
    const nameMatch = item?.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '');
    const descMatch = item?.description?.toLowerCase().includes(searchTerm?.toLowerCase() || '');
    return nameMatch || descMatch;
  })
  .filter(item => {
    return selectedCategory === 'All' || item?.category === selectedCategory;
  })
  .sort((a, b) => {
    const aVal = a?.[sortConfig.key];
    const bVal = b?.[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });


  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Inventory Management (2/3 width) */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {showForm ? 'Cancel' : 'Add New Item'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formdata.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      name="category"
                      value={formdata.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories?.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formdata.quantity}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add item
                </button>
              </form>
            )}

            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded flex-grow"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="All">All Categories</option>
                {categories?.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading inventory...</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No items found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500">{item.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => addQuantity(item._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Plus/>
                            </button>
                            <button 
                              onClick={() => removeQuantity(item._id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={item.quantity <= 0}
                            >
                              <Minus/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {Error}
        </div>

        {/* Recent Activity (1/3 width) */}
        <div className="lg:w-1/3">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;