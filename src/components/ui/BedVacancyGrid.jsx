import React, { useState, useMemo } from 'react';
import { BedDouble, Activity, AlertTriangle, Clock, MapPin, Search, ChevronRight } from 'lucide-react';
import './BedVacancyGrid.css';

const BedVacancyGrid = ({ hospitals, onHospitalSelect, selectedHospital }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('availability'); 
  const [filterCity, setFilterCity] = useState('all');

  const cities = useMemo(() => [...new Set(hospitals.map(h => h.city))], [hospitals]);

  const filtered = useMemo(() => {
    return hospitals
      .filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = filterCity === 'all' || h.city === filterCity;
        return matchesSearch && matchesCity;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'availability': return b.generalBeds.available - a.generalBeds.available;
          case 'occupancy': return a.occupancyPercent - b.occupancyPercent;
          case 'name': return a.name.localeCompare(b.name);
          case 'distance': return (a.distance || 999) - (b.distance || 999);
          case 'wait': return a.waitTime - b.waitTime;
          default: return 0;
        }
      });
  }, [hospitals, searchTerm, sortBy, filterCity]);

  const getOccupancyClass = (occ) => {
    if (occ > 85) return 'occ-critical';
    if (occ > 70) return 'occ-moderate';
    return 'occ-good';
  };

  return (
    <div className="bed-vacancy-section">
      <div className="bv-header">
        <div className="bv-title-side">
          <div className="bv-title-row">
            <BedDouble size={24} className="bv-icon" />
            <h2>Real-Time Bed Vacancies</h2>
          </div>
          <div className="bv-live-status">
            <span className="bv-live-dot"></span>
            <span className="bv-live-text">LIVE MONITORING</span>
          </div>
        </div>
        
        <div className="bv-controls">
          <div className="bv-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bv-filters">
            <div className="bv-select-wrapper">
              <select className="bv-filter" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                <option value="all">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="bv-select-wrapper">
              <select className="bv-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="availability">Most Beds</option>
                <option value="occupancy">Lowest Occupancy</option>
                <option value="distance">Nearest</option>
                <option value="wait">Shortest Wait</option>
                <option value="name">A–Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bv-grid animate-fade-in">
        {filtered.map(hospital => {
          const occClass = getOccupancyClass(hospital.occupancyPercent);
          const isSelected = selectedHospital?.id === hospital.id;

          return (
            <div
              key={hospital.id}
              className={`bv-card-premium ${occClass} ${isSelected ? 'active' : ''}`}
              onClick={() => onHospitalSelect(hospital)}
            >
              <div className="bv-card-header">
                <div className="bv-name-block">
                  <h4>{hospital.name}</h4>
                  <div className="bv-meta">
                    <span>{hospital.city}</span>
                    <span className="dot"></span>
                    <span>{hospital.type}</span>
                  </div>
                </div>
                <div className={`bv-occ-badge ${occClass}`}>
                  {hospital.occupancyPercent}%
                </div>
              </div>

              <div className="bv-metrics-grid">
                <div className="bv-metric-item">
                  <div className="bv-m-head">
                    <span className="bv-m-lab"><BedDouble size={14} /> General</span>
                    <span className="bv-m-val">{hospital.generalBeds.available}<small>/{hospital.generalBeds.total}</small></span>
                  </div>
                  <div className="bv-m-track">
                    <div className="bv-m-fill general" style={{ width: `${(hospital.generalBeds.occupied / hospital.generalBeds.total) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bv-metric-item">
                  <div className="bv-m-head">
                    <span className="bv-m-lab"><Activity size={14} /> ICU</span>
                    <span className="bv-m-val">{hospital.icuStatus.available}<small>/{hospital.icuStatus.total}</small></span>
                  </div>
                  <div className="bv-m-track">
                    <div className="bv-m-fill icu" style={{ width: `${(hospital.icuStatus.occupied / hospital.icuStatus.total) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bv-metric-item">
                  <div className="bv-m-head">
                    <span className="bv-m-lab"><AlertTriangle size={14} /> Emergency</span>
                    <span className="bv-m-val">{hospital.emergencyBeds.available}<small>/{hospital.emergencyBeds.total}</small></span>
                  </div>
                  <div className="bv-m-track">
                    <div className="bv-m-fill emergency" style={{ width: `${(hospital.emergencyBeds.occupied / hospital.emergencyBeds.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bv-card-footer">
                <div className="bv-quick-stats">
                  <div className="bv-stat">
                    <Clock size={12} />
                    <span>{hospital.waitTime} min</span>
                  </div>
                  {hospital.distance !== undefined && (
                    <div className="bv-stat">
                      <MapPin size={12} />
                      <span>{hospital.distance} km</span>
                    </div>
                  )}
                </div>
                <button className="bv-details-cta">
                  Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BedVacancyGrid;
