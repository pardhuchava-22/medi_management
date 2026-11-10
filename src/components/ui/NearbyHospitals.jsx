import React, { useState } from 'react';
import {
  MapPin, Clock, BedDouble, Heart, Stethoscope, Star,
  Navigation, Phone, ChevronRight, AlertCircle, Eye,
  Baby, Activity, Zap, Filter
} from 'lucide-react';
import './NearbyHospitals.css';

const scenarioConfig = {
  general: { label: 'General', icon: Stethoscope, color: '#3b82f6', desc: 'Best beds & ratings nearby' },
  emergency: { label: 'Emergency', icon: Zap, color: '#ef4444', desc: 'Fastest emergency access' },
  icu: { label: 'ICU / Critical', icon: Activity, color: '#f59e0b', desc: 'ICU beds available' },
  cardiac: { label: 'Cardiac', icon: Heart, color: '#ec4899', desc: 'Cardiology specialists' },
  pediatric: { label: 'Pediatric', icon: Baby, color: '#8b5cf6', desc: 'Child care specialists' },
  eye: { label: 'Eye Care', icon: Eye, color: '#06b6d4', desc: 'Ophthalmology centers' },
};

const NearbyHospitals = ({ suggestions, onHospitalSelect, selectedHospital, activeScenario, onScenarioChange, userLocation }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getOccupancyColor = (occ) => {
    if (occ > 85) return '#ef4444';
    if (occ > 70) return '#f59e0b';
    return '#10b981';
  };

  const getOccupancyLabel = (occ) => {
    if (occ > 85) return 'Critical';
    if (occ > 70) return 'Moderate';
    return 'Available';
  };

  const getDirectionsUrl = (hospital) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  };

  return (
    <div className="nearby-panel glass-panel">
      {/* Header */}
      <div className="nearby-header">
        <div className="nearby-title-row">
          <div className="nearby-icon-container">
            <MapPin size={20} className="nearby-icon" />
          </div>
          <h3>Nearby Hospitals</h3>
          {suggestions.length > 0 && (
            <span className="nearby-count-badge">{suggestions.length}</span>
          )}
        </div>
        {activeScenario && scenarioConfig[activeScenario] && (
          <p className="nearby-subtitle">{scenarioConfig[activeScenario].desc}</p>
        )}
      </div>

      {/* Scenario Filter Tabs */}
      <div className="scenario-tabs custom-scrollbar-hidden">
        {Object.entries(scenarioConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = activeScenario === key;
          const rgb = hexToRgb(config.color);
          
          return (
            <button
              key={key}
              className={`scenario-tab ${isActive ? 'active' : ''}`}
              onClick={() => onScenarioChange(key)}
              title={config.desc}
              style={isActive ? { 
                '--active-color': config.color,
                '--active-color-rgb': rgb
              } : {}}
            >
              <Icon size={16} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hospital List */}
      <div className="nearby-list custom-scrollbar">
        {suggestions.length === 0 ? (
          <div className="no-results animate-fade-in">
            <AlertCircle size={48} className="no-results-icon" />
            <p>No matches found in this area</p>
            <span>Try adjusting your filters or scenario.</span>
          </div>
        ) : (
          suggestions.map((hospital, index) => {
            const occClass = hospital.occupancyPercent > 85 ? 'occ-critical' : hospital.occupancyPercent > 70 ? 'occ-moderate' : 'occ-good';
            const isSelected = selectedHospital?.id === hospital.id;
            const isExpanded = expandedId === hospital.id;

            return (
              <div
                key={hospital.id}
                className={`hospital-card-premium ${occClass} ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => {
                  onHospitalSelect(hospital);
                  setExpandedId(isExpanded ? null : hospital.id);
                }}
              >
                <div className="card-accent-line"></div>
                
                <div className="h-card-main">
                  <div className="h-card-header">
                    <div className="h-header-grid">
                      <div className="h-rank-col">
                        <div className="h-rank-badge" style={{ 
                          background: index === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                          border: index === 0 ? '1px solid var(--primary-light)' : '1px solid var(--border)',
                          boxShadow: index === 0 ? '0 0 20px var(--primary-glow)' : 'none'
                        }}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="h-info-col">
                        <h4 className="h-name">{hospital.name}</h4>
                        <div className="h-meta-row">
                          <span className="h-district-tag">
                            <MapPin size={10} /> {hospital.district || hospital.city}
                          </span>
                          <span className="h-type-tag">{hospital.type}</span>
                        </div>
                      </div>

                      <div className="h-rating-col">
                        <div className="h-rating-pill">
                          <Star size={10} fill="var(--warning)" color="var(--warning)" />
                          <span>{hospital.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-stats-premium-row">
                    <div className="h-sp-item">
                      <BedDouble size={12} className="h-sp-icon beds" />
                      <div className="h-sp-info">
                        <span className="h-sp-val success">{hospital.generalBeds.available}</span>
                        <span className="h-sp-lab">Beds</span>
                      </div>
                    </div>
                    <div className="h-sp-item">
                      <Activity size={12} className="h-sp-icon icu" />
                      <div className="h-sp-info">
                        <span className="h-sp-val primary">{hospital.icuStatus.available}</span>
                        <span className="h-sp-lab">ICU</span>
                      </div>
                    </div>
                    <div className="h-sp-item">
                      <Clock size={12} className="h-sp-icon wait" />
                      <div className="h-sp-info">
                        <span className="h-sp-val warning">{hospital.waitTime} min</span>
                        <span className="h-sp-lab">Wait</span>
                      </div>
                    </div>
                    <div className="h-sp-item">
                      <Navigation size={12} className="h-sp-icon dist" />
                      <div className="h-sp-info">
                        <span className="h-sp-val accent">{hospital.distance} km</span>
                        <span className="h-sp-lab">Away</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-occupancy-row">
                    <div className="h-meter-bg">
                      <div className={`h-meter-fill ${occClass}`} style={{ width: `${hospital.occupancyPercent}%` }}></div>
                    </div>
                    <span className={`h-occ-text ${occClass}`}>{hospital.occupancyPercent}% Occupied</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="h-card-expanded animate-fade-in">
                    <div className="h-specialties-title">Specialized Services</div>
                    <div className="h-specialties">
                      {hospital.specialties.map((s, i) => (
                        <span key={i} className="h-tag">{s}</span>
                      ))}
                    </div>

                    <div className="h-extra-metrics">
                      <div className="h-ex-item">
                        <div className="h-ex-head">
                          <Zap size={10} /> Emergency Availability
                        </div>
                        <div className="h-ex-bar">
                          <div className="h-ex-fill" style={{ width: `${(hospital.emergencyBeds.available / hospital.emergencyBeds.total) * 100}%` }}></div>
                        </div>
                        <div className="h-ex-footer">
                          <span>{hospital.emergencyBeds.available} Available</span>
                          <span>{hospital.emergencyBeds.total} Total</span>
                        </div>
                      </div>

                      <div className="h-ex-item">
                        <div className="h-ex-head">
                          <Activity size={10} /> Ventilator Support
                        </div>
                        <div className="h-ex-bar">
                          <div className="h-ex-fill" style={{ width: `${(hospital.ventilators.available / hospital.ventilators.total) * 100}%`, background: '#3b82f6' }}></div>
                        </div>
                        <div className="h-ex-footer">
                          <span>{hospital.ventilators.available} Ready</span>
                          <span>{hospital.ventilators.total} Total</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-actions">
                      <a
                        href={getDirectionsUrl(hospital)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-btn-premium directions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-btn-content">
                          <Navigation size={16} />
                          <div className="h-btn-text">
                            <span className="btn-main">Get Directions</span>
                            <span className="btn-sub">Open in Google Maps</span>
                          </div>
                        </div>
                      </a>
                      <a
                        href={`tel:${hospital.contact}`}
                        className="h-btn-premium call"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-btn-content">
                          <Phone size={16} />
                          <div className="h-btn-text">
                            <span className="btn-main">Call Hospital</span>
                            <span className="btn-sub">Instant Support</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
                
                <div className={`h-expand-chevron ${isExpanded ? 'active' : ''}`}>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NearbyHospitals;
