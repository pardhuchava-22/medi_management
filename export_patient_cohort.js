import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATIENT_DATABASE, generateAutoPatient, calculateNafldAssessment } from './src/data/nafldModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allPatientsRaw = [...PATIENT_DATABASE];

// Add 45 more representative patient records to create a rich 50+ patient registry
for (let i = 0; i < 18; i++) {
  const p = generateAutoPatient('high');
  allPatientsRaw.push({
    id: `PID-${9000 + i}`,
    name: p.name,
    mrn: `MRN-${60000 + i}`,
    source: i % 2 === 0 ? 'Apollo Speciality EHR · CGM Sync' : 'Rajaji Govt Hospital Outpatient',
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

const enrichedCohort = allPatientsRaw.map((item, index) => {
  const p = item.data;
  const assess = calculateNafldAssessment(p);

  return {
    sNo: index + 1,
    id: item.id,
    mrn: item.mrn || `MRN-${70000 + index}`,
    name: p.name || item.name,
    age: p.age,
    gender: p.gender,
    bmi: p.bmi,
    systolicBp: p.systolicBp,
    diastolicBp: p.diastolicBp,
    diabetesDuration: p.diabetesDuration,
    familyHistory: p.familyHistory,
    fastingGlucose: p.fastingGlucose,
    hba1c: p.hba1c,
    alt: p.alt,
    ast: p.ast,
    astAltRatio: assess.astAltRatio,
    platelets: p.platelets,
    fib4: assess.fib4,
    fib4Category: assess.fib4Interpretation,
    apri: assess.apri,
    dietQuality: p.dietQuality,
    exerciseHours: p.exerciseHours,
    sleepQuality: p.sleepQuality,
    smoking: p.smoking,
    alcohol: p.alcohol || 'none',
    riskScore: assess.ensembleRiskScore,
    riskLevel: assess.riskLevel,
    stageName: assess.stageName,
    recommendation: assess.recommendations.clinical[0],
    source: item.source,
    syncTime: item.syncTime || 'Recent',
    rawData: p
  };
});

const content = `// Auto-generated 57-patient cohort registry matching NAFLD_Patient_Database.xlsx and .csv
export const FULL_PATIENT_COHORT = ${JSON.stringify(enrichedCohort, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'patientCohort.js'), content, 'utf8');
console.log('✅ Wrote src/data/patientCohort.js with', enrichedCohort.length, 'patients');
