import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OccupancyChart = ({ data }) => {
    // Fallback data if none provided
    const chartData = data || [
        { name: 'Mon', actual: 65, predicted: 70 },
        { name: 'Tue', actual: 72, predicted: 75 },
        { name: 'Wed', actual: 78, predicted: 82 },
        { name: 'Thu', actual: 85, predicted: 88 },
        { name: 'Fri', actual: 82, predicted: 85 },
        { name: 'Sat', actual: 75, predicted: 80 },
        { name: 'Sun', actual: 70, predicted: 72 },
    ];

    return (
        <div className="occupancy-chart-container" style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
                        dy={15}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
                        domain={[0, 100]}
                        unit="%"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid var(--border-highlight)',
                            borderRadius: 'var(--radius-md)',
                            color: '#fff',
                            backdropFilter: 'blur(12px)',
                            padding: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                        cursor={{ stroke: 'var(--border-highlight)', strokeWidth: 1 }}
                    />
                    {/* Shadow Area for Confidence Bounds */}
                    {chartData[0]?.upperBound && (
                        <Area
                            type="monotone"
                            dataKey="upperBound"
                            stroke="none"
                            fill="var(--accent)"
                            fillOpacity={0.05}
                            animationDuration={1000}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorOccupancy)"
                        name="Live Occupancy"
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        fillOpacity={1}
                        fill="url(#colorPredicted)"
                        name="AI Forecast"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OccupancyChart;

