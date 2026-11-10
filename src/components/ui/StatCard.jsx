import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
    return (
        <div className={`stat-card glass-panel ${color} hover-scale`}>
            <div className="stat-glow"></div>
            <div className="stat-header">
                <div className="stat-icon-container">
                    <Icon size={24} className="stat-icon" />
                </div>
                {change && (
                    <div className={`stat-badge ${trend}`}>
                        {change}
                    </div>
                )}
            </div>
            <div className="stat-content">
                <div className="stat-value-row">
                    <span className="stat-value">{value}</span>
                </div>
                <span className="stat-title">{title}</span>
            </div>
        </div>
    );
};

export default StatCard;
