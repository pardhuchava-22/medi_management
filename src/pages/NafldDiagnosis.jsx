import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  HeartPulse,
  Stethoscope,
  Dna,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  ShieldAlert,
  UserCheck,
  Sparkles,
  ChevronRight,
  Sliders,
  RotateCcw,
  FileText,
  Apple,
  Dumbbell,
  Pill,
  Building2,
  MapPin,
  Radio,
  Wifi,
  Zap,
  Cpu,
  Database,
  Layers,
  Bot,
  Play,
  Pause,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Table,
  Search,
  Filter,
  X
} from 'lucide-react';
import {
  PATIENT_DATABASE,
  LAB_REPORTS,
  generateAutoPatient,
  calculateNafldAssessment
} from '../data/nafldModel';
import { FULL_PATIENT_COHORT } from '../data/patientCohort';
import { generateAllHospitalData } from '../data/tamilNaduHospitals';
import './NafldDiagnosis.css';

const NafldDiagnosis = () => {
  // Current Patient State (Starts with automatic patient #1 loaded)
  const [selectedPatientId, setSelectedPatientId] = useState(PATIENT_DATABASE[0].id);
  const [patientData, setPatientData] = useState(PATIENT_DATABASE[0].data);
  const [activeTab, setActiveTab] = useState('clinician'); // 'clinician' | 'patient'
  
  // Automation State
  const [isLiveStream, setIsLiveStream] = useState(false);
  const [livePacketCount, setLivePacketCount] = useState(0);
  const [streamStatusText, setStreamStatusText] = useState('Connected to EHR & IoT Gateway (Medtronic CGM)');
  const [autoDataSource, setAutoDataSource] = useState(PATIENT_DATABASE[0].source);
  const [autoSyncTime, setAutoSyncTime] = useState('Just now');
  const [isLocked, setIsLocked] = useState(false); // Telemetry Lock toggle

  // Spreadsheet Registry Modal State
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [sheetsSearch, setSheetsSearch] = useState('');
  const [sheetsFilterTier, setSheetsFilterTier] = useState('all');

  // Filtered Cohort for Spreadsheet Grid
  const filteredCohort = useMemo(() => {
    return FULL_PATIENT_COHORT.filter(p => {
      const matchesTier = sheetsFilterTier === 'all' || p.riskLevel.toLowerCase() === sheetsFilterTier.toLowerCase();
      const query = sheetsSearch.toLowerCase().trim();
      const matchesSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.mrn.toLowerCase().includes(query) ||
        p.stageName.toLowerCase().includes(query);
      return matchesTier && matchesSearch;
    });
  }, [sheetsFilterTier, sheetsSearch]);

  const handleLoadCohortPatient = (patient) => {
    setPatientData(patient.rawData);
    setSelectedPatientId(patient.id);
    setAutoDataSource(patient.source);
    setAutoSyncTime('Loaded from Sheets Registry');
    setStreamStatusText(`Loaded EHR telemetry for ${patient.name} (${patient.id}) from Patient Sheets`);
    setShowSheetsModal(false);
  };

  // Compute NAFLD Assessment
  const assessment = useMemo(() => {
    return calculateNafldAssessment(patientData);
  }, [patientData]);

  // Load hospitals for specialist referral
  const referralHospitals = useMemo(() => {
    const all = generateAllHospitalData();
    return all.slice(0, 4);
  }, []);

  // Live IoT Continuous Stream Simulation
  useEffect(() => {
    if (!isLiveStream) return;

    const interval = setInterval(() => {
      setPatientData(prev => {
        // Micro-fluctuations from wearable / continuous sensors
        const deltaGlucose = Math.floor(Math.random() * 7) - 3;
        const deltaSystolic = Math.floor(Math.random() * 5) - 2;
        const deltaDiastolic = Math.floor(Math.random() * 3) - 1;

        const newGlucose = Math.min(Math.max(prev.fastingGlucose + deltaGlucose, 80), 280);
        const newSys = Math.min(Math.max(prev.systolicBp + deltaSystolic, 95), 190);
        const newDia = Math.min(Math.max(prev.diastolicBp + deltaDiastolic, 60), 115);

        return {
          ...prev,
          fastingGlucose: newGlucose,
          systolicBp: newSys,
          diastolicBp: newDia,
        };
      });

      setLivePacketCount(c => c + 1);
      setAutoSyncTime('Live (streaming)');
      setStreamStatusText(`IoT Stream: Continuous glucose & vitals packet #${livePacketCount + 1} received`);
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveStream, livePacketCount]);

  // 1-Click: Select Patient from EMR Registry
  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    const found = PATIENT_DATABASE.find(p => p.id === id);
    if (found) {
      setPatientData(found.data);
      setAutoDataSource(found.source);
      setAutoSyncTime('Auto-synced just now');
      setStreamStatusText(`Loaded EHR telemetry for ${found.name} (${found.id})`);
    }
  };

  // 1-Click: Auto-Generate Random Patient
  const handleAutoGenerate = (tier = 'random') => {
    const autoP = generateAutoPatient(tier);
    setSelectedPatientId(autoP.id);
    setPatientData(autoP);
    setAutoDataSource(`Auto-Generated Simulated Patient (${autoP.id})`);
    setAutoSyncTime('Generated now');
    setStreamStatusText(`Automatic clinical telemetry generated for ${autoP.name} [${tier.toUpperCase()}]`);
  };

  // 1-Click: Auto-Import from Lab Report
  const handleSelectLabReport = (reportId) => {
    const report = LAB_REPORTS.find(r => r.id === reportId);
    if (report) {
      setPatientData(report.data);
      setAutoDataSource(`OCR Extracted from ${report.facility} (${report.date})`);
      setAutoSyncTime(`Lab Date: ${report.date}`);
      setStreamStatusText(`Extracted 15 parameters from ${report.facility}`);
    }
  };

  // Auto-Randomize single section
  const handleRandomizeSection = (section) => {
    const randomSet = generateAutoPatient('random');
    if (section === 'demographics') {
      setPatientData(prev => ({
        ...prev,
        age: randomSet.age,
        gender: randomSet.gender,
        bmi: randomSet.bmi,
      }));
    } else if (section === 'clinical') {
      setPatientData(prev => ({
        ...prev,
        systolicBp: randomSet.systolicBp,
        diastolicBp: randomSet.diastolicBp,
        diabetesDuration: randomSet.diabetesDuration,
        familyHistory: randomSet.familyHistory,
      }));
    } else if (section === 'labs') {
      setPatientData(prev => ({
        ...prev,
        fastingGlucose: randomSet.fastingGlucose,
        hba1c: randomSet.hba1c,
        alt: randomSet.alt,
        ast: randomSet.ast,
        platelets: randomSet.platelets,
      }));
    } else if (section === 'lifestyle') {
      setPatientData(prev => ({
        ...prev,
        dietQuality: randomSet.dietQuality,
        exerciseHours: randomSet.exerciseHours,
        sleepQuality: randomSet.sleepQuality,
        smoking: randomSet.smoking,
      }));
    }
    setAutoSyncTime('Section auto-updated');
  };

  const handleInputChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
    setAutoSyncTime('Manually modified');
  };

  return (
    <div className="nafld-page">
      {/* Top Academic & Project Header */}
      <header className="nafld-hero glass-panel">
        <div className="hero-meta-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Explainable AI (XAI) Healthcare System · KARE Research Project</span>
        </div>
        
        <div className="hero-main-row">
          <div>
            <h1 className="hero-title">
              Early Diagnosis of Diabetes-Related <span className="highlight-text">NAFLD / MASLD</span>
            </h1>
            <p className="hero-subtitle">
              Multi-Model Ensemble Classifier (Random Forest · SVM · CatBoost · ANN) with LIME Feature Attribution
            </p>
          </div>

          {/* Action Tools: Spreadsheet Downloads, Dataset PDF & View Mode Toggle */}
          <div className="hero-action-tools">
            <a
              href="/NAFLD_Patient_Database.xlsx"
              download="NAFLD_Patient_Database.xlsx"
              className="btn-download-sheets-xlsx"
              title="Download Master Patient Database in Excel (.xlsx) with 4 structured sheets"
            >
              <FileSpreadsheet size={16} />
              <span>Excel Sheets (.xlsx)</span>
            </a>

            <a
              href="/NAFLD_Patient_Database.csv"
              download="NAFLD_Patient_Database.csv"
              className="btn-download-sheets-csv"
              title="Download Universal Patient CSV (1-Click Google Sheets Import)"
            >
              <Table size={16} />
              <span>Google Sheets (.csv)</span>
            </a>

            <button
              type="button"
              className="btn-open-sheets-modal"
              onClick={() => setShowSheetsModal(true)}
              title="Inspect interactive 57-patient database spreadsheet grid"
            >
              <Layers size={16} />
              <span>Patient Sheets Grid ({FULL_PATIENT_COHORT.length})</span>
            </button>

            <a
              href="/NAFLD_Diabetes_Clinical_Dataset.pdf"
              download="NAFLD_Diabetes_Clinical_Dataset.pdf"
              className="btn-download-dataset-pdf"
              title="Download NAFLD Clinical Dataset PDF (5,847 records, 28 features, model benchmarks)"
            >
              <Download size={16} />
              <span>Dataset PDF</span>
            </a>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`toggle-btn ${activeTab === 'clinician' ? 'active' : ''}`}
                onClick={() => setActiveTab('clinician')}
              >
                <Stethoscope size={16} />
                <span>Clinician View</span>
              </button>
              <button
                className={`toggle-btn ${activeTab === 'patient' ? 'active' : ''}`}
                onClick={() => setActiveTab('patient')}
              >
                <UserCheck size={16} />
                <span>Patient View</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* AUTOMATED PATIENT DATA INGESTION HUB (Eliminates Manual Entry) */}
      <section className="auto-ingestion-hub glass-panel">
        <div className="hub-top-row">
          <div className="hub-title-col">
            <div className="hub-badge">
              <Bot size={15} />
              <span>Automated Patient Ingestion Hub</span>
            </div>
            <h2>Automatic Telemetry & EHR Ingestion</h2>
            <p className="hub-desc">
              Patient data is automatically populated via hospital EHR records, continuous IoT monitors, or auto-generation. No manual typing required.
            </p>
          </div>

          {/* Live Continuous IoT Stream Toggle */}
          <div className="iot-stream-card">
            <div className="iot-header">
              <span className="iot-label">
                <Radio size={14} className={isLiveStream ? 'radio-pulse' : ''} />
                Live Wearable / IoT Stream
              </span>
              <span className={`iot-status-pill ${isLiveStream ? 'active' : 'idle'}`}>
                {isLiveStream ? 'STREAMING ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <p className="iot-sub">Continuous Glucose (CGM) & Smartwatch Real-Time Telemetry</p>
            <button
              type="button"
              className={`iot-toggle-btn ${isLiveStream ? 'stop' : 'start'}`}
              onClick={() => setIsLiveStream(!isLiveStream)}
            >
              {isLiveStream ? (
                <>
                  <Pause size={14} /> Pause IoT Stream
                </>
              ) : (
                <>
                  <Play size={14} /> Start Live Auto-Sync Stream
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1-Click Automated Action Bar */}
        <div className="auto-controls-bar">
          {/* 1. Select from Hospital EMR Registry */}
          <div className="auto-control-item">
            <label>
              <Database size={13} /> Select Patient from EMR Registry:
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => handleSelectPatient(e.target.value)}
              className="auto-select"
            >
              {PATIENT_DATABASE.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} [{p.id}] — {p.tier} ({p.data.gender === 'male' ? 'M' : 'F'}, {p.data.age}y, HbA1c {p.data.hba1c}%)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Auto-Generate New Patient */}
          <div className="auto-control-item">
            <label>
              <Zap size={13} /> 1-Click Auto-Generate Patient:
            </label>
            <div className="auto-gen-btn-group">
              <button
                type="button"
                className="btn-auto-gen primary"
                onClick={() => handleAutoGenerate('random')}
                title="Generate completely random clinical data"
              >
                <Sparkles size={14} /> Auto-Generate
              </button>
              <button
                type="button"
                className="btn-auto-gen danger"
                onClick={() => handleAutoGenerate('high')}
                title="Auto-fill high risk diabetic profile"
              >
                High Risk
              </button>
              <button
                type="button"
                className="btn-auto-gen success"
                onClick={() => handleAutoGenerate('low')}
                title="Auto-fill healthy controlled profile"
              >
                Low Risk
              </button>
            </div>
          </div>

          {/* 3. Auto-Extract from Lab Reports */}
          <div className="auto-control-item">
            <label>
              <FileText size={13} /> Auto-Import Lab Report OCR:
            </label>
            <select
              defaultValue=""
              onChange={(e) => e.target.value && handleSelectLabReport(e.target.value)}
              className="auto-select"
            >
              <option value="" disabled>Choose lab panel to auto-fill...</option>
              {LAB_REPORTS.map(r => (
                <option key={r.id} value={r.id}>
                  {r.facility} ({r.date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Status Telemetry Bar */}
        <div className="telemetry-status-strip">
          <div className="status-indicator-col">
            <span className={`live-dot ${isLiveStream ? 'pulse' : ''}`} />
            <span className="source-label">Current Data Source:</span>
            <span className="source-name">{autoDataSource}</span>
          </div>
          <div className="status-sync-col">
            <span className="stream-message">{streamStatusText}</span>
            <span className="sync-time-badge">{autoSyncTime}</span>
            <div className="quick-dataset-downloads">
              <a
                href="/NAFLD_Patient_Database.xlsx"
                download="NAFLD_Patient_Database.xlsx"
                className="quick-pdf-link green"
                title="Download Full Patient Database Excel Workbook"
              >
                <FileSpreadsheet size={12} /> Excel Sheet (.xlsx)
              </a>
              <a
                href="/NAFLD_Patient_Database.csv"
                download="NAFLD_Patient_Database.csv"
                className="quick-pdf-link blue"
                title="Download Patient CSV for Google Sheets"
              >
                <Table size={12} /> Google Sheets (.csv)
              </a>
              <a
                href="/NAFLD_Diabetes_Clinical_Dataset.pdf"
                download="NAFLD_Diabetes_Clinical_Dataset.pdf"
                className="quick-pdf-link"
                title="Download NAFLD Dataset PDF"
              >
                <Download size={12} /> NAFLD PDF
              </a>
            </div>
          </div>
        </div>

        {/* Patient Database in Sheets Direct Bar */}
        <div className="sheets-telemetry-banner">
          <div className="sheets-banner-info">
            <div className="sheets-badge">
              <FileSpreadsheet size={15} />
              <span>Patient Details in Sheets Registry</span>
            </div>
            <div className="sheets-banner-text">
              <strong>Master Patient Database: {FULL_PATIENT_COHORT.length} Patient Records Available in Sheets</strong>
              <p>
                Download full clinical telemetry with all 34 variables, FIB-4 scores, APRI indices, and AI Risk Staging in multi-tab Excel Workbook (.xlsx) or universal Google Sheets CSV format.
              </p>
            </div>
          </div>
          <div className="sheets-banner-actions">
            <button
              type="button"
              className="btn-sheets-action view"
              onClick={() => setShowSheetsModal(true)}
              title="Open in-browser spreadsheet view"
            >
              <Table size={15} />
              <span>Inspect Patient Sheets ({FULL_PATIENT_COHORT.length})</span>
            </button>
            <a
              href="/NAFLD_Patient_Database.xlsx"
              download="NAFLD_Patient_Database.xlsx"
              className="btn-sheets-action excel"
              title="Download Excel Workbook"
            >
              <FileSpreadsheet size={15} />
              <span>Download Excel (.xlsx)</span>
            </a>
            <a
              href="/NAFLD_Patient_Database.csv"
              download="NAFLD_Patient_Database.csv"
              className="btn-sheets-action csv"
              title="Download CSV for Google Sheets"
            >
              <Download size={15} />
              <span>Google Sheets (.csv)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Panel (Automated Readings) + Right Panel (AI Predictions & LIME) */}
      <div className="nafld-grid">
        {/* LEFT COLUMN: Clinical Input Parameters (Auto-Populated) */}
        <section className="nafld-inputs-column">
          {/* Card 1: Demographics */}
          <div className="input-card glass-panel">
            <div className="card-header">
              <div className="c-icon blue"><UserCheck size={18} /></div>
              <div className="c-header-text">
                <h3>1. Demographic Information</h3>
                <span className="card-sub">Core patient biometric baseline</span>
              </div>
              <div className="header-auto-tools">
                <span className="auto-badge-pill">Auto-Synced</span>
                <button
                  type="button"
                  className="section-randomize-btn"
                  onClick={() => handleRandomizeSection('demographics')}
                  title="Auto-generate demographics"
                >
                  <RotateCcw size={12} /> Auto
                </button>
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  min="18"
                  max="95"
                  value={patientData.age}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={patientData.gender}
                  disabled={isLocked}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>BMI (kg/m²)</label>
                <input
                  type="number"
                  step="0.1"
                  min="15"
                  max="55"
                  value={patientData.bmi}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('bmi', Number(e.target.value))}
                />
                <span className="input-hint">{patientData.bmi > 25 ? 'Overweight / Obese' : 'Healthy Range'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Clinical Telemetry */}
          <div className="input-card glass-panel">
            <div className="card-header">
              <div className="c-icon amber"><Activity size={18} /></div>
              <div className="c-header-text">
                <h3>2. Clinical Telemetry & History</h3>
                <span className="card-sub">Vascular and chronicity metrics</span>
              </div>
              <div className="header-auto-tools">
                <span className="auto-badge-pill">Auto-Synced</span>
                <button
                  type="button"
                  className="section-randomize-btn"
                  onClick={() => handleRandomizeSection('clinical')}
                  title="Auto-generate clinical history"
                >
                  <RotateCcw size={12} /> Auto
                </button>
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={patientData.systolicBp}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('systolicBp', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={patientData.diastolicBp}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('diastolicBp', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Diabetes Duration (yrs)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={patientData.diabetesDuration}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('diabetesDuration', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Family History</label>
                <select
                  value={patientData.familyHistory ? 'yes' : 'no'}
                  disabled={isLocked}
                  onChange={(e) => handleInputChange('familyHistory', e.target.value === 'yes')}
                >
                  <option value="no">No Family History</option>
                  <option value="yes">Positive (T2D / Liver)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Laboratory Biomarkers */}
          <div className="input-card glass-panel">
            <div className="card-header">
              <div className="c-icon red"><HeartPulse size={18} /></div>
              <div className="c-header-text">
                <h3>3. Laboratory Biomarkers</h3>
                <span className="card-sub">Glycemic & hepatic enzyme biomarkers</span>
              </div>
              <div className="header-auto-tools">
                <span className="auto-badge-pill">Auto-Synced</span>
                <button
                  type="button"
                  className="section-randomize-btn"
                  onClick={() => handleRandomizeSection('labs')}
                  title="Auto-generate laboratory readings"
                >
                  <RotateCcw size={12} /> Auto
                </button>
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  value={patientData.fastingGlucose}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('fastingGlucose', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="15.0"
                  value={patientData.hba1c}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('hba1c', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>ALT / SGPT (U/L)</label>
                <input
                  type="number"
                  value={patientData.alt}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('alt', Number(e.target.value))}
                />
                <span className="input-hint">Normal: &lt; 35 U/L</span>
              </div>

              <div className="form-group">
                <label>AST / SGOT (U/L)</label>
                <input
                  type="number"
                  value={patientData.ast}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('ast', Number(e.target.value))}
                />
                <span className="input-hint">Normal: &lt; 35 U/L</span>
              </div>

              <div className="form-group">
                <label>Platelets (10³/µL)</label>
                <input
                  type="number"
                  value={patientData.platelets}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('platelets', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Lifestyle & Behavior */}
          <div className="input-card glass-panel">
            <div className="card-header">
              <div className="c-icon green"><Apple size={18} /></div>
              <div className="c-header-text">
                <h3>4. Lifestyle & Behavioral Factors</h3>
                <span className="card-sub">Modifiable environmental indicators</span>
              </div>
              <div className="header-auto-tools">
                <span className="auto-badge-pill">Auto-Synced</span>
                <button
                  type="button"
                  className="section-randomize-btn"
                  onClick={() => handleRandomizeSection('lifestyle')}
                  title="Auto-generate lifestyle habits"
                >
                  <RotateCcw size={12} /> Auto
                </button>
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Dietary Quality</label>
                <select
                  value={patientData.dietQuality}
                  disabled={isLocked}
                  onChange={(e) => handleInputChange('dietQuality', e.target.value)}
                >
                  <option value="healthy">Healthy (Low Carb / High Fiber)</option>
                  <option value="moderate">Moderate / Mixed Diet</option>
                  <option value="poor">Poor (High Sugar / Trans Fats)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weekly Exercise (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="20"
                  value={patientData.exerciseHours}
                  readOnly={isLocked}
                  onChange={(e) => handleInputChange('exerciseHours', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Sleep Quality</label>
                <select
                  value={patientData.sleepQuality}
                  disabled={isLocked}
                  onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                >
                  <option value="good">Good (7-8h restful)</option>
                  <option value="average">Average (5-6h broken)</option>
                  <option value="poor">Poor (&lt;5h / Insomnia)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Smoking Status</label>
                <select
                  value={patientData.smoking}
                  disabled={isLocked}
                  onChange={(e) => handleInputChange('smoking', e.target.value)}
                >
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: AI Diagnostic Results & Explanations */}
        <section className="nafld-results-column">
          {/* Main Risk Output Gauge */}
          <div className="risk-banner glass-panel">
            <div className="risk-banner-header">
              <div className="risk-title-badge">
                <Dna size={16} />
                <span>AI Prediction Consensus</span>
              </div>
              <span className={`risk-pill ${assessment.riskLevel.toLowerCase().replace(' ', '-')}`}>
                {assessment.riskLevel}
              </span>
            </div>

            <div className="risk-dial-container">
              <div className="risk-score-display">
                <span className="score-val" style={{ color: assessment.riskColor }}>
                  {assessment.ensembleRiskScore}%
                </span>
                <span className="score-label">NAFLD Probability</span>
              </div>

              <div className="risk-status-details">
                <h2 className="stage-name">{assessment.stageName}</h2>
                <p className="stage-desc">{assessment.stageDesc}</p>
                
                {/* Clinical Biomarker Quick Stats */}
                <div className="quick-biomarker-row">
                  <div className="q-bio-item">
                    <span className="q-label">AST/ALT Ratio</span>
                    <span className="q-val">{assessment.astAltRatio}</span>
                  </div>
                  <div className="q-bio-item">
                    <span className="q-label">FIB-4 Score</span>
                    <span className={`q-val ${assessment.fib4 > 2.67 ? 'warn' : 'ok'}`}>{assessment.fib4}</span>
                    <span className="q-sub">{assessment.fib4Interpretation}</span>
                  </div>
                  <div className="q-bio-item">
                    <span className="q-label">APRI Index</span>
                    <span className="q-val">{assessment.apri}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Ensemble Comparison */}
          <div className="ensemble-card glass-panel">
            <div className="c-title-row">
              <h3>Multi-Model Ensemble Performance</h3>
              <span className="sub-tag">Slide 6 & 13 Architecture</span>
            </div>

            <div className="models-grid">
              {Object.values(assessment.models).map(model => (
                <div className="model-box" key={model.name}>
                  <div className="m-header">
                    <span className="m-name">{model.name}</span>
                    <span className="m-acc">Acc: {model.accuracy}</span>
                  </div>
                  <div className="m-score-bar">
                    <div
                      className="m-score-fill"
                      style={{
                        width: `${model.score}%`,
                        backgroundColor: model.score > 75 ? '#ef4444' : model.score > 45 ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>
                  <div className="m-footer">
                    <span className="m-type">{model.type}</span>
                    <span className="m-pct">{model.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIME Feature Explainability (Slide 6 & 13) */}
          <div className="lime-card glass-panel">
            <div className="c-title-row">
              <div>
                <h3>LIME Local Explainability Analysis</h3>
                <p className="lime-subtitle">Local feature attributions quantifying why this prediction was made</p>
              </div>
              <span className="lime-badge">XAI Active</span>
            </div>

            <div className="lime-chart-list">
              {assessment.limeContributions.map((contrib, idx) => (
                <div className="lime-row" key={idx}>
                  <div className="lime-label-col">
                    <span className="lime-feat-name">{contrib.feature}</span>
                    <span className="lime-feat-val">{contrib.value}</span>
                  </div>

                  <div className="lime-bar-col">
                    <div className="lime-bar-track">
                      <div
                        className={`lime-bar-fill ${contrib.type}`}
                        style={{
                          width: `${Math.min(Math.abs(contrib.impact) * 3, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="lime-impact-col">
                    <span className={`lime-impact-val ${contrib.type}`}>
                      {contrib.impact > 0 ? `+${contrib.impact}%` : `${contrib.impact}%`}
                    </span>
                    <span className="lime-impact-note">{contrib.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Care Recommendations (Slide 2 & 5) */}
          <div className="recommendations-card glass-panel">
            <div className="c-title-row">
              <h3>Personalized Care & Intervention Plan</h3>
              <span className="sub-tag">Tailored for Patient</span>
            </div>

            <div className="recs-grid">
              <div className="rec-box">
                <div className="rec-box-header green">
                  <Apple size={18} />
                  <h4>Diet & Nutrition</h4>
                </div>
                <ul>
                  {assessment.recommendations.diet.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rec-box">
                <div className="rec-box-header blue">
                  <Dumbbell size={18} />
                  <h4>Exercise & Lifestyle</h4>
                </div>
                <ul>
                  {assessment.recommendations.exercise.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rec-box">
                <div className="rec-box-header purple">
                  <Pill size={18} />
                  <h4>Clinical Protocol</h4>
                </div>
                <ul>
                  {assessment.recommendations.clinical.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Hospital Referral Connect */}
          <div className="referral-card glass-panel">
            <div className="c-title-row">
              <div>
                <h3>Local Hepatology & Gastroenterology Referrals</h3>
                <p className="referral-sub">Direct access to equipped Tamil Nadu hospitals for liver ultrasound / FibroScan</p>
              </div>
              <Building2 size={18} className="text-secondary" />
            </div>

            <div className="referral-hospitals-list">
              {referralHospitals.map(h => (
                <div className="referral-item" key={h.id}>
                  <div className="ref-info">
                    <span className="ref-name">{h.name}</span>
                    <span className="ref-city"><MapPin size={12} /> {h.city}, {h.district}</span>
                  </div>
                  <div className="ref-stats">
                    <span className="ref-bed-badge">Beds: {h.generalBeds?.available} free</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ref-directions-btn"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>

      {/* INTERACTIVE PATIENT SHEETS GRID MODAL */}
      {showSheetsModal && (
        <div className="sheets-modal-backdrop animate-fade-in" onClick={() => setShowSheetsModal(false)}>
          <div className="sheets-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheets-modal-header">
              <div className="sm-header-left">
                <div className="sm-icon-badge">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <div className="sm-title-row">
                    <h2>Master NAFLD Patient Registry Sheets</h2>
                    <span className="sm-records-badge">{FULL_PATIENT_COHORT.length} Monitored Patients</span>
                    <span className="sm-cols-badge">34 Clinical Columns</span>
                  </div>
                  <p className="sm-sub">
                    Live clinical database with glycemic biomarkers, liver enzymes, FIB-4 scores, and multi-model AI staging.
                  </p>
                </div>
              </div>
              <div className="sm-header-right">
                <a
                  href="/NAFLD_Patient_Database.xlsx"
                  download="NAFLD_Patient_Database.xlsx"
                  className="sm-download-btn excel"
                  title="Download as multi-tab Excel workbook"
                >
                  <FileSpreadsheet size={15} />
                  <span>Download Excel (.xlsx)</span>
                </a>
                <a
                  href="/NAFLD_Patient_Database.csv"
                  download="NAFLD_Patient_Database.csv"
                  className="sm-download-btn csv"
                  title="Download CSV for Google Sheets"
                >
                  <Table size={15} />
                  <span>Google Sheets (.csv)</span>
                </a>
                <button
                  type="button"
                  className="sm-close-btn"
                  onClick={() => setShowSheetsModal(false)}
                  title="Close spreadsheet grid"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Sheets Controls & Tips */}
            <div className="sheets-toolbar">
              <div className="sheets-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by Patient Name, ID (PID-XXXX), MRN, or Staging..."
                  value={sheetsSearch}
                  onChange={(e) => setSheetsSearch(e.target.value)}
                  autoFocus
                />
                {sheetsSearch && (
                  <button type="button" className="clear-search-btn" onClick={() => setSheetsSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="sheets-filter-pills">
                <span className="filter-label"><Filter size={13} /> Filter:</span>
                {['all', 'High Risk', 'Moderate Risk', 'Low Risk'].map(tier => (
                  <button
                    key={tier}
                    type="button"
                    className={`filter-pill ${sheetsFilterTier === tier ? 'active' : ''}`}
                    onClick={() => setSheetsFilterTier(tier)}
                  >
                    {tier === 'all' ? `All Patients (${FULL_PATIENT_COHORT.length})` : tier}
                  </button>
                ))}
              </div>

              <div className="sheets-import-tip">
                <span>💡 <strong>Google Sheets:</strong> Download <code>.csv</code> or <code>.xlsx</code> → In Google Sheets click <em>File → Import → Upload</em></span>
              </div>
            </div>

            {/* Scrollable Spreadsheet Table */}
            <div className="sheets-table-scroll-wrapper">
              <table className="sheets-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>#</th>
                    <th>Patient ID</th>
                    <th>MRN</th>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>BMI</th>
                    <th>BP (mmHg)</th>
                    <th>Glucose</th>
                    <th>HbA1c</th>
                    <th>ALT (U/L)</th>
                    <th>AST (U/L)</th>
                    <th>Platelets</th>
                    <th>FIB-4 Score</th>
                    <th>APRI</th>
                    <th>AI Risk %</th>
                    <th>Risk Level</th>
                    <th>Clinical Staging</th>
                    <th>EHR Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCohort.length === 0 ? (
                    <tr>
                      <td colSpan="20" className="sheets-empty-cell">
                        No patient records found matching "{sheetsSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredCohort.map((p) => {
                      const isHigh = p.riskLevel.toLowerCase().includes('high');
                      const isMod = p.riskLevel.toLowerCase().includes('moderate');
                      const riskClass = isHigh ? 'risk-high' : isMod ? 'risk-mod' : 'risk-low';

                      return (
                        <tr key={p.id} className={`sheets-row ${selectedPatientId === p.id ? 'selected-row' : ''}`}>
                          <td className="action-cell">
                            <button
                              type="button"
                              className="btn-load-row"
                              onClick={() => handleLoadCohortPatient(p)}
                              title={`Load ${p.name}'s readings into AI diagnosis form`}
                            >
                              <Zap size={12} /> Load
                            </button>
                          </td>
                          <td className="sno-cell">{p.sNo}</td>
                          <td className="pid-cell"><code>{p.id}</code></td>
                          <td className="mrn-cell"><code>{p.mrn}</code></td>
                          <td className="name-cell"><strong>{p.name}</strong></td>
                          <td>{p.age}y</td>
                          <td>{p.gender === 'male' ? 'M' : 'F'}</td>
                          <td>
                            <strong>{p.bmi}</strong>
                            <span className="sub-val">{p.bmi >= 30 ? 'Obese' : p.bmi >= 25 ? 'Overwt' : 'Norm'}</span>
                          </td>
                          <td>{p.systolicBp}/{p.diastolicBp}</td>
                          <td>
                            <strong>{p.fastingGlucose}</strong>
                          </td>
                          <td>
                            <strong className={p.hba1c >= 8.0 ? 'danger-val' : p.hba1c >= 6.5 ? 'warn-val' : ''}>
                              {p.hba1c}%
                            </strong>
                          </td>
                          <td>
                            <span className={p.alt >= 55 ? 'danger-val' : ''}>{p.alt}</span>
                          </td>
                          <td>{p.ast}</td>
                          <td>{p.platelets}k</td>
                          <td>
                            <span className={`fib4-badge ${p.fib4 >= 2.67 ? 'danger' : p.fib4 >= 1.3 ? 'warn' : 'ok'}`}>
                              {p.fib4} ({p.fib4Category})
                            </span>
                          </td>
                          <td>{p.apri}</td>
                          <td>
                            <strong className={`risk-prob ${riskClass}`}>{p.riskScore}%</strong>
                          </td>
                          <td>
                            <span className={`table-risk-pill ${riskClass}`}>{p.riskLevel}</span>
                          </td>
                          <td className="stage-cell">{p.stageName}</td>
                          <td className="source-cell">{p.source}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="sheets-modal-footer">
              <div className="sm-footer-stats">
                Showing <strong>{filteredCohort.length}</strong> of <strong>{FULL_PATIENT_COHORT.length}</strong> total patients in database sheet
              </div>
              <div className="sm-footer-actions">
                <a
                  href="/NAFLD_Patient_Database.xlsx"
                  download="NAFLD_Patient_Database.xlsx"
                  className="sm-btn-excel"
                >
                  <FileSpreadsheet size={14} /> Download Excel
                </a>
                <a
                  href="/NAFLD_Patient_Database.csv"
                  download="NAFLD_Patient_Database.csv"
                  className="sm-btn-csv"
                >
                  <Table size={14} /> Download CSV
                </a>
                <button
                  type="button"
                  className="sm-btn-secondary"
                  onClick={() => setShowSheetsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NafldDiagnosis;
