import { useSelector, useDispatch } from 'react-redux';
import {
  setKeyword,
  setStatus,
  setDateRange,
  resetFilters,
} from '../js/reducer/rootreducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const Searchbar = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const [isMobile, setIsMobile] = useState(false);
  const [searchMode, setSearchMode] = useState('keyword');
  const [isExpanded, setIsExpanded] = useState(false);

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
  };

  const handleClear = () => {
    dispatch(resetFilters());
    setSearchMode('keyword');
    setIsExpanded(false);
  };

  const hasActiveFilters = () => {
    return (
      search.keyword ||
      search.status ||
      search.dateRange.start ||
      search.dateRange.end
    );
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-screen-lg mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md rounded-xl p-4 sm:p-6 space-y-4 mt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-700">Search Requests</h2>
          {hasActiveFilters() && (
            <button
              onClick={handleClear}
              className="text-red-500 text-sm hover:underline flex items-center gap-1"
            >
              <FiX size={14} /> Clear
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full md:w-auto"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
          >
            <option value="keyword">Keyword</option>
            <option value="status">Status</option>
            <option value="date">Date Range</option>
          </select>

          {searchMode === 'keyword' && (
            <input
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
              value={search.keyword}
              onChange={(e) => dispatch(setKeyword(e.target.value))}
            />
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-1 w-full md:w-auto"
          >
            <FiSearch size={16} />
            {!isMobile && 'Search'}
          </motion.button>
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-2">
            {searchMode === 'status' && (
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={search.status}
                onChange={(e) => dispatch(setStatus(e.target.value))}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}

            {searchMode === 'date' && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  name="start"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={search.dateRange.start ?? ''}
                  onChange={handleDateRangeChange}
                />
                <input
                  type="date"
                  name="end"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={search.dateRange.end ?? ''}
                  onChange={handleDateRangeChange}
                />
              </div>
            )}
          </div>
        )}

        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 text-xs hover:underline w-full text-left"
          >
            + Advanced options
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Searchbar;
