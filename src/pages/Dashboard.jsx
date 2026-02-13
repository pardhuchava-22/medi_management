import React from 'react';
import { Users, BedDouble, Activity, AlertTriangle, ArrowUpRight, CloudRain } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import OccupancyChart from '../components/charts/OccupancyChart';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Current Occupancy"
                    value="87%"
                    change="+12%"
                    trend="up"
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="ICU Availability"
                    value="4 Beds"
                    change="-2"
                    trend="down"
                    icon={BedDouble}
                    color="danger"
                />
                <StatCard
                    title="Patient Inflow"
                    value="142"
                    change="+18%"
                    trend="up"
                    icon={Activity}
                    color="accent"
                />
                <StatCard
                    title="Emergency Alerts"
                    value="3"
                    change="+1"
                    trend="up"
                    icon={AlertTriangle}
                    color="warning"
                />
            </div>

            <div className="dashboard-main-grid">
                {/* Main Chart Section */}
                <div className="chart-section main-chart">
                    <div className="section-header">
                        <h2>7-Day Occupancy Forecast</h2>
                        <button className="btn-secondary">View Details</button>
                    </div>
                    <OccupancyChart />
                </div>

                {/* Side Panel - Disease Trends */}
                <div className="side-panel">
                    <div className="section-header">
                        <h2>Top Disease Trends</h2>
                    </div>
                    <div className="disease-list">
                        <div className="disease-item">
                            <div className="disease-info">
                                <span className="rank">1</span>
                                <div>
                                    <span className="disease-name">Dengue Fever</span>
                                    <span className="disease-type">Vector-borne</span>
                                </div>
                            </div>
                            <div className="disease-trend up">
                                <ArrowUpRight size={16} />
                                <span>15%</span>
                            </div>
                        </div>

                        <div className="disease-item">
                            <div className="disease-info">
                                <span className="rank">2</span>
                                <div>
                                    <span className="disease-name">Viral Pyrexia</span>
                                    <span className="disease-type">Seasonal</span>
                                </div>
                            </div>
                            <div className="disease-trend up">
                                <ArrowUpRight size={16} />
                                <span>8%</span>
                            </div>
                        </div>

                        <div className="disease-item">
                            <div className="disease-info">
                                <span className="rank">3</span>
                                <div>
                                    <span className="disease-name">Gastroenteritis</span>
                                    <span className="disease-type">Water-borne</span>
                                </div>
                            </div>
                            <div className="disease-trend down">
                                <ArrowUpRight size={16} style={{ transform: 'rotate(90deg)' }} />
                                <span>5%</span>
                            </div>
                        </div>
                    </div>

                    <div className="weather-alert">
                        <div className="weather-header">
                            <CloudRain size={20} />
                            <span>Weather Impact AI</span>
                        </div>
                        <p>Heavy rainfall predicted for next 48h. Expect 20% surge in respiratory & water-borne cases.</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
