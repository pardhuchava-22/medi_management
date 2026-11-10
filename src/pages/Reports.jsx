import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Download,
  Plus,
  Database,
  Sparkles,
  HeartPulse,
  Activity,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Table,
  Building2
} from 'lucide-react';
import './Reports.css';

const OFFICIAL_DATASETS = [
  {
    id: 'ds-patient-sheets-xlsx',
    title: 'Complete NAFLD Patient Registry (Excel Workbook)',
    subtitle: 'Multi-Tab Master Clinical Spreadsheet · 57 Records',
    description: 'Master clinical spreadsheet workbook (.xlsx) containing 4 dedicated tabs: (1) All Patients Registry with 34 telemetry and demographic metrics, (2) High-Risk Urgent Cohort, (3) Clinical Reference Thresholds (FIB-4, APRI, AST/ALT, HbA1c), and (4) AI Model Benchmarks (CatBoost, ANN, RF, SVM).',
    fileUrl: '/NAFLD_Patient_Database.xlsx',
    fileName: 'NAFLD_Patient_Database.xlsx',
    badge: 'Excel Workbook (.xlsx) · 4 Sheets',
    badgeColor: 'green',
    icon: FileSpreadsheet,
    size: '138.8 KB (.xlsx)',
    tags: ['57 Patients', '4 Sheets', '34 Columns', 'FIB-4 Scores', 'AI Risk %']
  },
  {
    id: 'ds-patient-sheets-csv',
    title: 'Patient Telemetry & Diagnosis (Google Sheets CSV)',
    subtitle: 'Universal CSV Format · 1-Click Google Sheets Import',
    description: 'Comma-separated values spreadsheet (.csv) ready for instant import into Google Sheets, Microsoft Excel, or LibreOffice Calc. Contains full clinical telemetry, glycemic biomarkers, liver enzymes, and AI risk staging for all 57 monitored patients.',
    fileUrl: '/NAFLD_Patient_Database.csv',
    fileName: 'NAFLD_Patient_Database.csv',
    badge: 'Google Sheets Compatible (.csv)',
    badgeColor: 'blue',
    icon: Table,
    size: '28.6 KB (.csv)',
    tags: ['Google Sheets', 'Universal CSV', '57 Patients', 'Biomarkers', 'EHR Telemetry']
  },
  {
    id: 'ds-nafld',
    title: 'Diabetes-Related NAFLD Clinical Dataset (PDF)',
    subtitle: 'KARE CSE Research · Explainable AI Benchmark Dataset',
    description: '5,847 Patient Records with 28 clinical variables (Demographics, Glycemia, ALT/AST Enzymes, Lifestyle, Platelets). Includes multi-model benchmarks (CatBoost 95.6%, ANN 94.8%, RF 94.2%, SVM 92.8%) and LIME local feature attribution matrices.',
    fileUrl: '/NAFLD_Diabetes_Clinical_Dataset.pdf',
    fileName: 'NAFLD_Diabetes_Clinical_Dataset.pdf',
    badge: 'Research Dataset · 5,847 Records',
    badgeColor: 'purple',
    icon: HeartPulse,
    size: '7.2 KB (Vector PDF)',
    tags: ['CatBoost 95.6%', 'LIME XAI', '28 Features', 'Biomarkers']
  },
  {
    id: 'ds-hospitals',
    title: 'Hospital Capacity & Infrastructure Dataset (PDF)',
    subtitle: 'Tamil Nadu Regional Healthcare Telemetry Directory',
    description: 'Structured directory of 30 hospitals across Madurai and Virudhunagar districts. Real-time telemetry on total and available general beds, ICU units, emergency reserve capacities, ventilators, occupancy rates, and facility emergency contact lines.',
    fileUrl: '/Medi_Management_Complete_Dataset.pdf',
    fileName: 'Medi_Management_Complete_Dataset.pdf',
    badge: '30 Monitored Facilities · Real-Time Telemetry',
    badgeColor: 'green',
    icon: Building2,
    size: '7.7 KB (Vector PDF)',
    tags: ['30 Hospitals', 'ICU Metrics', 'Ventilators', 'Madurai / Virudhunagar']
  },
  {
    id: 'ds-outbreak',
    title: 'National Disease Surveillance Outbreak Report (PDF)',
    subtitle: 'Integrated Disease Surveillance Programme (IDSP) Official Report',
    description: 'Official 14-page epidemiological telemetry covering weekly disease outbreaks across Indian states and districts: Dengue fever, Viral pyrexia, Acute Diarrheal Disease (ADD), Malaria, and respiratory pathogens with case numbers and mortality metrics.',
    fileUrl: '/diseases.pdf',
    fileName: 'diseases.pdf',
    badge: 'IDSP Official Surveillance · 14 Pages',
    badgeColor: 'orange',
    icon: Activity,
    size: '915 KB (Official IDSP PDF)',
    tags: ['14 Pages', 'IDSP Telemetry', 'Monsoon Surge', 'Lab Confirmed']
  }
];

const TEMPLATES = [
  { id: 1, title: 'Master Patient Details Excel Sheet', desc: 'Complete 57-patient workbook with multi-tab risk stratification, clinical staging, and liver enzyme profiles.', icon: FileSpreadsheet, color: 'green', fileUrl: '/NAFLD_Patient_Database.xlsx' },
  { id: 2, title: 'Google Sheets Universal Patient CSV', desc: 'Direct CSV export formatted for immediate Google Sheets import with all 34 diagnostic columns.', icon: Table, color: 'blue', fileUrl: '/NAFLD_Patient_Database.csv' },
  { id: 3, title: 'NAFLD & Liver Diagnostics Research PDF', desc: 'Comprehensive analysis of diabetic cohort liver enzyme trends, FIB-4 indices, and AI risk stratification.', icon: HeartPulse, color: 'purple', fileUrl: '/NAFLD_Diabetes_Clinical_Dataset.pdf' },
  { id: 4, title: 'Regional Capacity & Surge Planning', desc: 'Bed and ICU resource utilization forecast based on seasonal epidemic and historical admission surges.', icon: Building2, color: 'orange', fileUrl: '/Medi_Management_Complete_Dataset.pdf' },
];

const HISTORY = [
  { id: 99, name: 'Master NAFLD Patient Registry Excel Sheet (.xlsx - 57 patients)', date: 'Just now', generatedBy: 'Clinical Informatics System', fileUrl: '/NAFLD_Patient_Database.xlsx', fileName: 'NAFLD_Patient_Database.xlsx' },
  { id: 100, name: 'Patient Telemetry Google Sheets Database (.csv)', date: '1 min ago', generatedBy: 'EHR Export Pipeline', fileUrl: '/NAFLD_Patient_Database.csv', fileName: 'NAFLD_Patient_Database.csv' },
  { id: 101, name: 'NAFLD Clinical Biomarker Dataset (5,847 records PDF)', date: '3 mins ago', generatedBy: 'AI Healthcare Research Team', fileUrl: '/NAFLD_Diabetes_Clinical_Dataset.pdf', fileName: 'NAFLD_Diabetes_Clinical_Dataset.pdf' },
  { id: 102, name: 'Tamil Nadu Hospital Infrastructure & Beds Directory (PDF)', date: '15 mins ago', generatedBy: 'System Auto-Telemetry', fileUrl: '/Medi_Management_Complete_Dataset.pdf', fileName: 'Medi_Management_Complete_Dataset.pdf' },
  { id: 103, name: 'National Integrated Disease Surveillance Report (IDSP PDF)', date: 'Yesterday, 6:00 PM', generatedBy: 'Surveillance Officer', fileUrl: '/diseases.pdf', fileName: 'diseases.pdf' },
];

const Reports = () => {
  const [downloadNotification, setDownloadNotification] = useState(null);

  const handleDownload = (fileName) => {
    setDownloadNotification(`Downloading ${fileName}...`);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3500);
  };

  return (
    <div className="reports-container">
      {/* Toast Notification */}
      {downloadNotification && (
        <div className="download-toast animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="reports-hero glass-panel">
        <div className="r-hero-badge">
          <Database size={14} />
          <span>Datasets & Technical Documentation Center</span>
        </div>
        <div className="r-hero-content">
          <h1>Healthcare Datasets & Research Reports</h1>
          <p>
            Download complete, certified dataset PDFs powering the Medi-Management and NAFLD early diagnosis platforms.
            All files are available for offline research, peer review, and clinical verification.
          </p>
        </div>
      </div>

      {/* OFFICIAL DATASETS DOWNLOAD CENTER */}
      <section className="official-datasets-section">
        <div className="section-header">
          <div>
            <h2>Official Primary Datasets (PDF)</h2>
            <p className="section-sub">Direct access to raw and structured telemetry dataset files</p>
          </div>
        </div>

        <div className="datasets-cards-grid">
          {OFFICIAL_DATASETS.map((ds) => (
            <div key={ds.id} className="dataset-download-card glass-panel">
              <div className="ds-card-top">
                <div className={`ds-icon ${ds.badgeColor}`}>
                  <ds.icon size={24} />
                </div>
                <div className="ds-meta-right">
                  <span className={`ds-badge ${ds.badgeColor}`}>{ds.badge}</span>
                  <span className="ds-size">{ds.size}</span>
                </div>
              </div>

              <div className="ds-card-body">
                <h3 className="ds-title">{ds.title}</h3>
                <span className="ds-subtitle">{ds.subtitle}</span>
                <p className="ds-desc">{ds.description}</p>
                
                <div className="ds-tags-row">
                  {ds.tags.map((tag, i) => (
                    <span key={i} className="ds-tag-pill">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="ds-card-actions">
                <a
                  href={ds.fileUrl}
                  download={ds.fileName}
                  className="ds-download-btn primary"
                  onClick={() => handleDownload(ds.fileName)}
                >
                  <Download size={16} />
                  <span>Download Dataset PDF</span>
                </a>
                <a
                  href={ds.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-download-btn preview"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={15} />
                  <span>View</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REPORT TEMPLATES */}
      <section className="templates-section">
        <div className="section-header">
          <div>
            <h2>Dynamic Report Generators</h2>
            <p className="section-sub">Generate and export filtered operational summaries</p>
          </div>
        </div>

        <div className="templates-grid">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="template-card glass-panel">
              <div className={`template-icon ${template.color}`}>
                <template.icon size={24} />
              </div>
              <h3>{template.title}</h3>
              <p>{template.desc}</p>
              <a
                href={template.fileUrl}
                download={template.fileUrl.split('/').pop()}
                className="generate-btn"
                onClick={() => handleDownload(template.title)}
              >
                <Download size={15} />
                <span>Download Report PDF</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* GENERATION HISTORY */}
      <div className="history-section">
        <div className="section-header">
          <div>
            <h2>Download & Export History</h2>
            <p className="section-sub">Recent telemetry exports and generated dataset snapshots</p>
          </div>
        </div>
        
        <div className="history-list glass-panel">
          {HISTORY.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-info">
                <FileText size={22} className="history-icon" />
                <div>
                  <span className="history-name">{item.name}</span>
                  <div className="history-meta">
                    <span className="history-by">by {item.generatedBy}</span>
                    <span className="history-date"><Clock size={12} /> {item.date}</span>
                  </div>
                </div>
              </div>
              <a
                href={item.fileUrl}
                download={item.fileName}
                className="download-btn-link"
                title={`Download ${item.name}`}
                onClick={() => handleDownload(item.fileName)}
              >
                <Download size={18} />
                <span>Download PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
