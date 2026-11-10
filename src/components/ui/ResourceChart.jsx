import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ResourceChart.css';

const ResourceChart = ({ data }) => {
    // data is an array: [{ name: 'General', value: 1200, color: '#3b82f6' }, ...]
    
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip-res">
                    <p className="label">{`${payload[0].name}`}</p>
                    <p className="value">{`${payload[0].value} Beds Available`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="resource-chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="legend-text">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ResourceChart;
