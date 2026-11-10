import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({
    origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(s => s.trim())
}));
app.use(express.json());

// Helper to read metrics
const getMetrics = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'public', 'hospital_metrics.json'), 'utf8');
        const json = JSON.parse(data);
        return json.hospitalMetrics;
    } catch (err) {
        console.error("Error reading metrics:", err);
        return { hospitalMetrics: { currentOccupancy: 0, icuAvailability: 0, patientInflow: 0, emergencyAlerts: 0, staffOnDuty: 0, currentShift: '-' } };
    }
};

// API Endpoints
app.get('/api/metrics', (req, res) => {
    const metrics = getMetrics();
    res.json(metrics);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
