import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, ArrowRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import './Alerts.css';

const Alerts = () => {
    return (
        <div className="alerts-container">
            <div className="metrics-row">
                <StatCard title="Critical Alerts" value="3" change="+1" trend="up" icon={AlertCircle} color="danger" />
                <StatCard title="High Priority" value="5" change="+2" trend="up" icon={AlertTriangle} color="warning" />
                <StatCard title="Medium Priority" value="4" change="-1" trend="down" icon={Info} color="accent" />
                <StatCard title="Resolved Today" value="12" icon={CheckCircle} color="primary" />
            </div>

            <div className="alert-list-section">
                <div className="section-header">
                    <h2>Active Alerts</h2>
                    <div className="filter-actions">
                        <button className="filter-btn active">All</button>
                        <button className="filter-btn">Critical</button>
                        <button className="filter-btn">High</button>
                    </div>
                </div>

                <div className="alert-list">
                    <div className="alert-card critical">
                        <div className="alert-header">
                            <div className="alert-title-row">
                                <span className="priority-tag critical">CRITICAL</span>
                                <h3>ICU Capacity Critical - Predicted Overload</h3>
                            </div>
                            <span className="alert-time">10 mins ago</span>
                        </div>
                        <p>AI predictive model indicates severe capacity breach within 4 hours due to incoming trauma cases.</p>
                        <div className="action-panel">
                            <h4>Recommended Actions</h4>
                            <div className="action-items">
                                <div className="action-item">
                                    <span>Transfer 3 Stable Patients to Step-down Unit</span>
                                    <button className="action-btn">Execute <ArrowRight size={14} /></button>
                                </div>
                                <div className="action-item">
                                    <span>Schedule On-Call Trauma Nurses</span>
                                    <button className="action-btn">Notify</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert-card high">
                        <div className="alert-header">
                            <div className="alert-title-row">
                                <span className="priority-tag high">HIGH</span>
                                <h3>Oxygen Supply Low - Zone B</h3>
                            </div>
                            <span className="alert-time">25 mins ago</span>
                        </div>
                        <p>Main tank pressure dropped below 15%. Refill truck estimated arrival in 20m.</p>
                        <div className="action-panel">
                            <h4>Recommended Actions</h4>
                            <div className="action-items">
                                <div className="action-item">
                                    <span>Switch to Backup Cylinder Bank</span>
                                    <button className="action-btn">Execute</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert-card medium">
                        <div className="alert-header">
                            <div className="alert-title-row">
                                <span className="priority-tag medium">MEDIUM</span>
                                <h3>Pharmacy Stock Alert: Antibiotics</h3>
                            </div>
                            <span className="alert-time">1h ago</span>
                        </div>
                        <p>Ceftriaxone stock below threshold (50 units remaining).</p>
                        <div className="action-panel">
                            <div className="action-items">
                                <div className="action-item">
                                    <span>Place Restock Order</span>
                                    <button className="action-btn">Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alerts;
