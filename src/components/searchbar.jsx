import { useSelector, useDispatch } from 'react-redux';
import {
  setKeyword, setStatus, setDateRange, setOrderedBy, resetFilters,
} from '../js/reducer/rootreducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Searchbar = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const [isMobile, setIsMobile] = useState(false);
  const [searchMode, setSearchMode] = useState('orderedby');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    dispatch(setDateRange({ ...search.dateRange, [name]: value }));
  };

  const handleSearch = () => {
    console.log('Search parameters:', search);
    dispatch(resetFilters());
  };

  return (
    <div className="px-4 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-4 mt-8"
      >
        <h2 className="text-2xl font-semibold text-gray-700">Search Orders</h2>

        <div className="space-y-4">
          {/* Mode Selector */}
          <select
            className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
          >
            <option value="orderedby">Ordered By</option>
            <option value="keyword">Keyword</option>
            <option value="status">Status</option>
            <option value="date">Date Range</option>
          </select>

          {/* Conditionally Render Inputs */}
          {searchMode === 'orderedby' && (
            <input
              placeholder="Ordered by"
              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search.orderedby}
              onChange={(e) => dispatch(setOrderedBy(e.target.value))}
            />
          )}

          {searchMode === 'keyword' && (
            <input
              placeholder="Keyword"
              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search.keyword}
              onChange={(e) => dispatch(setKeyword(e.target.value))}
            />
          )}

          {searchMode === 'status' && (
            <select
              className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search.status}
              onChange={(e) => dispatch(setStatus(e.target.value))}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}

          {searchMode === 'date' && (
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="date"
                name="start"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={search.dateRange.start ?? ''}
                onChange={handleDateRangeChange}
              />
              <input
                type="date"
                name="end"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={search.dateRange.end ?? ''}
                onChange={handleDateRangeChange}
              />
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Search
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Searchbar;
