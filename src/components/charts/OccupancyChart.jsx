
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', actual: 65, predicted: 70 },
    { name: 'Tue', actual: 72, predicted: 75 },
    { name: 'Wed', actual: 78, predicted: 82 },
    { name: 'Thu', actual: 85, predicted: 88 },
    { name: 'Fri', actual: 82, predicted: 85 },
    { name: 'Sat', actual: 75, predicted: 80 },
    { name: 'Sun', actual: 70, predicted: 72 },
];

const OccupancyChart = () => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#f8fafc',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ color: '#cbd5e1' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorOccupancy)"
                        name="Actual"
                    />
                    <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorPredicted)"
                        name="Forecast"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OccupancyChart;

