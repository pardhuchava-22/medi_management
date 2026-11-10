import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATIENT_DATABASE } from './src/data/nafldModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'public', 'NAFLD_Diabetes_Clinical_Dataset.pdf');
const doc = new PDFDocument({ margin: 40, size: 'A4' });
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Colors
const primaryColor = '#1e3a8a';
const secondaryColor = '#0284c7';
const darkText = '#0f172a';
const lightText = '#64748b';
const greenColor = '#10b981';
const redColor = '#ef4444';
const amberColor = '#d97706';

// Header
doc.rect(40, 40, 515, 68).fill('#0f172a');
doc.fillColor('#60a5fa').fontSize(9).font('Helvetica-Bold').text('KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION · CSE', 55, 48);
doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('DIABETES-RELATED NAFLD / MASLD CLINICAL DATASET', 55, 62);
doc.fontSize(8.5).font('Helvetica').text('Explainable AI Early Diagnostic Benchmark Dataset (5,847 Records · 28 Features)', 55, 84);

doc.moveDown(3);

// Section 1: Academic & Research Metadata
doc.fillColor(darkText).fontSize(11).font('Helvetica-Bold').text('1. Research & System Metadata');
doc.moveDown(0.4);
doc.fontSize(8.5).font('Helvetica').text(
  '• Project Title: Personalized AI-Based Healthcare System for Early Diagnosis of Diabetes-Related NAFLD\n' +
  '• Project Guide: Dr. R. Murugeswari, Associate Professor, Department of Computer Science & Engineering\n' +
  '• Student Investigators: Ch. Pardha Saradhi (9924051026), Ch. Sai Dheeraj (9924051028), G. Shiva Shankara Vara Prasad (9924051008), B. Vinay (9924051023)\n' +
  '• Clinical Objective: Early non-invasive detection of Non-Alcoholic Fatty Liver Disease (NAFLD/MASLD) in Type-2 Diabetes patients prior to irreversible hepatic fibrosis.'
);

doc.moveDown(1.2);

// Section 2: Dataset Statistics & Pipeline Specification
doc.fillColor(darkText).fontSize(11).font('Helvetica-Bold').text('2. Dataset Technical Architecture (Slide 12 Specification)');
doc.moveDown(0.4);

const statBoxes = [
  { label: 'Total Cohort Records', val: '5,847 Patients' },
  { label: 'Clinical Features', val: '28 Variables' },
  { label: 'Classification Target', val: 'Binary (NAFLD / Normal)' },
  { label: 'Train / Test Split', val: '80% (4,677) / 20% (1,170)' },
  { label: 'Missing Imputation', val: 'KNN / Iterative Imputer' },
];

let curY = doc.y;
statBoxes.forEach((b, idx) => {
  const x = 40 + (idx * 103);
  doc.rect(x, curY, 100, 38).fill('#f1f5f9');
  doc.fillColor(lightText).fontSize(7).font('Helvetica-Bold').text(b.label, x + 4, curY + 5, { width: 92 });
  doc.fillColor(primaryColor).fontSize(9.5).font('Helvetica-Bold').text(b.val, x + 4, curY + 19, { width: 92 });
});

doc.y = curY + 50;

// Section 3: Feature Clusters Breakdown
doc.fillColor(darkText).fontSize(11).font('Helvetica-Bold').text('3. Feature Domain Taxonomy (28 Parameters)');
doc.moveDown(0.4);

const featureDomains = [
  { domain: 'Demographic Baseline', count: '4 Features', items: 'Age, Biological Gender, BMI (Body Mass Index), Ethnicity / Region' },
  { domain: 'Clinical & Vascular History', count: '6 Features', items: 'Systolic Blood Pressure, Diastolic Blood Pressure, Diabetes Duration (years), Family History of T2D, Family History of Hepatic Disease, Waist-to-Hip Ratio' },
  { domain: 'Laboratory Biomarkers', count: '13 Features', items: 'Fasting Blood Glucose, HbA1c Glycemia, ALT / SGPT, AST / SGOT, AST/ALT Ratio, Platelet Count, FIB-4 Score, APRI Score, Triglycerides, HDL, LDL, Total Cholesterol, Alkaline Phosphatase' },
  { domain: 'Lifestyle & Environmental', count: '5 Features', items: 'Healthy Eating Index (HEI-2020), Weekly Exercise Duration (hrs), Sleep Quality Score, Smoking Status, Alcohol Consumption Frequency' },
];

featureDomains.forEach((fd) => {
  doc.rect(40, doc.y, 515, 24).fill('#f8fafc');
  doc.rect(40, doc.y, 4, 24).fill(secondaryColor);
  doc.fillColor(darkText).fontSize(8).font('Helvetica-Bold').text(fd.domain, 50, doc.y + 4);
  doc.fillColor(lightText).fontSize(7.5).font('Helvetica').text(fd.items, 50, doc.y + 13, { width: 440 });
  doc.fillColor(primaryColor).fontSize(7.5).font('Helvetica-Bold').text(fd.count, 450, doc.y + 4, { align: 'right', width: 95 });
  doc.moveDown(0.7);
});

doc.moveDown(0.8);

// Section 4: Machine Learning Benchmark Evaluation
doc.fillColor(darkText).fontSize(11).font('Helvetica-Bold').text('4. Machine Learning & Explainable AI Benchmarks (Slide 6 & 13)');
doc.moveDown(0.4);

const modelHeaders = ['Algorithm', 'Working Paradigm', 'Accuracy', 'Sensitivity', 'Specificity', 'AUC-ROC'];
const modelWidths = [110, 155, 60, 60, 65, 65];

function renderModelHeader(y) {
  doc.rect(40, y, 515, 18).fill('#1e293b');
  let xOffset = 40;
  modelHeaders.forEach((h, i) => {
    doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold').text(h, xOffset + 4, y + 5, { width: modelWidths[i] - 8 });
    xOffset += modelWidths[i];
  });
}

let mY = doc.y;
renderModelHeader(mY);
mY += 18;

const modelsData = [
  ['CatBoost Classifier', 'Ordered Gradient Boosting (Categorical Focus)', '95.6%', '96.1%', '94.8%', '0.978'],
  ['Artificial Neural Net (ANN)', 'Deep Multi-Layer Perceptron (ReLU, Adam)', '94.8%', '95.0%', '94.4%', '0.971'],
  ['Random Forest Ensemble', 'Bagged Decision Trees (Gini Impurity)', '94.2%', '93.8%', '94.7%', '0.965'],
  ['Support Vector Machine', 'Radial Basis Function (RBF Kernel)', '92.8%', '91.9%', '93.5%', '0.948'],
  ['LIME / SHAP Explainability', 'Local Linear Surrogates + Shapley Attributions', '—', '—', '—', 'Verified XAI']
];

modelsData.forEach((row, idx) => {
  const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
  doc.rect(40, mY, 515, 17).fill(bg);
  let x = 40;
  row.forEach((cell, ci) => {
    const isAcc = ci === 2;
    doc.fillColor(isAcc ? greenColor : darkText).fontSize(7).font(isAcc ? 'Helvetica-Bold' : 'Helvetica').text(cell, x + 4, mY + 4, { width: modelWidths[ci] - 8 });
    x += modelWidths[ci];
  });
  mY += 17;
});

// Section 5: Benchmark Against Existing Healthcare Workflows (Slide 15)
doc.addPage();
doc.rect(40, 40, 515, 26).fill('#0f172a');
doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text('5. Existing Healthcare System vs. Proposed Deep Learning Platform', 50, 48);

doc.moveDown(1.8);
doc.fillColor(darkText).fontSize(8.5).font('Helvetica').text(
  'Quantitative comparative capability scores based on the research presentation (Feature-Coverage Scale: 0 to 5):'
);
doc.moveDown(0.6);

const compHeaders = ['Evaluation Capability Criterion', 'Existing Standard Clinical Workflow', 'Our Proposed Deep-Learning Platform', 'Clinical Benefit'];
const compWidths = [145, 95, 105, 170];

function renderCompHeader(y) {
  doc.rect(40, y, 515, 18).fill('#1e293b');
  let xOffset = 40;
  compHeaders.forEach((h, i) => {
    doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold').text(h, xOffset + 4, y + 5, { width: compWidths[i] - 8 });
    xOffset += compWidths[i];
  });
}

let cY = doc.y;
renderCompHeader(cY);
cY += 18;

const compData = [
  ['Automated Risk Prediction', '2 / 5 (Manual blood tests)', '5 / 5 (Real-time AI engine)', 'Immediate stratification at outpatient visit'],
  ['Complex Pattern Detection', '2 / 5 (Isolated lab ranges)', '5 / 5 (Deep non-linear ANN)', 'Detects silent hepatocyte injury early'],
  ['Personalized Risk Assessment', '2 / 5 (Generalized thresholds)', '5 / 5 (Patient-specific vector)', 'Individualized lifestyle & clinical pathway'],
  ['Automated Data Analysis', '2 / 5 (Fragmented paper/EHR)', '5 / 5 (Continuous IoT ingestion)', 'Zero-latency ingestion from CGM & wearables'],
  ['Prediction Explanations', '2 / 5 (Black-box doctor note)', '4 / 5 (LIME local explanations)', 'High clinician confidence with XAI factors'],
  ['Patient Monitoring Support', '2 / 5 (Infrequent annual visit)', '5 / 5 (Continuous smart telemetry)', 'Prevents irreversible cirrhosis progression']
];

compData.forEach((row, idx) => {
  const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
  doc.rect(40, cY, 515, 22).fill(bg);
  let x = 40;
  row.forEach((cell, ci) => {
    let fColor = darkText;
    if (ci === 1) fColor = lightText;
    if (ci === 2) fColor = greenColor;
    doc.fillColor(fColor).fontSize(7).font(ci === 2 ? 'Helvetica-Bold' : 'Helvetica').text(cell, x + 4, cY + 5, { width: compWidths[ci] - 8 });
    x += compWidths[ci];
  });
  cY += 22;
});

doc.y = cY + 15;

// Section 6: Ingestion Sample Cohorts Table
doc.fillColor(darkText).fontSize(11).font('Helvetica-Bold').text('6. Validated Sample Patient Cohort Records');
doc.moveDown(0.4);

const pHeaders = ['PID', 'Name', 'Age/Sex', 'BMI', 'Glucose', 'HbA1c', 'ALT/AST', 'FIB-4', 'Risk Tier'];
const pWidths = [50, 95, 45, 40, 50, 45, 55, 45, 90];

function renderPHeader(y) {
  doc.rect(40, y, 515, 18).fill('#1e293b');
  let xOffset = 40;
  pHeaders.forEach((h, i) => {
    doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold').text(h, xOffset + 4, y + 5, { width: pWidths[i] - 8 });
    xOffset += pWidths[i];
  });
}

let pY = doc.y;
renderPHeader(pY);
pY += 18;

PATIENT_DATABASE.forEach((p, idx) => {
  const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
  doc.rect(40, pY, 515, 18).fill(bg);

  const fib4 = (((p.data.age * p.data.ast) / (p.data.platelets * Math.sqrt(p.data.alt)))).toFixed(2);
  const rowData = [
    p.id,
    p.name,
    `${p.data.age}${p.data.gender === 'male' ? 'M' : 'F'}`,
    `${p.data.bmi}`,
    `${p.data.fastingGlucose}`,
    `${p.data.hba1c}%`,
    `${p.data.alt}/${p.data.ast}`,
    fib4,
    p.tier
  ];

  let x = 40;
  rowData.forEach((val, ci) => {
    let fColor = darkText;
    if (ci === 8) {
      fColor = p.tier === 'High Risk' ? redColor : p.tier === 'Moderate Risk' ? amberColor : greenColor;
    }
    doc.fillColor(fColor).fontSize(7).font(ci === 8 ? 'Helvetica-Bold' : 'Helvetica').text(val, x + 4, pY + 4, { width: pWidths[ci] - 8 });
    x += pWidths[ci];
  });
  pY += 18;
});

// Footer
doc.fontSize(7.5).fillColor(lightText).text(
  'Department of Computer Science and Engineering · Kalasalingam Academy of Research and Education · NAFLD Research Project Dataset PDF',
  40, 780, { align: 'center', width: 515 }
);

doc.end();

stream.on('finish', () => {
  console.log('NAFLD Dataset PDF successfully generated at:', outputPath);
});
