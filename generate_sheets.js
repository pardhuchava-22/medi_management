import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATIENT_DATABASE, generateAutoPatient, calculateNafldAssessment } from './src/data/nafldModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build rich patient cohort:
// 1. Core registered hospital patients
// 2. Additional clinically simulated patients across risk tiers to make a comprehensive sheet
const allPatientsRaw = [...PATIENT_DATABASE];

// Add 45 more representative patient records to create a rich 50+ patient registry
for (let i = 0; i < 18; i++) {
  const p = generateAutoPatient('high');
  allPatientsRaw.push({
    id: `PID-${9000 + i}`,
    name: p.name,
    mrn: `MRN-${60000 + i}`,
    source: i % 2 === 0 ? 'Apollo EHR · CGM Sync' : 'Rajaji Hospital Outpatient',
    syncTime: `${(i + 2) * 3} mins ago`,
    tier: 'High Risk',
    data: p
  });
}

for (let i = 0; i < 18; i++) {
  const p = generateAutoPatient('moderate');
  allPatientsRaw.push({
    id: `PID-${9100 + i}`,
    name: p.name,
    mrn: `MRN-${61000 + i}`,
    source: i % 2 === 0 ? 'Meenakshi Mission EHR' : 'Madurai Diabetes Clinic',
    syncTime: `${(i + 4) * 2} mins ago`,
    tier: 'Moderate Risk',
    data: p
  });
}

for (let i = 0; i < 15; i++) {
  const p = generateAutoPatient('low');
  allPatientsRaw.push({
    id: `PID-${9200 + i}`,
    name: p.name,
    mrn: `MRN-${62000 + i}`,
    source: i % 2 === 0 ? 'Apple HealthKit Sync' : 'Virudhunagar GH Fasting Panel',
    syncTime: `${(i + 1) * 5} mins ago`,
    tier: 'Low Risk',
    data: p
  });
}

// Map each patient with calculated assessment and clinical columns
const formattedRows = allPatientsRaw.map((item, index) => {
  const p = item.data;
  const assess = calculateNafldAssessment(p);

  const bmiCat = p.bmi >= 30 ? 'Obese (Class I+)' : p.bmi >= 25 ? 'Overweight' : 'Normal / Healthy';
  const bpCat = (p.systolicBp >= 140 || p.diastolicBp >= 90) ? 'Stage 2 Hypertension' :
                (p.systolicBp >= 130 || p.diastolicBp >= 80) ? 'Stage 1 Hypertension' :
                (p.systolicBp >= 120) ? 'Elevated' : 'Normal';

  return {
    'S.No': index + 1,
    'Patient ID': item.id,
    'MRN': item.mrn || `MRN-${70000 + index}`,
    'Full Name': p.name || item.name,
    'Age (Years)': p.age,
    'Gender': p.gender.toUpperCase(),
    'BMI (kg/m²)': p.bmi,
    'BMI Classification': bmiCat,
    'Systolic BP (mmHg)': p.systolicBp,
    'Diastolic BP (mmHg)': p.diastolicBp,
    'BP Classification': bpCat,
    'Diabetes Duration (Years)': p.diabetesDuration,
    'Family History (T2D/Liver)': p.familyHistory ? 'Positive (Yes)' : 'Negative (No)',
    'Fasting Glucose (mg/dL)': p.fastingGlucose,
    'HbA1c Glycemia (%)': p.hba1c,
    'ALT / SGPT (U/L)': p.alt,
    'AST / SGOT (U/L)': p.ast,
    'AST / ALT Ratio': assess.astAltRatio,
    'Platelets (10³/µL)': p.platelets,
    'FIB-4 Score': assess.fib4,
    'FIB-4 Risk Category': assess.fib4Interpretation,
    'APRI Index': assess.apri,
    'Dietary Quality': p.dietQuality.toUpperCase(),
    'Weekly Exercise (Hours)': p.exerciseHours,
    'Sleep Quality': p.sleepQuality.toUpperCase(),
    'Smoking Status': p.smoking.toUpperCase(),
    'AI Risk Probability (%)': `${assess.ensembleRiskScore}%`,
    'NAFLD Risk Level': assess.riskLevel,
    'Clinical Staging': assess.stageName,
    'Primary Clinical Action': assess.recommendations.clinical[0],
    'Dietary Guideline': assess.recommendations.diet[0],
    'Exercise Guideline': assess.recommendations.exercise[0],
    'Data Source / EHR': item.source,
    'Last Telemetry Sync': item.syncTime || 'Recent'
  };
});

// Create Workbook
const wb = XLSX.utils.book_new();

// Sheet 1: All Patients
const wsAll = XLSX.utils.json_to_sheet(formattedRows);

// Set column widths for optimal reading in Excel / Google Sheets
const colWidths = [
  { wch: 6 },  // S.No
  { wch: 12 }, // Patient ID
  { wch: 14 }, // MRN
  { wch: 24 }, // Full Name
  { wch: 12 }, // Age
  { wch: 10 }, // Gender
  { wch: 14 }, // BMI
  { wch: 20 }, // BMI Cat
  { wch: 16 }, // Systolic
  { wch: 16 }, // Diastolic
  { wch: 22 }, // BP Cat
  { wch: 22 }, // Duration
  { wch: 22 }, // Family History
  { wch: 20 }, // Glucose
  { wch: 18 }, // HbA1c
  { wch: 16 }, // ALT
  { wch: 16 }, // AST
  { wch: 16 }, // Ratio
  { wch: 18 }, // Platelets
  { wch: 14 }, // FIB-4
  { wch: 20 }, // FIB-4 Interp
  { wch: 14 }, // APRI
  { wch: 16 }, // Diet
  { wch: 22 }, // Exercise
  { wch: 16 }, // Sleep
  { wch: 16 }, // Smoking
  { wch: 22 }, // AI Risk %
  { wch: 18 }, // Risk Level
  { wch: 32 }, // Staging
  { wch: 45 }, // Action
  { wch: 45 }, // Diet guide
  { wch: 45 }, // Ex guide
  { wch: 32 }, // Source
  { wch: 20 }  // Sync
];
wsAll['!cols'] = colWidths;
XLSX.utils.book_append_sheet(wb, wsAll, 'All Patients Registry');

// Sheet 2: High Risk Cohort
const highRiskRows = formattedRows.filter(r => r['NAFLD Risk Level'] === 'High Risk');
const wsHigh = XLSX.utils.json_to_sheet(highRiskRows);
wsHigh['!cols'] = colWidths;
XLSX.utils.book_append_sheet(wb, wsHigh, 'High Risk Patients (Urgent)');

// Sheet 3: Clinical Range Standards & Formulas
const referenceData = [
  { 'Biomarker / Variable': 'Fasting Blood Glucose', 'Normal Range': '70 - 99 mg/dL', 'Pre-Diabetes': '100 - 125 mg/dL', 'Diabetes Threshold': '≥ 126 mg/dL', 'NAFLD Relevance': 'De novo lipogenesis driver' },
  { 'Biomarker / Variable': 'HbA1c Glycemia', 'Normal Range': '< 5.7%', 'Pre-Diabetes': '5.7% - 6.4%', 'Diabetes Threshold': '≥ 6.5%', 'NAFLD Relevance': 'Long-term glycemic injury indicator' },
  { 'Biomarker / Variable': 'ALT / SGPT', 'Normal Range': '< 35 U/L (Men), < 25 U/L (Women)', 'Pre-Diabetes': '35 - 50 U/L', 'Diabetes Threshold': '> 50 U/L', 'NAFLD Relevance': 'Primary hepatocyte cytolysis enzyme' },
  { 'Biomarker / Variable': 'AST / SGOT', 'Normal Range': '< 35 U/L', 'Pre-Diabetes': '35 - 45 U/L', 'Diabetes Threshold': '> 45 U/L', 'NAFLD Relevance': 'Mitochondrial hepatic injury' },
  { 'Biomarker / Variable': 'AST / ALT Ratio', 'Normal Range': '< 1.0', 'Pre-Diabetes': '1.0 - 1.5', 'Diabetes Threshold': '> 1.5 indicates advanced fibrosis/cirrhosis', 'NAFLD Relevance': 'Inversion marks advancing fibrosis' },
  { 'Biomarker / Variable': 'FIB-4 Score Formula', 'Normal Range': '(Age × AST) / (Platelets × √ALT)', 'Pre-Diabetes': '< 1.30 (Rule out fibrosis)', 'Diabetes Threshold': '> 2.67 (High risk of advanced fibrosis)', 'NAFLD Relevance': 'AASLD/EASL validated non-invasive marker' },
  { 'Biomarker / Variable': 'APRI Index Formula', 'Normal Range': '((AST / 40) / Platelets) × 100', 'Pre-Diabetes': '< 0.5 (Low fibrosis)', 'Diabetes Threshold': '> 1.0 (Likely significant fibrosis)', 'NAFLD Relevance': 'Secondary validation calculation' },
  { 'Biomarker / Variable': 'Body Mass Index (BMI)', 'Normal Range': '18.5 - 24.9 kg/m²', 'Pre-Diabetes': '25.0 - 29.9 kg/m² (Overweight)', 'Diabetes Threshold': '≥ 30.0 kg/m² (Obese)', 'NAFLD Relevance': 'Visceral adiposity & insulin resistance' }
];
const wsRef = XLSX.utils.json_to_sheet(referenceData);
wsRef['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 30 }, { wch: 35 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, wsRef, 'Clinical Reference Ranges');

// Sheet 4: AI Model Evaluation Benchmarks (Slide 6 & 13)
const modelBenchmarkData = [
  { 'Model Name': 'CatBoost Classifier', 'Architecture Type': 'Ordered Gradient Boosting', 'Accuracy': '95.6%', 'Precision': '95.2%', 'Recall': '96.1%', 'F1-Score': '95.6%', 'AUC-ROC': '0.978', 'Primary Strength': 'Superior handling of categorical + continuous clinical telemetry' },
  { 'Model Name': 'Artificial Neural Network (ANN)', 'Architecture Type': 'Deep Multi-Layer Perceptron', 'Accuracy': '94.8%', 'Precision': '94.3%', 'Recall': '95.0%', 'F1-Score': '94.6%', 'AUC-ROC': '0.971', 'Primary Strength': 'Deep non-linear diabetic liver injury pattern detection' },
  { 'Model Name': 'Random Forest Classifier', 'Architecture Type': 'Ensemble Decision Trees (100 estimators)', 'Accuracy': '94.2%', 'Precision': '93.7%', 'Recall': '93.8%', 'F1-Score': '93.7%', 'AUC-ROC': '0.965', 'Primary Strength': 'Robust against outliers and reduces over-fitting' },
  { 'Model Name': 'Support Vector Machine (SVM)', 'Architecture Type': 'Radial Basis Function (RBF Kernel)', 'Accuracy': '92.8%', 'Precision': '92.0%', 'Recall': '91.9%', 'F1-Score': '91.9%', 'AUC-ROC': '0.948', 'Primary Strength': 'Effective margin-based separation on normalized biomarker space' },
  { 'Model Name': 'LIME Explainability Engine', 'Architecture Type': 'Local Linear Interpretable Surrogates', 'Accuracy': '—', 'Precision': '—', 'Recall': '—', 'F1-Score': '—', 'AUC-ROC': 'Verified', 'Primary Strength': 'Explains individual patient feature impacts for clinical transparency' }
];
const wsModels = XLSX.utils.json_to_sheet(modelBenchmarkData);
wsModels['!cols'] = [{ wch: 30 }, { wch: 35 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 45 }];
XLSX.utils.book_append_sheet(wb, wsModels, 'AI Model Benchmarks');

// Save Excel file to public/ and root
const xlsxPublicPath = path.join(__dirname, 'public', 'NAFLD_Patient_Database.xlsx');
const xlsxRootPath = path.join(__dirname, 'NAFLD_Patient_Database.xlsx');

XLSX.writeFile(wb, xlsxPublicPath);
XLSX.writeFile(wb, xlsxRootPath);

// Save CSV file to public/ and root (for 1-click Google Sheets import)
const csvContent = XLSX.utils.sheet_to_csv(wsAll);
const csvPublicPath = path.join(__dirname, 'public', 'NAFLD_Patient_Database.csv');
const csvRootPath = path.join(__dirname, 'NAFLD_Patient_Database.csv');

fs.writeFileSync(csvPublicPath, csvContent, 'utf8');
fs.writeFileSync(csvRootPath, csvContent, 'utf8');

console.log('✅ Excel (.xlsx) generated at:', xlsxPublicPath);
console.log('✅ CSV (.csv for Google Sheets) generated at:', csvPublicPath);
console.log('Total patient records in sheets:', formattedRows.length);
