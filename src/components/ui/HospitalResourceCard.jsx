import React from 'react';
import { BedDouble, Activity, AlertCircle, TrendingUp, Navigation } from 'lucide-react';
import './HospitalResourceCard.css';

const HospitalResourceCard = ({ hospital }) => {
    const {
        name,
        type,
        rating,
        city,
        generalBeds,
        icuStatus,
        emergencyBeds,
        occupancyPercent,
        waitTime
    } = hospital;

    const getStatusColor = (percent) => {
        if (percent > 85) return '#ef4444'; // Critical
        if (percent > 65) return '#f59e0b'; // Warning
        return '#10b981'; // Optimal
    };

    return (
        <div className="hospital-res-card glass-panel hover-scale">
            <div className="card-header">
                <div className="header-info">
                    <h3>{name}</h3>
                    <div className="header-meta">
                        <span className="type-badge">{type}</span>
                        <span className="location">{city}</span>
                        <div className="rating">
                            <span>★</span> {rating}
                        </div>
                    </div>
                </div>
                <div className="occupancy-indicator" style={{ borderBottomColor: getStatusColor(occupancyPercent) }}>
                    <span className="percent">{occupancyPercent}%</span>
                    <span className="label">Occupied</span>
                </div>
            </div>

            <div className="resource-stats">
                <div className="res-item">
                    <div className="res-label">
                        <BedDouble size={16} />
                        <span>General Beds</span>
                    </div>
                    <div className="res-value">
                        <span className="available">{generalBeds.available}</span>
                        <span className="total">/ {generalBeds.total}</span>
                    </div>
                    <div className="res-bar-bg">
                        <div 
                            className="res-bar-fill" 
                            style={{ 
                                width: `${(generalBeds.occupied / generalBeds.total) * 100}%`,
                                backgroundColor: getStatusColor((generalBeds.occupied / generalBeds.total) * 100)
                            }}
                        />
                    </div>
                </div>

                <div className="res-item">
                    <div className="res-label">
                        <Activity size={16} />
                        <span>ICU Status</span>
                    </div>
                    <div className="res-value">
                        <span className="available">{icuStatus.available}</span>
                        <span className="total">/ {icuStatus.total}</span>
                    </div>
                    <div className="res-bar-bg">
                        <div 
                            className="res-bar-fill" 
                            style={{ 
                                width: `${(icuStatus.occupied / icuStatus.total) * 100}%`,
                                backgroundColor: getStatusColor((icuStatus.occupied / icuStatus.total) * 100)
                            }}
                        />
                    </div>
                </div>

                <div className="res-item">
                    <div className="res-label">
                        <AlertCircle size={16} />
                        <span>Emergency</span>
                    </div>
                    <div className="res-value">
                        <span className="available">{emergencyBeds.available}</span>
                        <span className="total">/ {emergencyBeds.total}</span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <div className="wait-time">
                    <TrendingUp size={14} className="trend-icon" />
                    <span>Est. Wait: <strong>{waitTime}m</strong></span>
                </div>
                <button className="navigate-btn">
                    <Navigation size={14} />
                    Route
                </button>
            </div>
        </div>
    );
};

export default HospitalResourceCard;
