import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import { useMemo, useState } from 'react';
import { FiFilter, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Enhanced color palette with better accessibility
const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#6366f1', 
  '#14b8a6', '#ef4444', '#a855f7', '#f43f5e'
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-blue-600">
          Total: <span className="font-semibold">₦{payload[0].value.toLocaleString()}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {payload[0].payload.count} order{payload[0].payload.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

function CostDashboard({ orders }) {
  const [timeRange, setTimeRange] = useState('12'); // Default to last 12 months
  const [showInfo, setShowInfo] = useState(false);

  const { monthlyData, averageCost, highestMonth } = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();
    console.log("current month",cutoffDate.setMonth(now.getMonth()-12))
    // Calculate cutoff date based on selected time range
    if (timeRange === '12') {
      cutoffDate.setMonth(now.getMonth() - 12);
    } else if (timeRange === '6') {
      cutoffDate.setMonth(now.getMonth() - 6);
    } else if (timeRange === '3') {
      cutoffDate.setMonth(now.getMonth() - 3);
    } else {
      // All time - set to very old date
      cutoffDate = new Date(0);
    }

    const grouped = {};
    let totalOrders = 0;
    let totalCost = 0;

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate < cutoffDate) return;

      const month = orderDate.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      if (!grouped[month]) {
        grouped[month] = {
          total: 0,
          count: 0
        };
      }

      const orderTotal = order.products?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0) || 0;

      grouped[month].total += orderTotal;
      grouped[month].count += 1;
      totalCost += orderTotal;
      totalOrders += 1;
    });

    // Convert object to array and sort chronologically
    const dataArray = Object.entries(grouped).map(([month, data]) => ({
      month,
      ...data
    })).sort((a, b) => {
      return new Date(a.month) - new Date(b.month);
    });

    // Calculate statistics
    const avgCost = totalOrders > 0 ? totalCost / totalOrders : 0;
    let highest = { month: '', total: 0 };
    
    dataArray.forEach(item => {
      if (item.total > highest.total) {
        highest = { month: item.month, total: item.total };
      }
    });

    return {
      monthlyData: dataArray,
      averageCost: avgCost,
      highestMonth: highest
    };
  }, [orders, timeRange]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-xl shadow-md mb-8 border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Monthly Cost Analysis</h2>
          <p className="text-sm text-gray-500">
            Visualization of procurement costs over time
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Show chart information"
            >
              <FiInfo size={18} />
            </button>
            
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <p className="text-sm text-gray-700">
                  This chart shows total procurement costs by month. Hover over bars to see details.
                  {highestMonth.month && (
                    <>
                      <br /><br />
                      <span className="font-semibold">Highest month:</span> {highestMonth.month} (₦{highestMonth.total.toLocaleString()})
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <FiFilter className="text-gray-500 ml-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent py-1 pr-2 text-sm focus:outline-none"
            >
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {monthlyData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `₦${value.toLocaleString()}`}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => <span className="text-gray-600">Total Cost</span>}
              />
              <ReferenceLine 
                y={averageCost} 
                stroke="#94a3b8" 
                strokeDasharray="4 4" 
                label={{
                  position: 'top',
                  value: `Avg: ₦${Math.round(averageCost).toLocaleString()}`,
                  fill: '#64748b',
                  fontSize: 12
                }}
              />
              <Bar 
                dataKey="total" 
                name="Total Cost"
                radius={[4, 4, 0, 0]}
              >
                {monthlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold text-blue-600">
                {monthlyData.reduce((sum, month) => sum + month.count, 0)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-500">Total Cost</p>
              <p className="text-xl font-semibold text-green-600">
                ₦{monthlyData.reduce((sum, month) => sum + month.total, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-gray-500">Average Order</p>
              <p className="text-xl font-semibold text-purple-600">
              ₦{Math.round(averageCost).toLocaleString()}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
          <p className="text-lg mb-2">No data available for the selected period</p>
          <p className="text-sm">Try adjusting the time range filter</p>
        </div>
      )}
    </motion.div>
  );
}

export default CostDashboard;