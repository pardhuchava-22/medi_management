/**
 * Utility functions for generating predictive analytics data based on 
 * the current state of Tamil Nadu hospitals.
 */

// Generate a 14-day admission forecast based on aggregate occupancy
export const generateAdmissionForecast = (currentOccupancy) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    // We want 14 days of predictions
    return Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayIndex = date.getDay();
        const dayName = days[dayIndex];
        
        // Weekend factor: admsissions usually drop slightly on weekends but emergencies might rise
        const isWeekend = dayIndex === 0 || dayIndex === 6;
        const weekendFactor = isWeekend ? -5 : 2;
        
        // Realistic variation (+/- 12%)
        // We use a sine wave to simulate periodic fluctuations
        const wave = Math.sin(i * 0.8) * 10;
        const noise = (Math.random() - 0.5) * 5;
        
        const predicted = Math.min(98, Math.max(45, Math.round(currentOccupancy + wave + weekendFactor + noise)));
        
        // Actual is only for day 0
        return {
            name: i === 0 ? 'Today' : (i < 7 ? dayName : `${dayName} +7`),
            actual: i === 0 ? currentOccupancy : null,
            predicted: predicted,
            upperBound: Math.min(100, predicted + 8),
            lowerBound: Math.max(0, predicted - 8)
        };
    });
};

// Generate AI-driven insights
export const getAIInsights = (hospitals, aggregateStats) => {
    const insights = [];
    
    // 1. Capacity Breach Alert
    if (aggregateStats.avgOccupancy > 85) {
        insights.push({
            id: 'ins-1',
            type: 'critical',
            title: 'HIGH ALERT: Capacity Breach',
            message: `System-wide occupancy is at ${aggregateStats.avgOccupancy}%. Predicted breach in Madurai region within 48 hours.`,
            actionLabel: 'View Emergency Strategy',
            impactScore: 92
        });
    } else if (aggregateStats.avgOccupancy > 75) {
        insights.push({
            id: 'ins-1-alt',
            type: 'warning',
            title: 'System Load Warning',
            message: 'Occupancy is trending upwards in Srivilliputhur. Recommend pre-emptive bed clearing for Friday.',
            actionLabel: 'Optimize Discharges',
            impactScore: 65
        });
    } else {
        insights.push({
            id: 'ins-1-stable',
            type: 'positive',
            title: 'System Stable',
            message: 'Predictive models show stable occupancy for the next 72 hours. Optimal time for elective surgeries.',
            actionLabel: 'Schedule Electives',
            impactScore: 40
        });
    }

    // 2. Staffing Optimization
    const eveningShiftPeak = new Date().getHours() >= 14 && new Date().getHours() <= 20;
    if (eveningShiftPeak) {
        insights.push({
            id: 'ins-2',
            type: 'info',
            title: 'Staffing Optimization',
            message: 'Evening surge expected. Recommend deploying 15% more nursing staff to ER units in Virudhunagar.',
            actionLabel: 'Adjust Rota',
            impactScore: 78
        });
    } else {
        insights.push({
            id: 'ins-2-alt',
            type: 'info',
            title: 'Resource Reallocation',
            message: 'Night shift underutilization detected in Cardiology. Potential to reallocate staff to General Medicine.',
            actionLabel: 'Reallocate Staff',
            impactScore: 55
        });
    }

    // 3. Resource Constraint
    const lowIcuHospitals = hospitals.filter(h => h.icuStatus.available < 3);
    if (lowIcuHospitals.length > 0) {
        insights.push({
            id: 'ins-3',
            type: 'danger',
            title: 'ICU Bottleneck Detected',
            message: `${lowIcuHospitals.length} hospitals are near ICU capacity. Critical diversion protocols may be needed.`,
            actionLabel: 'Manage Diversions',
            impactScore: 88
        });
    }

    return insights;
};

// Regional Surge Analysis
export const getRegionalSurgeData = (hospitals) => {
    const districts = [...new Set(hospitals.map(h => h.district))];
    
    return districts.map(district => {
        const districtHospitals = hospitals.filter(h => h.district === district);
        const avgOcc = districtHospitals.reduce((acc, h) => acc + h.occupancyPercent, 0) / districtHospitals.length;
        
        // Predict trend based on average occupancy
        const trend = avgOcc > 85 ? 'surging' : (avgOcc > 70 ? 'rising' : 'stable');
        const risk = avgOcc > 80 ? 'high' : (avgOcc > 60 ? 'medium' : 'low');
        
        return {
            region: district,
            currentOccupancy: Math.round(avgOcc),
            predictedPeak: Math.min(100, Math.round(avgOcc + (Math.random() * 15))),
            trend,
            risk,
            hospitalsCount: districtHospitals.length
        };
    });
};

// Anomaly Detection
export const detectAnomalies = (hospitals) => {
    // Simulate anomalies: hospitals with sudden occupancy spikes (>15% above district average)
    const anomalies = [];
    const regionalData = getRegionalSurgeData(hospitals);
    
    hospitals.forEach(h => {
        const region = regionalData.find(r => r.region === h.district);
        if (h.occupancyPercent > region.currentOccupancy + 15) {
            anomalies.push({
                hospitalId: h.id,
                hospitalName: h.name,
                value: h.occupancyPercent,
                baseline: region.currentOccupancy,
                type: 'Occupancy Spike',
                severity: h.occupancyPercent > 90 ? 'critical' : 'warning'
            });
        }
    });

    return anomalies;
};
