import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
    return (
        <div className={`stat-card glass-panel ${color}`}>
            <div className="stat-header">
                <div className={`stat-icon-wrapper ${color}`}>
                    <Icon size={20} />
                </div>
                {change && (
                    <span className={`stat-change ${trend}`}>
                        {change}
                    </span>
                )}
            </div>
            <div className="stat-content">
                <span className="stat-value">{value}</span>
                <span className="stat-title">{title}</span>
            </div>
            <div className={`stat-glow ${color}`}></div>
        </div>
    );
};

export default StatCard;
