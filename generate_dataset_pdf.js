import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAllHospitalData } from './src/data/tamilNaduHospitals.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hospitals = generateAllHospitalData();
const outputPath = path.join(__dirname, 'Medi_Management_Complete_Dataset.pdf');
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

// Header
doc.rect(40, 40, 515, 60).fill('#0f172a');
doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('MEDI-STATISTICS DATASET REPORT', 55, 52);
doc.fontSize(10).font('Helvetica').text('Comprehensive Health Infrastructure & Disease Surveillance Dataset', 55, 78);

doc.moveDown(3);

// Meta Info
doc.fillColor(darkText).fontSize(12).font('Helvetica-Bold').text('1. Dataset Overview');
doc.moveDown(0.5);
doc.fontSize(9).font('Helvetica').text(
  'This document consolidates the complete underlying datasets powering the Medi-Management System:\n' +
  '• Disease Surveillance Outbreak Dataset: Based on official weekly disease surveillance reporting (refer to accompanying diseases.pdf for raw field telemetry).\n' +
  '• Regional Hospital Infrastructure & Real-Time Capacity Dataset: 30 Hospitals across Tamil Nadu districts with bed, ICU, emergency, ventilator, and geolocation metrics.\n' +
  `• Extraction Date: ${new Date().toLocaleDateString()} | Records: 30 Healthcare Facilities | Geographic Scope: Madurai & Virudhunagar Regions.`
);

doc.moveDown(1.5);

// Aggregate Stats Summary Table
doc.fontSize(12).font('Helvetica-Bold').text('2. Key Dataset Aggregate Indicators');
doc.moveDown(0.5);

const totalBeds = hospitals.reduce((acc, h) => acc + (h.generalBeds?.total || 0), 0);
const availBeds = hospitals.reduce((acc, h) => acc + (h.generalBeds?.available || 0), 0);
const totalICU = hospitals.reduce((acc, h) => acc + (h.icuStatus?.total || 0), 0);
const availICU = hospitals.reduce((acc, h) => acc + (h.icuStatus?.available || 0), 0);
const totalVents = hospitals.reduce((acc, h) => acc + (h.ventilators?.total || 0), 0);
const availVents = hospitals.reduce((acc, h) => acc + (h.ventilators?.available || 0), 0);

const startX = 40;
let curY = doc.y;

const metrics = [
  { label: 'Total Hospitals Monitored', val: hospitals.length.toString() },
  { label: 'Total Inpatient Beds', val: totalBeds.toString() },
  { label: 'Beds Currently Available', val: `${availBeds} (${Math.round((availBeds/totalBeds)*100)}%)` },
  { label: 'ICU Capacity', val: `${availICU} avail / ${totalICU} total` },
  { label: 'Ventilators Onboarded', val: `${availVents} avail / ${totalVents} total` },
];

metrics.forEach((m, idx) => {
  doc.rect(startX + (idx * 103), curY, 100, 40).fill('#f1f5f9');
  doc.fillColor(lightText).fontSize(7.5).font('Helvetica-Bold').text(m.label, startX + (idx * 103) + 4, curY + 6, { width: 92 });
  doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text(m.val, startX + (idx * 103) + 4, curY + 22, { width: 92 });
});

doc.y = curY + 55;

// Hospital Records Section
doc.fillColor(darkText).fontSize(12).font('Helvetica-Bold').text('3. Healthcare Facilities Dataset (30 Entities)');
doc.moveDown(0.5);

const headers = ['ID', 'Hospital Name', 'District', 'Beds (Av/Tot)', 'ICU (Av/Tot)', 'Vent.', 'Occ %', 'Contact'];
const colWidths = [28, 140, 70, 72, 60, 36, 42, 67];

// Table Header
function renderTableHeader(y) {
  doc.rect(40, y, 515, 20).fill('#1e293b');
  let xOffset = 40;
  headers.forEach((h, i) => {
    doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold').text(h, xOffset + 3, y + 6, { width: colWidths[i] - 6 });
    xOffset += colWidths[i];
  });
}

let tableY = doc.y;
renderTableHeader(tableY);
tableY += 20;

hospitals.forEach((h, index) => {
  if (tableY > 760) {
    doc.addPage();
    tableY = 40;
    renderTableHeader(tableY);
    tableY += 20;
  }

  const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
  doc.rect(40, tableY, 515, 18).fill(bg);

  let xOffset = 40;
  const rowData = [
    h.id,
    h.name,
    h.district,
    `${h.generalBeds?.available || 0} / ${h.generalBeds?.total || 0}`,
    `${h.icuStatus?.available || 0} / ${h.icuStatus?.total || 0}`,
    `${h.ventilators?.available || 0}`,
    `${h.occupancyPercent}%`,
    h.contact || '-'
  ];

  rowData.forEach((val, i) => {
    let fontColor = darkText;
    if (i === 6) {
      fontColor = h.occupancyPercent > 85 ? redColor : h.occupancyPercent > 70 ? '#d97706' : greenColor;
    }
    doc.fillColor(fontColor).fontSize(7).font('Helvetica').text(val, xOffset + 3, tableY + 5, { width: colWidths[i] - 6, lineBreak: false });
    xOffset += colWidths[i];
  });

  tableY += 18;
});

// Outbreak Reference Section
doc.addPage();
doc.rect(40, 40, 515, 28).fill('#0f172a');
doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('4. Disease Outbreak Surveillance Dataset Mapping', 50, 48);

doc.moveDown(2);
doc.fillColor(darkText).fontSize(10).font('Helvetica').text(
  'The epidemiological telemetry in this system correlates hospital demand with regional outbreak indicators.\n' +
  'The primary national disease outbreak report is stored as an official 14-page document:\n\n' +
  '• File: diseases.pdf (Size: ~915 KB, 14 Pages)\n' +
  '• Source: Integrated Disease Surveillance Programme (IDSP), National Centre for Disease Control\n' +
  '• Primary Tracked Outbreaks: Dengue Fever, Viral Pyrexia, Acute Diarrheal Disease (ADD), Malaria, Leptospirosis, Respiratory Syndromes\n' +
  '• Surveillance Granularity: State, District, Reporting Unit, Laboratory Confirmation, Case Totals, Mortality, Preventive Interventions\n'
);

doc.moveDown(1);
doc.fontSize(11).font('Helvetica-Bold').text('Active Disease Severity & Surge Index:');
doc.moveDown(0.5);

const diseaseStats = [
  { disease: 'Dengue Fever', category: 'Vector-borne', surge: '+15%', status: 'Active Surveillance - Monsoon Alert' },
  { disease: 'Viral Pyrexia', category: 'Seasonal', surge: '+8%', status: 'Moderate Load' },
  { disease: 'Gastroenteritis (ADD)', category: 'Water-borne', surge: '-5%', status: 'Stable - Water Treatment Active' },
  { disease: 'Acute Respiratory Illness', category: 'Airborne / Viral', surge: '+12%', status: 'Elevated - Urban Centers' }
];

let dY = doc.y;
diseaseStats.forEach((ds) => {
  doc.rect(40, dY, 515, 28).fill('#f8fafc');
  doc.rect(40, dY, 4, 28).fill(ds.surge.startsWith('+') ? redColor : greenColor);
  doc.fillColor(darkText).fontSize(9).font('Helvetica-Bold').text(ds.disease, 52, dY + 6);
  doc.fillColor(lightText).fontSize(7.5).font('Helvetica').text(`Category: ${ds.category} | Trend: ${ds.surge}`, 52, dY + 16);
  doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold').text(ds.status, 300, dY + 10, { width: 245, align: 'right' });
  dY += 34;
});

// Footer
doc.fontSize(8).fillColor(lightText).text(
  'Generated automatically by Medi-Management System. Files available locally: diseases.pdf & Medi_Management_Complete_Dataset.pdf',
  40, 780, { align: 'center', width: 515 }
);

doc.end();

stream.on('finish', () => {
  console.log('PDF successfully created at:', outputPath);
});
