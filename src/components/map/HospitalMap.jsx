import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HospitalMap.css';

// Fix leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map layer options - 100% free, zero API key required
export const MAP_LAYERS = {
  googleRoadmap: {
    name: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps',
  },
  googleHybrid: {
    name: 'Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps',
  },
  dark: {
    name: 'Dark Canvas',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
    attribution: '&copy; CartoDB &copy; OpenStreetMap',
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  },
};

// Custom marker icons based on bed availability
function createHospitalIcon(occupancy, isSelected) {
  let color = '#10b981'; // green
  if (occupancy > 85) color = '#ef4444'; // red
  else if (occupancy > 70) color = '#f59e0b'; // amber

  const size = isSelected ? 18 : 12;
  const border = isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.8)';
  const shadow = isSelected
    ? '0 0 20px rgba(59,130,246,0.8), 0 0 40px rgba(59,130,246,0.4)'
    : `0 0 10px ${color}40`;

  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `<div style="
      width: ${size * 2}px; height: ${size * 2}px;
      background: ${color};
      border: ${border};
      border-radius: 50%;
      box-shadow: ${shadow};
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s ease;
    ">
      <div style="width: ${size * 0.6}px; height: ${size * 0.6}px; background: white; border-radius: 50%; opacity: 0.9;"></div>
    </div>`,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: 'user-location-marker',
    html: `<div style="
      width: 20px; height: 20px;
      background: #3b82f6;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function getOccupancyLabel(occ) {
  if (occ > 85) return { text: 'Critical', cls: 'critical' };
  if (occ > 70) return { text: 'Moderate', cls: 'moderate' };
  return { text: 'Available', cls: 'available' };
}

function buildPopupHTML(hospital, userLocation) {
  const status = getOccupancyLabel(hospital.occupancyPercent);
  const distanceStr = hospital.distance !== undefined ? `<div class="popup-distance">${hospital.distance} km away</div>` : '';
  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;

  return `
    <div class="popup-content">
      <h4 class="popup-title">${hospital.name}</h4>
      <p class="popup-city">${hospital.city}, ${hospital.district}</p>
      <div class="popup-stats">
        <div class="popup-stat">
          <span class="popup-stat-label">Beds</span>
          <span class="popup-stat-value available-green">${hospital.generalBeds?.available ?? '—'}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">ICU</span>
          <span class="popup-stat-value icu-blue">${hospital.icuStatus?.available ?? '—'}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Wait</span>
          <span class="popup-stat-value">${hospital.waitTime}m</span>
        </div>
      </div>
      <div class="popup-status ${status.cls}">${status.text} — ${hospital.occupancyPercent}% Full</div>
      ${distanceStr}
      <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="popup-gmaps-link">
        📍 Open in Google Maps
      </a>
    </div>
  `;
}

const HospitalMap = ({
  hospitals,
  userLocation,
  selectedHospital,
  onHospitalSelect,
  center,
  zoom = 11,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const userCircleRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const [activeLayerKey, setActiveLayerKey] = useState('googleRoadmap');

  // Initialize the map once
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: center || [9.72, 77.90],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size shortly after mount to prevent grey/unloaded tiles
      const resizeTimer = setTimeout(() => {
        map.invalidateSize();
      }, 250);

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update tile layer whenever activeLayerKey changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const layerCfg = MAP_LAYERS[activeLayerKey] || MAP_LAYERS.googleRoadmap;
    const tileLayer = L.tileLayer(layerCfg.url, {
      subdomains: layerCfg.subdomains,
      maxZoom: layerCfg.maxZoom,
      attribution: layerCfg.attribution,
    }).addTo(map);

    currentTileLayerRef.current = tileLayer;
  }, [activeLayerKey]);

  // Fly to center when it changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom]);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old user marker
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (userCircleRef.current) {
      map.removeLayer(userCircleRef.current);
      userCircleRef.current = null;
    }

    if (userLocation) {
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: 2000,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        weight: 1,
        dashArray: '5, 10',
      }).addTo(map);

      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserIcon(),
      })
        .addTo(map)
        .bindPopup('<div class="popup-content user-popup"><strong>📍 Your Location</strong></div>', {
          className: 'custom-popup',
        });

      userMarkerRef.current = marker;
      userCircleRef.current = circle;
    }
  }, [userLocation]);

  // Update hospital markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    hospitals.forEach((hospital) => {
      const isSelected = selectedHospital?.id === hospital.id;
      const icon = createHospitalIcon(hospital.occupancyPercent, isSelected);
      const marker = L.marker([hospital.lat, hospital.lng], { icon })
        .addTo(map)
        .bindPopup(buildPopupHTML(hospital, userLocation), { className: 'custom-popup', maxWidth: 260 });

      marker.on('click', () => {
        onHospitalSelect(hospital);
      });

      markersRef.current[hospital.id] = marker;
    });
  }, [hospitals, selectedHospital, onHospitalSelect, userLocation]);

  return (
    <div className="hospital-map-wrapper">
      <div ref={mapRef} className="hospital-map-container" />

      {/* Map Layer Switcher: Google Maps, Satellite, Dark, OSM */}
      <div className="map-layer-switcher">
        {Object.entries(MAP_LAYERS).map(([key, layer]) => (
          <button
            key={key}
            type="button"
            className={`layer-btn ${activeLayerKey === key ? 'active' : ''}`}
            onClick={() => setActiveLayerKey(key)}
            title={`Switch to ${layer.name}`}
          >
            {layer.name}
          </button>
        ))}
      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>&lt;70%</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot moderate"></span>
          <span>70-85%</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot critical"></span>
          <span>&gt;85%</span>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;
