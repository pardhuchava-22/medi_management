import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    TrendingUp, AlertTriangle, Cpu, Globe, 
    ArrowUpRight, Info, CheckCircle, BarChart3, 
    Zap, Download, BrainCircuit
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import OccupancyChart from '../components/charts/OccupancyChart';
import { generateAllHospitalData, simulateUpdate } from '../data/tamilNaduHospitals';
import { 
    generateAdmissionForecast, 
    getAIInsights, 
    getRegionalSurgeData,
    detectAnomalies 
} from '../data/predictiveSimulation';
import './PredictiveAnalytics.css';

const PredictiveAnalytics = () => {
    const [hospitals, setHospitals] = useState([]);
    const [lastSync, setLastSync] = useState(new Date());
    const [activeModel, setActiveModel] = useState('admission');
    const [isSimulatingSurge, setIsSimulatingSurge] = useState(false);

    // Initialize hospital data
    useEffect(() => {
        const data = generateAllHospitalData();
        setHospitals(data);
    }, []);

    // Sync with global simulation - update every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setHospitals(prev => prev.map(h => simulateUpdate(h)));
            setLastSync(new Date());
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Aggregate statistics
    const aggregateStats = useMemo(() => {
        if (hospitals.length === 0) return { avgOccupancy: 0, totalBeds: 0, icuAvailable: 0 };
        
        const totals = hospitals.reduce((acc, h) => {
            acc.totalOccupied += h.generalBeds.occupied;
            acc.totalBeds += h.totalBeds;
            acc.icuAvailable += h.icuStatus.available;
            return acc;
        }, { totalOccupied: 0, totalBeds: 0, icuAvailable: 0 });

        return {
            avgOccupancy: Math.round((totals.totalOccupied / totals.totalBeds) * 100),
            totalBeds: totals.totalBeds,
            icuAvailable: totals.icuAvailable
        };
    }, [hospitals]);

    // Generate predictive data
    const forecastData = useMemo(() => generateAdmissionForecast(aggregateStats.avgOccupancy), [aggregateStats.avgOccupancy]);
    const insights = useMemo(() => getAIInsights(hospitals, aggregateStats), [hospitals, aggregateStats]);
    const regionalData = useMemo(() => getRegionalSurgeData(hospitals), [hospitals]);
    const anomalies = useMemo(() => detectAnomalies(hospitals), [hospitals]);

    const toggleSurgeSimulation = useCallback(() => {
        setIsSimulatingSurge(prev => !prev);
        // If enabling surge, boost all occupancy by 20%
        if (!isSimulatingSurge) {
            setHospitals(prev => prev.map(h => ({
                ...h,
                occupancyPercent: Math.min(100, h.occupancyPercent + 20),
                generalBeds: {
                    ...h.generalBeds,
                    occupied: Math.min(h.generalBeds.total, h.generalBeds.occupied + Math.floor(h.generalBeds.total * 0.2))
                }
            })));
        }
    }, [isSimulatingSurge]);

    const handleExport = () => {
        const dataStr = JSON.stringify({ aggregateStats, regionalData, forecastData }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'medintel_predictions.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="predictive-container">
            <header className="predictive-header">
                <div className="header-title-group">
                    <h1>Predictive Intelligence</h1>
                    <div className="header-subtitle">
                        <div className="ai-status-pulse"></div>
                        <span>Real-time AI Analysis: Active (Last synced: {lastSync.toLocaleTimeString()})</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className={`btn-action ${isSimulatingSurge ? 'danger' : ''}`} onClick={toggleSurgeSimulation}>
                        <Zap size={16} />
                        {isSimulatingSurge ? 'Reset Simulation' : 'Simulate Crisis Surge'}
                    </button>
                    <button className="btn-action" onClick={handleExport}>
                        <Download size={16} />
                        Export Forecast
                    </button>
                </div>
            </header>

            <div className="metrics-row">
                <StatCard
                    title="Predicted Peak Occupancy"
                    value={`${aggregateStats.avgOccupancy + 4}%`}
                    change="+2.4%"
                    trend="up"
                    icon={TrendingUp}
                    color="warning"
                />
                <StatCard
                    title="System Efficiency Score"
                    value="94.2"
                    change="Optimal"
                    trend="up"
                    icon={BrainCircuit}
                    color="accent"
                />
                <StatCard
                    title="Anomaly Detection"
                    value={anomalies.length}
                    change={anomalies.length > 0 ? "Caution" : "Stable"}
                    trend={anomalies.length > 0 ? "down" : "up"}
                    icon={AlertTriangle}
                    color={anomalies.length > 0 ? "danger" : "success"}
                />
                <StatCard
                    title="Confidence Index"
                    value="91%"
                    change="High"
                    trend="neutral"
                    icon={CheckCircle}
                    color="primary"
                />
            </div>

            <section className="forecast-section">
                <div className="forecast-main-card">
                    <div className="forecast-header">
                        <div className="forecast-title">
                            <h2>14-Day Admission Forecast</h2>
                            <span className="forecast-subtitle">Based on localized health patterns and seasonal trends</span>
                        </div>
                        <div className="forecast-controls">
                            <button 
                                className={`control-pill ${activeModel === 'admission' ? 'active' : ''}`}
                                onClick={() => setActiveModel('admission')}
                            >Admissions</button>
                            <button 
                                className={`control-pill ${activeModel === 'resource' ? 'active' : ''}`}
                                onClick={() => setActiveModel('resource')}
                            >Resources</button>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <OccupancyChart data={forecastData} />
                    </div>
                </div>
            </section>

            <div className="bottom-grid">
                <div className="insights-column">
                    <div className="insights-panel-header">
                        <BarChart3 size={20} />
                        <h2>Actionable AI Insights</h2>
                    </div>
                    <div className="insights-list">
                        {insights.map((insight) => (
                            <div className={`ai-insight-card ${insight.type}`} key={insight.id}>
                                <div className="insight-header">
                                    {insight.type === 'critical' ? <AlertTriangle size={18} /> : 
                                     insight.type === 'positive' ? <CheckCircle size={18} /> : 
                                     <Info size={18} />}
                                    <h3>{insight.title}</h3>
                                </div>
                                <p>{insight.message}</p>
                                <div className="insight-footer">
                                    <button className="btn-action">{insight.actionLabel}</button>
                                    <div className="impact-badge">
                                        Impact Score: {insight.impactScore}%
                                        <div className="impact-bar-container">
                                            <div className="impact-bar" style={{ width: `${insight.impactScore}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="regional-surge-card">
                    <h2>Regional Surge Status</h2>
                    <div className="surge-list">
                        {regionalData.map((data, idx) => (
                            <div className="surge-item" key={idx}>
                                <div className="surge-item-header">
                                    <span className="region-name">{data.region}</span>
                                    <span className={`trend-indicator ${data.trend}`}>{data.trend}</span>
                                </div>
                                <div className="progress-mini">
                                    <div 
                                        className="progress-fill" 
                                        style={{ 
                                            width: `${data.currentOccupancy}%`,
                                            backgroundColor: data.risk === 'high' ? 'var(--danger)' : 
                                                             data.risk === 'medium' ? 'var(--warning)' : 
                                                             'var(--success)'
                                        }}
                                    ></div>
                                </div>
                                <div className="surge-stats">
                                    <span>Current: {data.currentOccupancy}%</span>
                                    <span>Predicted Peak: {data.predictedPeak}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
