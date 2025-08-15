import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InventoryAnalytics = ({ AssetItems }) => {
  // Extract unique categories and calculate counts/quantities
  const categories = [...new Set(AssetItems.map(item => item.category))];
  
  const categoryData = categories.map(category => ({
    name: category,
    itemCount: AssetItems.filter(item => item.category === category).length,
    totalQuantity: AssetItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.quantity, 0)
  }));

  // Color palette for the chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="max-w-6xl mx-auto mb-5 px-4 sm:px-6">
      <div className="grid grid-cols-1">
        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-9 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Assets by Category</h3>
    
          <div className="h-64 sm:h-72 md:h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="itemCount"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    value,
                    `${props.payload.name} (${props.payload.totalQuantity} units)`,
                  ]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => (
                    <span className="text-xs sm:text-sm text-gray-600">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>

      
     
  );
};

export default InventoryAnalytics