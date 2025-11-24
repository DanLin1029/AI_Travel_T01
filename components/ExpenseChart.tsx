import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity, Category } from '../types';

interface Props {
  activities: Activity[];
}

const COLORS = {
  [Category.Transport]: '#64748b', // Slate
  [Category.Food]: '#f97316',      // Orange
  [Category.Sightseeing]: '#10b981', // Emerald
  [Category.Shopping]: '#ec4899',   // Pink
  [Category.Accommodation]: '#6366f1', // Indigo
  [Category.Flexible]: '#9ca3af',   // Gray
};

const CategoryLabels: Record<Category, string> = {
  [Category.Transport]: '交通',
  [Category.Food]: '美食',
  [Category.Sightseeing]: '景點',
  [Category.Shopping]: '購物',
  [Category.Accommodation]: '住宿',
  [Category.Flexible]: '彈性',
};

const ExpenseChart: React.FC<Props> = ({ activities }) => {
  const data = Object.values(Category).map(cat => {
    const total = activities
      .filter(a => a.category === cat && a.currency === 'JPY') // Only counting JPY for this chart
      .reduce((sum, a) => sum + a.cost, 0);
    return { name: CategoryLabels[cat], value: total, key: cat };
  }).filter(d => d.value > 0);

  const totalSpent = data.reduce((acc, curr) => acc + curr.value, 0);

  if (totalSpent === 0) {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-jp-bg rounded-lg border border-dashed border-gray-200">
            <p className="font-serif text-sm">尚未記錄日幣支出</p>
        </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-zen border border-gray-100 mt-4">
      <h3 className="text-lg font-serif font-bold text-gray-800 mb-4 text-center">旅費分佈 (JPY)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.key as Category]} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => `¥${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center border-t border-gray-50 pt-4">
        <span className="text-gray-400 text-xs uppercase tracking-widest">總預估花費</span>
        <div className="text-3xl font-serif text-gray-800 mt-1">¥{totalSpent.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default ExpenseChart;