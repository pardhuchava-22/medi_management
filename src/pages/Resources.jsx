import React from 'react';
import { BedDouble, Users, UserCheck, Microscope } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/ui/StatCard';
import './Resources.css';

const data = [
    { name: 'ICU', capacity: 20, occupied: 16 },
    { name: 'General', capacity: 100, occupied: 85 },
    { name: 'Pediatrics', capacity: 30, occupied: 22 },
    { name: 'Cardiology', capacity: 25, occupied: 20 },
    { name: 'Emergency', capacity: 40, occupied: 35 },
];

const Resources = () => {
    return (
        <div className="resources-container">
            <div className="metrics-row">
                <StatCard title="Total Beds" value="215" trend="neutral" icon={BedDouble} color="primary" />
                <StatCard title="Occupied" value="178" trend="up" change="+5%" icon={BedDouble} color="warning" />
                <StatCard title="Staff on Duty" value="48" trend="neutral" icon={UserCheck} color="accent" />
                <StatCard title="Equipment Usage" value="82%" trend="up" change="+3%" icon={Microscope} color="danger" />
            </div>

            <div className="resources-grid">
                <div className="chart-section">
                    <div className="section-header">
                        <h2>Bed Utilization by Department</h2>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
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
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#f8fafc',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    itemStyle={{ color: '#cbd5e1' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="capacity" name="Total Capacity" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="occupied" name="Occupied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="side-panel">
                    <div className="section-header">
                        <h2>Staff Allocation</h2>
                        <button className="btn-secondary">Manage</button>
                    </div>
                    <div className="staff-list">
                        <div className="staff-item">
                            <div className="staff-info">
                                <span className="staff-role">ICU Nurses</span>
                                <span className="staff-count">12 Active</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '90%', backgroundColor: '#ef4444' }}></div>
                            </div>
                        </div>
                        <div className="staff-item">
                            <div className="staff-info">
                                <span className="staff-role">General Ward</span>
                                <span className="staff-count">24 Active</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '75%', backgroundColor: '#10b981' }}></div>
                            </div>
                        </div>
                        <div className="staff-item">
                            <div className="staff-info">
                                <span className="staff-role">Emergency</span>
                                <span className="staff-count">8 Active</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '85%', backgroundColor: '#f59e0b' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
