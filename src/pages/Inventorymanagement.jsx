import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiChevronDown, FiChevronUp, FiFilter, FiSearch } from 'react-icons/fi';

const InventoryManagement = ({ currentUser }) => {
  // Sample inventory categories (can be expanded)
  const categories = [
    'Office Supplies',
    'IT Equipment',
    'Furniture',
    'Stationery',
    'Tools',
    'Consumables'
  ];

  // Inventory state
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Laptop',
      category: 'IT Equipment',
      quantity: 15,
      condition: 'Good',
      lastUpdated: '2023-05-15',
      notes: 'Dell XPS models',
      addedBy: 'IT Department Head'
    },
    {
      id: 2,
      name: 'Office Chairs',
      category: 'Furniture',
      quantity: 25,
      condition: 'Fair',
      lastUpdated: '2023-05-10',
      notes: 'Some need replacement',
      addedBy: 'HR Department Head'
    }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    condition: 'Good',
    notes: ''
  });

  // UI state
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });

  // Filter and sort inventory items
  const filteredItems = inventoryItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    });
  };

  // Submit new inventory item
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now(),
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0],
      addedBy: currentUser.name || 'Department Head'
    };

    setInventoryItems([...inventoryItems, newItem]);
    resetForm();
    setShowForm(false);
  };

  // Update existing item
  const handleUpdate = (e) => {
    e.preventDefault();
    
    const updatedItems = inventoryItems.map(item =>
      item.id === editingItem.id
        ? {
            ...item,
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : item
    );

    setInventoryItems(updatedItems);
    resetForm();
    setEditingItem(null);
    setShowForm(false);
  };

  // Delete inventory item
  const deleteItem = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 1,
      condition: 'Good',
      notes: ''
    });
  };

  // Set up editing
  const setupEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      condition: item.condition,
      notes: item.notes
    });
    setShowForm(true);
  };

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle item expansion
  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>
      
      {/* Controls */}
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
              <option key={category} value={category}>{category}</option>
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

      {/* Inventory Form Modal */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition*</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Needs Replacement">Needs Replacement</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
          <p className="text-2xl font-bold text-gray-800">{inventoryItems.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Quantity</h3>
          <p className="text-2xl font-bold text-gray-800">
            {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-gray-800">
            {[...new Set(inventoryItems.map(item => item.category))].length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Needs Replacement</h3>
          <p className="text-2xl font-bold text-gray-800">
            {inventoryItems.filter(item => item.condition === 'Needs Replacement').length}
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Item Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.key === 'category' && (
                      sortConfig.direction === 'asc' ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortConfig.key === 'quantity' && (
                      sortConfig.direction === 'asc' ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('condition')}
                >
                  <div className="flex items-center">
                    Condition
                    {sortConfig.key === 'condition' && (
                      sortConfig.direction === 'asc' ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lastUpdated')}
                >
                  <div className="flex items-center">
                    Last Updated
                    {sortConfig.key === 'lastUpdated' && (
                      sortConfig.direction === 'asc' ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 transition-colors ${expandedItem === item.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className="mr-2 text-gray-500 hover:text-blue-600"
                        >
                          {expandedItem === item.id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                        item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                        item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setupEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Expanded Row Details */}
        {expandedItem && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn">
            {(() => {
              const item = inventoryItems.find(i => i.id === expandedItem);
              if (!item) return null;
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Added By</h4>
                    <p className="text-sm text-gray-900">{item.addedBy}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                    <p className="text-sm text-gray-900">{item.lastUpdated}</p>
                  </div>
                  <div className="md:col-span-3">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {item.notes || 'No additional notes provided'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Data Visualization Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Analytics Preview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Inventory by Category</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">[Category distribution chart would appear here]</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This visualization shows the distribution of inventory items across different categories.
              Data ready for visualization: {JSON.stringify(
                categories.map(category => ({
                  category,
                  count: inventoryItems.filter(item => item.category === category).length,
                  quantity: inventoryItems
                    .filter(item => item.category === category)
                    .reduce((sum, item) => sum + item.quantity, 0)
                }))
              )}
            </p>
          </div>
          
          {/* Condition Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Inventory Condition</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">[Condition overview chart would appear here]</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This visualization shows the condition breakdown of inventory items.
              Data ready for visualization: {JSON.stringify(
                ['Excellent', 'Good', 'Fair', 'Poor', 'Needs Replacement'].map(condition => ({
                  condition,
                  count: inventoryItems.filter(item => item.condition === condition).length
                }))
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;