import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import OccupancyChart from '../components/charts/OccupancyChart';
import './PredictiveAnalytics.css';

const PredictiveAnalytics = () => {
    return (
        <div className="predictive-container">
            <div className="metrics-row">
                <StatCard
                    title="Predicted Peak Occupancy"
                    value="92%"
                    change="+5%"
                    trend="up"
                    icon={TrendingUp}
                    color="warning"
                />
                <StatCard
                    title="Confidence Score"
                    value="88%"
                    trend="neutral"
                    icon={TrendingUp}
                    color="primary"
                />
                <StatCard
                    title="Outliers Detected"
                    value="2"
                    trend="down"
                    icon={AlertTriangle}
                    color="danger"
                />
            </div>

            <div className="forecast-section">
                <div className="section-header">
                    <h2>14-Day Admission Forecast</h2>
                    <div className="actions">
                        <button className="btn-secondary">Export Data</button>
                    </div>
                </div>
                <div className="chart-container-large">
                    <OccupancyChart />
                </div>
            </div>

            <div className="insights-grid">
                <div className="ai-insight-card critical">
                    <div className="insight-header">
                        <AlertTriangle size={20} />
                        <h3>HIGH ALERT: Capacity Breach</h3>
                    </div>
                    <p>Surge expected on Feb 17 due to post-festival activity. ICU demand predicted to exceed 90%.</p>
                    <div className="insight-actions">
                        <button className="btn-sm primary">Increase Ward Capacity</button>
                        <button className="btn-sm secondary">View Details</button>
                    </div>
                </div>

                <div className="ai-insight-card">
                    <div className="insight-header">
                        <TrendingUp size={20} />
                        <h3>Staffing Optimization</h3>
                    </div>
                    <p>Nurses on shift 2 are underutilized. Consider reallocation to ER for the weekend.</p>
                    <div className="insight-actions">
                        <button className="btn-sm secondary">Reallocate Staff</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
