import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

// Format currency
const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
};

// 1. Revenue Over Time Chart
interface RevenueChartProps {
  data?: { month: string; revenue: number; bookings: number }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = (Array.isArray(data) && data.length > 0) ? data : [
    { month: 'T1', revenue: 450000000, bookings: 45 },
    { month: 'T2', revenue: 520000000, bookings: 52 },
    { month: 'T3', revenue: 610000000, bookings: 58 },
    { month: 'T4', revenue: 590000000, bookings: 55 },
    { month: 'T5', revenue: 720000000, bookings: 68 },
    { month: 'T6', revenue: 810000000, bookings: 75 },
    { month: 'T7', revenue: 842500000, bookings: 82 }
  ];

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
          <XAxis dataKey="month" stroke="#727786" />
          <YAxis
            stroke="#727786"
            tickFormatter={(value) => `${value / 1000000}M`}
          />
          <Tooltip
            formatter={(value: any) => [formatVND(value), 'Doanh thu']}
            labelFormatter={(label) => `Tháng: ${label}`}
          />
          <Area type="monotone" dataKey="revenue" stroke="#1677ff" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Fleet Distribution Pie Chart
interface FleetPieChartProps {
  data?: { name: string; value: number; color: string }[];
}

export const FleetPieChart: React.FC<FleetPieChartProps> = ({ data }) => {
  const chartData = (Array.isArray(data) && data.length > 0) ? data : [
    { name: 'Có sẵn', value: 20, color: '#16a34a' },
    { name: 'Đang thuê', value: 12, color: '#2563eb' },
    { name: 'Bảo dưỡng', value: 3, color: '#f59e0b' },
    { name: 'Khác', value: 1, color: '#94a3b8' }
  ];

  return (
    <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Số lượng xe']} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Vehicle Type Revenue Bar Chart
interface TypeBarChartProps {
  data: { category?: string; type?: string; count?: number; value?: number; revenue?: number }[];
}

export const TypeBarChart: React.FC<TypeBarChartProps> = ({ data = [] }) => {
  const chartData = data.map(item => ({
    name: item.type || item.category || 'Khác',
    revenue: item.revenue || 0,
    count: item.count ?? item.value ?? 0
  }));

  const hasRevenue = chartData.some(d => d.revenue > 0);
  const dataKey = hasRevenue ? 'revenue' : 'count';

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
          <XAxis dataKey="name" stroke="#727786" />
          <YAxis 
            stroke="#727786" 
            tickFormatter={(value) => hasRevenue ? `${value / 1000000}M` : `${value} xe`} 
          />
          <Tooltip 
            formatter={(value: any) => [hasRevenue ? formatVND(value) : `${value} xe`, hasRevenue ? 'Doanh thu' : 'Số lượng xe']} 
          />
          <Bar dataKey={dataKey} fill="#0053d0" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1677ff' : '#0053d0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
