import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, 
    Filter, 
    BedDouble, 
    Activity, 
    AlertCircle, 
    TrendingUp, 
    Stethoscope,
    Heart,
    Baby,
    Eye
} from 'lucide-react';
import { generateAllHospitalData, simulateUpdate, getSmartSuggestions } from '../data/tamilNaduHospitals';
import StatCard from '../components/ui/StatCard';
import HospitalResourceCard from '../components/ui/HospitalResourceCard';
import ResourceChart from '../components/ui/ResourceChart';
import './Resources.css';

const Resources = () => {
    const [hospitals, setHospitals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScenario, setSelectedScenario] = useState('general');
    const [loading, setLoading] = useState(true);

    // Initialize data
    useEffect(() => {
        const initialData = generateAllHospitalData();
        setHospitals(initialData);
        setLoading(false);

        // Simulation Loop
        const interval = setInterval(() => {
            setHospitals(currentHospitals => 
                currentHospitals.map(h => simulateUpdate(h))
            );
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Calculate Global Stats
    const globalStats = useMemo(() => {
        if (hospitals.length === 0) return null;

        return {
            totalBeds: hospitals.reduce((acc, h) => acc + h.generalBeds.total, 0),
            availableBeds: hospitals.reduce((acc, h) => acc + h.generalBeds.available, 0),
            totalIcu: hospitals.reduce((acc, h) => acc + h.icuStatus.total, 0),
            availableIcu: hospitals.reduce((acc, h) => acc + h.icuStatus.available, 0),
            emergencyAvailable: hospitals.reduce((acc, h) => acc + h.emergencyBeds.available, 0),
            avgWaitTime: Math.round(hospitals.reduce((acc, h) => acc + h.waitTime, 0) / hospitals.length)
        };
    }, [hospitals]);

    // Filter and Sort Hospitals
    const filteredHospitals = useMemo(() => {
        let result = [...hospitals];

        // Search filter
        if (searchTerm) {
            result = result.filter(h => 
                h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.city.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Scenario-based sorting/filtering
        if (selectedScenario !== 'all' && !searchTerm) {
            // Use the smart suggestion engine logic (approximated for state)
            result = getSmartSuggestions(9.7200, 77.9000, hospitals, selectedScenario);
        }

        return result;
    }, [hospitals, searchTerm, selectedScenario]);

    const chartData = [
        { name: 'General Available', value: globalStats?.availableBeds || 0, color: '#3b82f6' },
        { name: 'ICU Available', value: globalStats?.availableIcu || 0, color: '#10b981' },
        { name: 'Emergency Available', value: globalStats?.emergencyAvailable || 0, color: '#f59e0b' }
    ];

    const scenarios = [
        { id: 'all', label: 'All Resources', icon: Activity },
        { id: 'general', label: 'General Care', icon: Stethoscope },
        { id: 'emergency', label: 'Emergency', icon: AlertCircle },
        { id: 'icu', label: 'Critical Care', icon: BedDouble },
        { id: 'cardiac', label: 'Cardiac', icon: Heart },
        { id: 'pediatric', label: 'Pediatric', icon: Baby },
        { id: 'eye', label: 'Ophthalmology', icon: Eye }
    ];

    if (loading) return <div className="resources-loading">Initializing Live Resource Network...</div>;

    return (
        <div className="resources-page fade-in">
            <div className="resources-header">
                <div className="header-content">
                    <p className="subtitle">Real-time monitoring across 30 Tamil Nadu Medical Centers</p>
                </div>
                <div className="live-indicator">
                    <span className="pulse-dot"></span>
                    Live Network Feed
                </div>
            </div>

            <div className="stats-grid">
                <StatCard 
                    title="Total Capacity" 
                    value={globalStats.totalBeds.toLocaleString()} 
                    icon={BedDouble} 
                    color="primary" 
                />
                <StatCard 
                    title="Beds Available" 
                    value={globalStats.availableBeds.toLocaleString()} 
                    trend="up" 
                    change="Live" 
                    icon={TrendingUp} 
                    color="success" 
                />
                <StatCard 
                    title="ICU Critical Units" 
                    value={`${globalStats.availableIcu} Free`} 
                    icon={Activity} 
                    color="warning" 
                />
                <StatCard 
                    title="Avg Wait Time" 
                    value={`${globalStats.avgWaitTime}m`} 
                    icon={AlertCircle} 
                    color="accent" 
                />
            </div>

            <div className="content-layout">
                <div className="main-feed">
                    <div className="search-filter-section glass-panel">
                        <div className="search-box">
                            <Search size={20} />
                            <input 
                                type="text" 
                                placeholder="Search hospitals or cities..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="scenario-toggles">
                            {scenarios.map(s => (
                                <button 
                                    key={s.id}
                                    className={`scenario-btn ${selectedScenario === s.id ? 'active' : ''}`}
                                    onClick={() => setSelectedScenario(s.id)}
                                >
                                    <s.icon size={16} />
                                    <span>{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hospitals-list-header">
                        <h2>{searchTerm ? 'Search Results' : `${selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Optimizations`}</h2>
                        <span className="result-count">{filteredHospitals.length} centers found</span>
                    </div>

                    <div className="hospital-cards-grid">
                        {filteredHospitals.map(hospital => (
                            <HospitalResourceCard key={hospital.id} hospital={hospital} />
                        ))}
                    </div>
                </div>

                <div className="resource-sidebar">
                    <div className="global-distribution glass-panel">
                        <div className="panel-header">
                            <h3>Resource Distribution</h3>
                        </div>
                        <ResourceChart data={chartData} />
                        <div className="distribution-info">
                            <p>Global occupancy is currently balanced across the network.</p>
                        </div>
                    </div>

                    <div className="optimization-insights glass-panel">
                        <div className="panel-header">
                            <h3>Optimization Insights</h3>
                        </div>
                        <div className="insight-item">
                            <TrendingUp size={18} className="text-success" />
                            <div>
                                <h4>Peak Management</h4>
                                <p>Morning admissions are rising. Recommend diverting non-emergency cases to Virudhunagar cluster.</p>
                            </div>
                        </div>
                        <div className="insight-item">
                            <AlertCircle size={18} className="text-warning" />
                            <div>
                                <h4>ICU Criticality</h4>
                                <p>Madurai central hubs are at 92% ICU capacity. Standby units in Srivilliputhur are ready.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
