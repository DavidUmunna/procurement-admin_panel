import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

function CostDashboard({ orders }) {
  const monthlyData = useMemo(() => {
    const grouped = {};

    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      if (!grouped[month]) grouped[month] = 0;

      const totalCost = order.products?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      grouped[month] += totalCost || 0;
    });

    // Convert object to array
    return Object.entries(grouped).map(([month, total]) => ({
      month,
      total,
    }));
  }, [orders]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Monthly Cost Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CostDashboard;
