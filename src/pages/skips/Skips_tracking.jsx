/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiSearch, FiCalendar } from 'react-icons/fi';
import { useUser } from '../../components/usercontext';
import axios from 'axios';
import PaginationControls from '../inventorymanagement/Paginationcontrols';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//const ADMIN_ROLES = ['admin', 'global_admin', 'human_resources', 'internal_auditor'];

const SkipsManagement = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    activities: [],
    pagination: {
      page: 1,
      limit: 5,
      total: 0
    }
  });
  
  // State
  const [SkipItems, setSkipItems] = useState([]);
  const [formData, setFormData] = useState({
    skip_id: '',
    DeliveryWaybillNo:Number,
    WasteStream: '',
    Quantity: {
      value:'',
      unit:''
    },
    SourceWell:"",
    DispatchManifestNo:"",
    DispatchTruckRegNo:'',
    DriverName:"",
    DeliveryOfEmptySkips:null,
    DemobilizationOfFilledSkips:null,
    DateFilled:null,

  });
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)), // 1st of current month
    endDate: new Date() // Today
  });
  
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  //const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWasteStream, setselectedWasteStream] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [Error, setError] = useState("");

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Fetch skips data with date range
  const fetchData = async (page = data.pagination?.page, limit = data.pagination?.limit) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const API_URL = `${process.env.REACT_APP_API_URL}/api`;
      
      const params = {
        page,
        limit,
        startDate: formatDate(dateRange.startDate),
        endDate: formatDate(dateRange.endDate)
      };

      const [skipsRes, statsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/skiptrack`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: true,
        }),
        axios.get(`${API_URL}/skiptrack/stats`, {
          params: {
            startDate: formatDate(dateRange.startDate),
            endDate: formatDate(dateRange.endDate)
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: true,
        }),
        axios.get(`${API_URL}/skiptrack/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: true,
        }),
      ]);
      
      setData({
        orders: skipsRes.data.data,
        pagination: skipsRes.data.Pagination
      });
      setSkipItems(skipsRes.data.data || []);
      setStats(statsRes.data.data);
      setCategories(categoriesRes.data.data.categories);
      
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 402  ) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem('authToken');
        
        window.location.href = '/adminlogin'; 
      } else {
        console.error('Failed to fetch data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchData();
  }, [dateRange]); // Add dateRange to dependencies

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setDateRange({
      startDate: start,
      endDate: end 
    });
  };

  // Format category name for display
  const formatCategory = (category) => {
    if (!category) return '';
    const formatted = category
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/(^|\s)\S/g, l => l.toUpperCase()); // Capitalize first letters
    
    // Special case for "PVT" to keep it uppercase
    return category === 'PVT' ? 'PVT' : formatted;
  };

  const handleDateChange = (field, date) => {
  setFormData({ ...formData, [field]: date });
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and sort
  const filteredItems = SkipItems
    .filter(item => 
      (item.skip_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.DriverName && item?.DriverName.toLowerCase().includes(searchTerm.toLowerCase()))||
      (item.SourceWell.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(item => 
        selectedWasteStream === 'All' || item.WasteStream === selectedWasteStream
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
  console.log(filteredItems)
  // Form handlers
 const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Handle the two nested quantity fields
  if (name === 'value' || name === 'unit') {
    setFormData(prev => ({
      ...prev,
      Quantity: {
        ...prev.Quantity,
        [name]: name === 'value' 
          ? parseInt(value, 10) || ''  // parse to number (or empty string)
          : value                      // keep unit as string
      }
    }));
    return;
  }

  // Everything else
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


  const handlePageChange = (newPage) => {
    fetchData(newPage, data.pagination?.limit);
  };

  const handleItemsPerPageChange = (newLimit) => {
    fetchData(1, newLimit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${API_URL}/skiptrack/create`, {
        ...formData,
        DeliveryOfEmptySkips: formData.DeliveryOfEmptySkips
      ? formData.DeliveryOfEmptySkips.toISOString()
      : null,
        DemobilizationOfFilledSkips: formData.DemobilizationOfFilledSkips
          ? formData.DemobilizationOfFilledSkips.toISOString()
          : null,
        DateFilled: formData.DateFilled
      ? formData.DateFilled.toISOString()
      : null,
        addedBy: user.userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSkipItems([...SkipItems, res.data.data]);
      resetForm();
      setShowForm(false);
      fetchData(); // Refresh data
    } catch (err) {
      if (err.response?.status===401|| err.response?.status===402){
        setError("Session expired. Please log in again.");
        localStorage.removeItem('authToken');
        
        window.location.href = '/adminlogin'; 
      } else {
        console.error('Create failed:', err.response?.data || err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const token = localStorage.getItem('authToken');
      const res = await axios.put(`${API_URL}/skiptrack/${editingItem._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` ,"ngrok-skip-browser-warning": "true"}
      });
      
      setSkipItems(SkipItems.map(item => 
        item._id === editingItem._id ? res.data.data : item
      ));
      resetForm();
      setEditingItem(null);
      setShowForm(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      const API_URL = `${process.env.REACT_APP_API_URL}/api`
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/skiptrack/${id}`, {
        headers: { Authorization: `Bearer ${token}`,"ngrok-skip-browser-warning": "true" }
      });
      setSkipItems(SkipItems.filter(item => item._id !== id));
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
       skip_id: '',
       DeliveryWaybillNo:Number,
    WasteStream: '',
    Quantity: {
      value:'',
      unit:''
    },
    SourceWell:"",
    DispatchManifestNo:'',
    DispatchTruckRegNo:'',
    DriverName:"",
    DeliveryOfEmptySkips:null,
    DemobilizationOfFilledSkips:null,
    DateFilled:null,
    });
  };

  const setupEdit = (item) => {
    setEditingItem(item);
    setFormData({
       skip_id: item.skip_id,
       DeliveryWaybillNo:item.DeliveryWaybillNo,
    WasteStream: item.WasteStream,
    Quantity: {
      value:item.Quantity.value,
      unit:item.Quantity.unit
    },
    SourceWell:item.SourceWell,
    DispatchManifestNo:item.DispatchManifestNo,
    DispatchTruckNo:item.DispatchTruckRegNo,
    DriverName:item.DriverName||"",
    DeliveryOfEmptySkips:item.DeliveryOfEmptySkips,
    DemobilizationOfFilledSkips:item.DemobilizationOfFilledSkips,
    DateFilled:item.DateFilled,
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

  /*const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };*/

  // Preset date range handlers
  const setTodayRange = () => {
    const today = new Date();
    setDateRange({
      startDate: today,
      endDate: today
    });
  };

  const setThisWeekRange = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    setDateRange({
      startDate: firstDay,
      endDate: new Date()
    });
  };

  const setThisMonthRange = () => {
    const today = new Date();
    setDateRange({
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date()
    });
  };

  const setLastMonthRange = () => {
    const today = new Date();
    setDateRange({
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), 0)
    });
  };

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-transparent'></div>
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm mt-12">
      {/* Header and Controls */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Skips Management</h1>
      
     <div className="flex flex-col xs:flex-row flex-wrap justify-between items-stretch gap-3 mb-6">
        {/* Search and Filters - takes full width on mobile, auto on larger */}
        <div className="flex-1 flex flex-row xs:flex-row gap-3 min-w-[250px]">
          {/* Search input - full width on mobile, fixed on larger */}
          <div className="relative flex-1 xs:flex-initial xs:w-48 sm:w-56">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category filter - full width on mobile, auto on larger */}
          <select
            className="flex-1 xs:flex-initial xs:w-40 sm:w-48 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
            value={selectedWasteStream}
            onChange={(e) => setselectedWasteStream(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))
            ) : (
              <option disabled>No categories</option>
            )}
          </select>
          
          {/* Date range picker - full width on mobile, auto on larger */}
          <div className="relative flex-1 xs:flex-initial xs:w-48 sm:w-56">
            <FiCalendar className="absolute left-3 top-3  text-gray-400" />
            <DatePicker
              selectsRange={true}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateRangeChange}
              isClearable={true}
              placeholderText="Date range"
              className="pl-4 pr-10 py-2 mr-5 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
      
        {/* Add button - full width on mobile, auto on larger */}
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowForm(true);
          }}
          className="w-full xs:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
        >
          <FiPlus className="mr-1 sm:mr-2" />
          <span className="whitespace-nowrap">Add Skip</span>
        </button>
      </div>

      {/* Date range display and presets */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="text-sm text-gray-600">
          Showing data from {formatDisplayDate(dateRange.startDate)} to {formatDisplayDate(dateRange.endDate)}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={setTodayRange}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            Today
          </button>
          <button 
            onClick={setThisWeekRange}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            This Week
          </button>
          <button 
            onClick={setThisMonthRange}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            This Month
          </button>
          <button 
            onClick={setLastMonthRange}
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Skip Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalItems || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Quantity(tonnes)</h3>
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
        </div>
      )}

      {/* Skip Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>
          {/* Define fixed widths for each column via w- classes */}
          <th
            onClick={() => requestSort('skip_id')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Skip ID</th>
          <th
            onClick={() => requestSort('WasteStream')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Category</th>
          <th
            onClick={() => requestSort('Quantity.value')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Quantity</th>
          <th
            onClick={() => requestSort('DeliveryWaybillNo')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Delivery Waybill No</th>
          <th
            onClick={() => requestSort('SourceWell')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Source Well</th>
          <th
            onClick={() => requestSort('DispatchManifestNo')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Dispatch Manifest No</th>
          <th
            onClick={() => requestSort('DispatchTruckRegNo')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Truck No</th>
          <th
            onClick={() => requestSort('DriverName')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Driver Name</th>
          <th
            onClick={() => requestSort('DeliveryOfEmptySkips')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Empty Delivery</th>
          <th
            onClick={() => requestSort('DemobilizationOfFilledSkips')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Demobilization</th>
          <th
            onClick={() => requestSort('DateFilled')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Date Filled</th>
          <th
            onClick={() => requestSort('lastUpdated')}
            className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
          >Last Updated</th>
          <th className="w-1/12 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredItems.length === 0 ? (
          <tr>
            <td colSpan="12" className="px-4 py-4 text-center text-gray-500">No skip items found</td>
          </tr>
        ) : (
          filteredItems.map((item) => (
            <React.Fragment key={item._id}>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    
                    <div className="ml-2 text-sm font-medium text-gray-900">{item.skip_id}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {formatCategory(item.WasteStream)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.Quantity?.value}{item.Quantity?.unit}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DeliveryWaybillNo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.SourceWell}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DispatchManifestNo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DispatchTruckRegNo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DriverName}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DeliveryOfEmptySkips?.split('T')[0]}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DemobilizationOfFilledSkips?.split('T')[0]}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.DateFilled?.split('T')[0]}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.lastUpdated?.split('T')[0]}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => setupEdit(item)} className="text-blue-600 hover:text-blue-900">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="text-red-600 hover:text-red-900">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <PaginationControls
          currentPage={data.pagination?.page}
          totalPages={data.pagination?.totalPages}
          itemsPerPage={data.pagination?.limit}
          totalItems={data.pagination?.total}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={loading}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit Skip Item' : 'Add New Skip Item'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skip ID*</label>
                  <input
                    type="text"
                    name="skip_id"
                    value={formData.skip_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    name="WasteStream"
                    value={formData.WasteStream}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select a category</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="QuantityValue"
                        min="1"
                        value={formData?.Quantity?.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Quantity: { ...formData.Quantity, value: e.target.value }
                          })
                        }
                        required
                        className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        name="QuantityUnit"
                        value={formData.Quantity.unit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Quantity: { ...formData.Quantity, unit: e.target.value }
                          })
                        }
                        required
                        className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Unit</option>
                        <option value="kg">kg</option>
                        <option value="liters">liters</option>
                        <option value="tonne">tons</option>
                        {/* Add more units as needed */}
                      </select>
                    </div>
                  </div>

                
               
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DeliveryWaybillNo</label>
                  <input
                    type="number"
                    name="DeliveryWaybillNo"
                    value={formData.DeliveryWaybillNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SourceWell*</label>
                  <input
                    type="text"
                    name="SourceWell"
                    value={formData.SourceWell}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DispatchManifestNo</label>
                  <input
                    type="text"
                    name="DispatchManifestNo"
                    value={formData.DispatchManifestNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DispatchTruckRegNo</label>
                  <input
                    type="text"
                    name="DispatchTruckRegNo"
                    value={formData.DispatchTruckRegNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DriverName</label>
                  <input
                    type="text"
                    name="DriverName"
                    value={formData.DriverName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Of Empty Skips*</label>
                  <DatePicker
                    selected={formData.DeliveryOfEmptySkips}
                    onChange={(date) => handleDateChange("DeliveryOfEmptySkips", date)}
                    className='mt-5 border-4'
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Demobilization Of Filled Skips</label>
                  <DatePicker
                    selected={formData.DemobilizationOfFilledSkips}
                    onChange={(date) => handleDateChange("DemobilizationOfFilledSkips", date)}
                    className='border-4'
                    />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Filled</label>
                  <DatePicker
                    selected={formData.DateFilled}
                    onChange={(date) => handleDateChange("DateFilled", date)}
                    className='border-4'
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
              </div>
            </form>
           
          </div>
        </div>
      )}

      {/* Error Display */}
      {Error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {Error}
        </div>
      )}
    </div>
  );
};

export default SkipsManagement;