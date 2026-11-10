import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BedDouble, Activity, AlertTriangle, ArrowUpRight,
  CloudRain, MapPin, Navigation, RefreshCw, Locate, Sparkles, ChevronRight, HeartPulse, Download
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import OccupancyChart from '../components/charts/OccupancyChart';
import HospitalMap from '../components/map/HospitalMap';
import NearbyHospitals from '../components/ui/NearbyHospitals';
import BedVacancyGrid from '../components/ui/BedVacancyGrid';
import { diseaseTrendsData } from '../data/diseaseData';
import {
  generateAllHospitalData,
  simulateUpdate,
  getNearbyHospitals,
  getSmartSuggestions,
  regionCenters,
} from '../data/tamilNaduHospitals';
import './Dashboard.css';

const Dashboard = () => {
  // Core state
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [activeScenario, setActiveScenario] = useState('general');
  const [activeRegion, setActiveRegion] = useState('All Regions');

  // User location
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState([9.72, 77.90]);
  const [mapZoom, setMapZoom] = useState(10);

  // Weather
  const [weather, setWeather] = useState(null);

  // Disease trends
  const [diseaseTrends] = useState(diseaseTrendsData);

  // Initialize hospital data
  useEffect(() => {
    const data = generateAllHospitalData();
    setHospitals(data);
  }, []);

  // Real-time simulation - update hospital data every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHospitals(prev => prev.map(h => simulateUpdate(h)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Geolocation
  const requestLocation = useCallback(() => {
    setIsLocating(true);
    setLocationStatus('Detecting location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setLocationStatus('Location detected');
          setIsLocating(false);
          fetchWeather(loc.lat, loc.lng);
        },
        () => {
          // Default to Madurai if denied
          const defaultLoc = { lat: 9.9252, lng: 78.1198 };
          setUserLocation(defaultLoc);
          setLocationStatus('Using default (Madurai)');
          setIsLocating(false);
          fetchWeather(defaultLoc.lat, defaultLoc.lng);
        }
      );
    } else {
      const defaultLoc = { lat: 9.9252, lng: 78.1198 };
      setUserLocation(defaultLoc);
      setLocationStatus('Geolocation not supported');
      setIsLocating(false);
      fetchWeather(defaultLoc.lat, defaultLoc.lng);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Weather
  const fetchWeather = (lat, lng) => {
    const weatherBaseUrl = import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast';
    fetch(`${weatherBaseUrl}?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(res => res.json())
      .then(data => setWeather(data.current_weather))
      .catch(() => setWeather({ temperature: 32, weathercode: 1 }));
  };

  const getWeatherInsight = (code) => {
    if (code === undefined) return { text: 'Loading weather...', risk: 'neutral' };
    if (code <= 3) return { text: 'Clear weather. Low risk of vector-borne spread.', risk: 'positive' };
    if (code >= 51 && code <= 67) return { text: 'Rain detected. Moderate risk of water-borne diseases.', risk: 'warning' };
    if (code >= 95) return { text: 'Severe storms. High emergency risk.', risk: 'critical' };
    return { text: 'Variable weather. Monitor patient inflow.', risk: 'neutral' };
  };

  const weatherInsight = useMemo(() => getWeatherInsight(weather?.weathercode), [weather]);

  // Handle hospital selection
  const handleHospitalSelect = useCallback((hospital) => {
    if (!hospital) return;
    setSelectedHospital(hospital);
    setMapCenter([hospital.lat, hospital.lng]);
    setMapZoom(14);
  }, []);

  // Handle region switching
  const handleRegionChange = useCallback((region) => {
    setActiveRegion(region);
    const center = regionCenters[region];
    if (center) {
      setMapCenter([center.lat, center.lng]);
      setMapZoom(center.zoom);
    }
    setSelectedHospital(null);
  }, []);

  // Filter hospitals by active region
  const filteredHospitals = useMemo(() => {
    if (activeRegion === 'All Regions' || !activeRegion) return hospitals;
    return hospitals.filter(h => h.district === activeRegion || h.city === activeRegion);
  }, [hospitals, activeRegion]);

  // Nearby hospitals with distances (based on filtered list)
  const hospitalsWithDistance = useMemo(() => {
    if (!userLocation || filteredHospitals.length === 0) return filteredHospitals;
    return getNearbyHospitals(userLocation.lat, userLocation.lng, filteredHospitals, 200);
  }, [userLocation, filteredHospitals]);

  // Dashboard-wide aggregation
  const aggregateStats = useMemo(() => {
    if (filteredHospitals.length === 0) {
      return {
        totalBeds: 0,
        availableBeds: 0,
        icuAvailable: 0,
        emergencyAvailable: 0,
        avgOccupancy: 0
      };
    }

    const totals = filteredHospitals.reduce((acc, h) => {
      acc.totalBeds += h.totalBeds || 0;
      acc.availableBeds += h.generalBeds?.available || 0;
      acc.icuAvailable += h.icuStatus?.available || 0;
      acc.emergencyAvailable += h.emergencyBeds?.available || 0;
      acc.totalOccupied += h.generalBeds?.occupied || 0;
      return acc;
    }, { totalBeds: 0, availableBeds: 0, icuAvailable: 0, emergencyAvailable: 0, totalOccupied: 0 });

    return {
      totalBeds: totals.totalBeds,
      availableBeds: totals.availableBeds,
      icuAvailable: totals.icuAvailable,
      emergencyAvailable: totals.emergencyAvailable,
      avgOccupancy: Math.round((totals.totalOccupied / totals.totalBeds) * 100) || 0
    };
  }, [filteredHospitals]);

  // Smart suggestions based on scenario
  const suggestions = useMemo(() => {
    if (!userLocation || hospitals.length === 0) return [];
    return getSmartSuggestions(userLocation.lat, userLocation.lng, hospitals, activeScenario);
  }, [userLocation, hospitals, activeScenario]);

  // Dynamic Forecast Data
  const forecastData = useMemo(() => {
    if (hospitals.length === 0) return [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const currentBase = aggregateStats.avgOccupancy;
    
    return Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (today + i) % 7;
      const dayName = days[dayIndex];
      // Generate some realistic variation (+/- 10%)
      const variation = Math.sin(i * 1.5) * 8; 
      const predicted = Math.min(95, Math.max(40, Math.round(currentBase + variation)));
      // Actual is only for the first day (today)
      return {
        name: dayName,
        actual: i === 0 ? currentBase : null,
        predicted: predicted
      };
    });
  }, [hospitals.length, aggregateStats.avgOccupancy]);

  // Sidebar trends (can be more dynamic too)
  const sortedDiseaseTrends = useMemo(() => {
    return [...diseaseTrends].sort((a, b) => b.value - a.value);
  }, [diseaseTrends]);

  return (
    <div className="dashboard-layout animate-fade-in">
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-logo">
            <Activity size={24} />
          </div>
          <div className="brand-text">
            <h1>Tamil Nadu Hospital Command Center</h1>
            <p>Real-time predictive resource monitoring across the region</p>
          </div>
        </div>

        <div className="header-controls">
          <div className="location-pill glass-panel">
            <MapPin size={16} className="loc-icon" />
            <span className="loc-text">{locationStatus}</span>
            <button className="loc-update-btn" onClick={requestLocation} disabled={isLocating}>
              <RefreshCw size={14} className={isLocating ? 'spin' : ''} />
            </button>
          </div>
          
          <div className="region-selector glass-panel">
            {Object.keys(regionCenters).map((region) => (
              <button
                key={region}
                className={`region-btn ${activeRegion === region ? 'active' : ''}`}
                onClick={() => handleRegionChange(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="stats-container">
        <StatCard
          title="Total Availability"
          value={aggregateStats.availableBeds}
          change={`${Math.round((aggregateStats.availableBeds / aggregateStats.totalBeds) * 100)}% beds free`}
          trend="neutral"
          icon={BedDouble}
          color="primary"
        />
        <StatCard
          title="ICU Status"
          value={aggregateStats.icuAvailable}
          change={aggregateStats.icuAvailable < 50 ? "High Demand" : "Adequate"}
          trend={aggregateStats.icuAvailable < 50 ? "down" : "up"}
          icon={Activity}
          color={aggregateStats.icuAvailable < 50 ? "danger" : "accent"}
        />
        <StatCard
          title="Regional Load"
          value={`${aggregateStats.avgOccupancy}%`}
          change={aggregateStats.avgOccupancy > 85 ? "Critical Load" : "Balanced"}
          trend={aggregateStats.avgOccupancy > 85 ? "up" : "neutral"}
          icon={Users}
          color={aggregateStats.avgOccupancy > 85 ? "warning" : "success"}
        />
        <StatCard
          title="Emergency Reserve"
          value={aggregateStats.emergencyAvailable}
          change="Available Now"
          trend="up"
          icon={AlertTriangle}
          color={aggregateStats.emergencyAvailable < 30 ? "danger" : "warning"}
        />
      </div>

      {/* Featured AI Diagnostics: Diabetes-Related NAFLD */}
      <div className="nafld-dashboard-banner glass-panel">
        <div className="nafld-banner-left">
          <div className="nafld-badge">
            <Sparkles size={14} /> Explainable AI Project · KARE CSE
          </div>
          <h3>Early Diagnosis of Diabetes-Related NAFLD / MASLD</h3>
          <p>
            50%+ of Type-2 Diabetes patients are affected by NAFLD — often going undiagnosed until advanced fibrosis.
            Screen patient clinical & laboratory biomarkers with our multi-model ensemble (Random Forest · SVM · CatBoost · ANN) and LIME explainability.
          </p>
        </div>
        <div className="nafld-banner-actions">
          <Link to="/nafld" className="nafld-launch-btn">
            <HeartPulse size={18} />
            <span>Launch NAFLD AI Diagnostics</span>
            <ChevronRight size={16} />
          </Link>
          <a
            href="/NAFLD_Diabetes_Clinical_Dataset.pdf"
            download="NAFLD_Diabetes_Clinical_Dataset.pdf"
            className="nafld-download-btn"
            title="Download NAFLD Clinical Research Dataset PDF (5,847 records, 28 features)"
          >
            <Download size={16} />
            <span>Download Dataset (PDF)</span>
          </a>
        </div>
      </div>

      <main className="dashboard-grid">
        {/* Left Side: Map and Bed Grid */}
        <div className="grid-main-col">
          <div className="map-wrapper glass-panel">
            <HospitalMap
              hospitals={hospitalsWithDistance}
              userLocation={userLocation}
              selectedHospital={selectedHospital}
              onHospitalSelect={handleHospitalSelect}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>

          <div className="vacancy-grid-wrapper glass-panel">
            <BedVacancyGrid
              hospitals={hospitalsWithDistance}
              onHospitalSelect={handleHospitalSelect}
              selectedHospital={selectedHospital}
            />
          </div>
        </div>

        {/* Right Side: Suggestions & Insights */}
        <div className="grid-side-col">
          <NearbyHospitals
            suggestions={suggestions}
            onHospitalSelect={handleHospitalSelect}
            selectedHospital={selectedHospital}
            activeScenario={activeScenario}
            onScenarioChange={setActiveScenario}
            userLocation={userLocation}
          />

          <div className="insights-panel glass-panel">
            <div className="insights-header">
              <h2>Analytics & Forecast</h2>
              <div className="live-pill"><RefreshCw size={10} className="spin" /> Live Sync</div>
            </div>
            
            <div className="forecast-chart-area">
              <OccupancyChart data={forecastData} />
            </div>

            <div className="disease-trends-area">
              <div className="d-area-header">
                <h3>Disease Pulse</h3>
                <span className="d-area-subtitle">Real-time localized health trends</span>
              </div>
              <div className="disease-list-static">
                {sortedDiseaseTrends.map((disease) => (
                  <div className="disease-row-premium" key={disease.id}>
                    <div className="d-info-col">
                      <span className="d-name">{disease.name}</span>
                      <span className="d-type">{disease.type}</span>
                    </div>
                    <div className="d-value-col">
                      <div className={`d-trend-badge ${disease.trend}`}>
                        {disease.trend === 'up' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowUpRight size={14} strokeWidth={3} style={{transform: 'rotate(90deg)'}} />}
                        <span>{disease.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`weather-impact-alert ${weatherInsight.risk}`}>
              <div className="w-header">
                <CloudRain size={18} />
                <span>Environmental Risk Detection</span>
              </div>
              <p>{weatherInsight.text} (Current Temp: {weather?.temperature || '31'}°C)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
