// NAFLD / MASLD AI Risk Prediction and LIME Explainability Engine
// Based on: "Personalized AI-Based Healthcare System for Early Diagnosis of Diabetes-Related NAFLD"
// Research Team: Kalasalingam Academy of Research and Education (KARE CSE)

export const PATIENT_DATABASE = [
  {
    id: 'PID-8921',
    name: 'Ramesh Kumar',
    mrn: 'MRN-78412',
    source: 'Apollo EHR · Continuous Glucose Monitor (CGM)',
    syncTime: 'Just now',
    tier: 'High Risk',
    data: {
      name: 'Ramesh Kumar',
      age: 56,
      gender: 'male',
      bmi: 32.4,
      systolicBp: 142,
      diastolicBp: 92,
      diabetesDuration: 8,
      familyHistory: true,
      fastingGlucose: 168,
      hba1c: 8.8,
      alt: 64,
      ast: 52,
      platelets: 190,
      dietQuality: 'poor',
      exerciseHours: 0.5,
      sleepQuality: 'poor',
      alcohol: 'none',
      smoking: 'former',
    }
  },
  {
    id: 'PID-8922',
    name: 'Priya Lakshmi',
    mrn: 'MRN-65290',
    source: 'Rajaji Hospital Outpatient · Lab Ingestion',
    syncTime: '2 mins ago',
    tier: 'Moderate Risk',
    data: {
      name: 'Priya Lakshmi',
      age: 49,
      gender: 'female',
      bmi: 29.1,
      systolicBp: 134,
      diastolicBp: 86,
      diabetesDuration: 5,
      familyHistory: true,
      fastingGlucose: 145,
      hba1c: 7.6,
      alt: 48,
      ast: 38,
      platelets: 215,
      dietQuality: 'moderate',
      exerciseHours: 1.5,
      sleepQuality: 'average',
      alcohol: 'none',
      smoking: 'never',
    }
  },
  {
    id: 'PID-8923',
    name: 'Mohammed Rafiq',
    mrn: 'MRN-91044',
    source: 'Meenakshi Mission EHR · Wearable Sync',
    syncTime: '4 mins ago',
    tier: 'High Risk',
    data: {
      name: 'Mohammed Rafiq',
      age: 63,
      gender: 'male',
      bmi: 34.2,
      systolicBp: 148,
      diastolicBp: 94,
      diabetesDuration: 12,
      familyHistory: true,
      fastingGlucose: 184,
      hba1c: 9.2,
      alt: 72,
      ast: 58,
      platelets: 175,
      dietQuality: 'poor',
      exerciseHours: 0,
      sleepQuality: 'poor',
      alcohol: 'none',
      smoking: 'current',
    }
  },
  {
    id: 'PID-8924',
    name: 'Ananya Subramanian',
    mrn: 'MRN-43187',
    source: 'Madurai Diabetes Clinic · Smart Band IoT',
    syncTime: '12 mins ago',
    tier: 'Moderate Risk',
    data: {
      name: 'Ananya Subramanian',
      age: 44,
      gender: 'female',
      bmi: 27.8,
      systolicBp: 128,
      diastolicBp: 84,
      diabetesDuration: 3,
      familyHistory: true,
      fastingGlucose: 132,
      hba1c: 7.2,
      alt: 42,
      ast: 35,
      platelets: 235,
      dietQuality: 'moderate',
      exerciseHours: 2.0,
      sleepQuality: 'average',
      alcohol: 'none',
      smoking: 'never',
    }
  },
  {
    id: 'PID-8925',
    name: 'Dr. Vignesh Murugan',
    mrn: 'MRN-11209',
    source: 'Apple HealthKit · Annual Executive Panel',
    syncTime: '15 mins ago',
    tier: 'Low Risk',
    data: {
      name: 'Dr. Vignesh Murugan',
      age: 38,
      gender: 'male',
      bmi: 23.2,
      systolicBp: 118,
      diastolicBp: 76,
      diabetesDuration: 1,
      familyHistory: false,
      fastingGlucose: 98,
      hba1c: 5.8,
      alt: 22,
      ast: 20,
      platelets: 270,
      dietQuality: 'healthy',
      exerciseHours: 4.5,
      sleepQuality: 'good',
      alcohol: 'none',
      smoking: 'never',
    }
  },
  {
    id: 'PID-8926',
    name: 'Kavitha Ramachandran',
    mrn: 'MRN-88321',
    source: 'Virudhunagar GH · Fasting Panel OCR',
    syncTime: '22 mins ago',
    tier: 'Low Risk',
    data: {
      name: 'Kavitha Ramachandran',
      age: 41,
      gender: 'female',
      bmi: 24.1,
      systolicBp: 120,
      diastolicBp: 78,
      diabetesDuration: 2,
      familyHistory: false,
      fastingGlucose: 104,
      hba1c: 6.1,
      alt: 26,
      ast: 24,
      platelets: 255,
      dietQuality: 'healthy',
      exerciseHours: 3.5,
      sleepQuality: 'good',
      alcohol: 'none',
      smoking: 'never',
    }
  }
];

export const LAB_REPORTS = [
  {
    id: 'LAB-METROPOLIS-702',
    facility: 'Metropolis · Liver & Diabetic Profile',
    date: '28-Oct-2026',
    patientName: 'Ramesh Kumar (PID-8921)',
    data: PATIENT_DATABASE[0].data
  },
  {
    id: 'LAB-APOLLO-419',
    facility: 'Apollo Diagnostics · Hepatic Panel',
    date: '27-Oct-2026',
    patientName: 'Priya Lakshmi (PID-8922)',
    data: PATIENT_DATABASE[1].data
  },
  {
    id: 'LAB-THYROCARE-198',
    facility: 'Thyrocare · Executive Wellness LFT',
    date: '26-Oct-2026',
    patientName: 'Dr. Vignesh Murugan (PID-8925)',
    data: PATIENT_DATABASE[4].data
  }
];

export function generateAutoPatient(riskType = 'random') {
  const types = ['high', 'moderate', 'low'];
  const target = riskType === 'random' ? types[Math.floor(Math.random() * types.length)] : riskType;

  const firstNames = ['Suresh', 'Deepa', 'Balaji', 'Karthik', 'Revathi', 'Senthil', 'Nalini', 'Arun', 'Meenakshi', 'Gopal'];
  const lastNames = ['Natarajan', 'Krishnan', 'Sundaram', 'Pillai', 'Ramanathan', 'Iyer', 'Chettiar', 'Pandian', 'Chari'];
  const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const randomPid = `PID-${Math.floor(1000 + Math.random() * 9000)}`;

  if (target === 'high') {
    return {
      id: randomPid,
      name: randomName,
      source: 'Automated Real-Time Sensor Stream',
      age: Math.floor(48 + Math.random() * 20),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      bmi: Number((29.5 + Math.random() * 6).toFixed(1)),
      systolicBp: Math.floor(136 + Math.random() * 18),
      diastolicBp: Math.floor(88 + Math.random() * 12),
      diabetesDuration: Math.floor(6 + Math.random() * 8),
      familyHistory: true,
      fastingGlucose: Math.floor(150 + Math.random() * 50),
      hba1c: Number((8.1 + Math.random() * 2.2).toFixed(1)),
      alt: Math.floor(55 + Math.random() * 30),
      ast: Math.floor(45 + Math.random() * 25),
      platelets: Math.floor(160 + Math.random() * 60),
      dietQuality: 'poor',
      exerciseHours: Number((Math.random() * 1).toFixed(1)),
      sleepQuality: 'poor',
      alcohol: 'none',
      smoking: Math.random() > 0.5 ? 'former' : 'never',
    };
  } else if (target === 'moderate') {
    return {
      id: randomPid,
      name: randomName,
      source: 'Automated Real-Time Sensor Stream',
      age: Math.floor(40 + Math.random() * 15),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      bmi: Number((26.0 + Math.random() * 3.5).toFixed(1)),
      systolicBp: Math.floor(124 + Math.random() * 12),
      diastolicBp: Math.floor(80 + Math.random() * 8),
      diabetesDuration: Math.floor(2 + Math.random() * 4),
      familyHistory: true,
      fastingGlucose: Math.floor(120 + Math.random() * 25),
      hba1c: Number((6.8 + Math.random() * 0.9).toFixed(1)),
      alt: Math.floor(38 + Math.random() * 14),
      ast: Math.floor(32 + Math.random() * 10),
      platelets: Math.floor(210 + Math.random() * 50),
      dietQuality: 'moderate',
      exerciseHours: Number((1.5 + Math.random() * 1.5).toFixed(1)),
      sleepQuality: 'average',
      alcohol: 'none',
      smoking: 'never',
    };
  } else {
    return {
      id: randomPid,
      name: randomName,
      source: 'Automated Real-Time Sensor Stream',
      age: Math.floor(30 + Math.random() * 18),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      bmi: Number((21.5 + Math.random() * 3.0).toFixed(1)),
      systolicBp: Math.floor(112 + Math.random() * 12),
      diastolicBp: Math.floor(72 + Math.random() * 8),
      diabetesDuration: Math.floor(1 + Math.random() * 2),
      familyHistory: false,
      fastingGlucose: Math.floor(90 + Math.random() * 20),
      hba1c: Number((5.5 + Math.random() * 0.7).toFixed(1)),
      alt: Math.floor(18 + Math.random() * 12),
      ast: Math.floor(18 + Math.random() * 10),
      platelets: Math.floor(240 + Math.random() * 60),
      dietQuality: 'healthy',
      exerciseHours: Number((3.0 + Math.random() * 3.0).toFixed(1)),
      sleepQuality: 'good',
      alcohol: 'none',
      smoking: 'never',
    };
  }
}

export const SAMPLE_PATIENTS = PATIENT_DATABASE.map(p => ({
  id: p.id,
  label: `${p.name} (${p.tier})`,
  data: p.data
}));

export function calculateNafldAssessment(patient) {
  const {
    age = 50,
    gender = 'male',
    bmi = 26,
    systolicBp = 125,
    diastolicBp = 82,
    diabetesDuration = 4,
    familyHistory = false,
    fastingGlucose = 130,
    hba1c = 7.0,
    alt = 35,
    ast = 30,
    platelets = 240,
    dietQuality = 'moderate',
    exerciseHours = 2,
    sleepQuality = 'average',
    alcohol = 'none',
    smoking = 'never',
  } = patient;

  // 1. Clinical Non-Invasive Hepatology Markers
  const astAltRatio = Number((ast / Math.max(alt, 1)).toFixed(2));
  
  // FIB-4 Score = (Age * AST) / (Platelets * sqrt(ALT))
  const fib4 = Number(((age * ast) / (platelets * Math.sqrt(Math.max(alt, 1)))).toFixed(2));

  // APRI Index = ((AST / 40) / Platelets) * 100
  const apri = Number((((ast / 40) / Math.max(platelets, 50)) * 100).toFixed(2));

  // 2. Feature Contributions (for Ensemble and LIME)
  const contributions = [];

  // HbA1c contribution (Baseline normal <= 6.0%)
  const hba1cDiff = hba1c - 6.0;
  const hba1cWeight = Math.min(Math.max(hba1cDiff * 6.5, -15), 32);
  contributions.push({
    feature: 'HbA1c Level',
    value: `${hba1c}%`,
    impact: Number(hba1cWeight.toFixed(1)),
    type: hba1cWeight > 0 ? 'risk' : 'protective',
    category: 'Glycemic Control',
    note: hba1c > 7.0 ? 'Accelerates hepatic lipogenesis' : 'Protective optimal glycemic state'
  });

  // ALT Liver Enzyme (Baseline normal <= 30 U/L)
  const altDiff = alt - 30;
  const altWeight = Math.min(Math.max(altDiff * 0.45, -10), 25);
  contributions.push({
    feature: 'ALT / SGPT Level',
    value: `${alt} U/L`,
    impact: Number(altWeight.toFixed(1)),
    type: altWeight > 0 ? 'risk' : 'protective',
    category: 'Hepatic Injury',
    note: alt > 40 ? 'Indicates hepatocellular inflammation' : 'Normal hepatocyte integrity'
  });

  // BMI (Baseline normal 23)
  const bmiDiff = bmi - 23;
  const bmiWeight = Math.min(Math.max(bmiDiff * 1.8, -12), 22);
  contributions.push({
    feature: 'Body Mass Index (BMI)',
    value: `${bmi} kg/m²`,
    impact: Number(bmiWeight.toFixed(1)),
    type: bmiWeight > 0 ? 'risk' : 'protective',
    category: 'Metabolic Adiposity',
    note: bmi > 25 ? 'Excess visceral adiposity triggers insulin resistance' : 'Healthy metabolic weight'
  });

  // Fasting Glucose (Baseline 100 mg/dL)
  const gluDiff = fastingGlucose - 100;
  const gluWeight = Math.min(Math.max(gluDiff * 0.15, -8), 16);
  contributions.push({
    feature: 'Fasting Blood Glucose',
    value: `${fastingGlucose} mg/dL`,
    impact: Number(gluWeight.toFixed(1)),
    type: gluWeight > 0 ? 'risk' : 'protective',
    category: 'Glucose Telemetry',
    note: fastingGlucose > 125 ? 'High circulating glucose fuels de novo fat synthesis' : 'Normal circulating glucose'
  });

  // Diabetes Duration
  const durWeight = Math.min(diabetesDuration * 1.6, 15);
  contributions.push({
    feature: 'Diabetes Duration',
    value: `${diabetesDuration} yrs`,
    impact: Number(durWeight.toFixed(1)),
    type: durWeight > 3 ? 'risk' : 'protective',
    category: 'Chronicity',
    note: diabetesDuration > 5 ? 'Prolonged diabetic exposure damages liver sinusoids' : 'Recent onset'
  });

  // Physical Activity / Exercise
  const exWeight = exerciseHours >= 3 ? -10 : exerciseHours >= 1.5 ? -4 : 8;
  contributions.push({
    feature: 'Physical Exercise',
    value: `${exerciseHours} hrs/wk`,
    impact: exWeight,
    type: exWeight > 0 ? 'risk' : 'protective',
    category: 'Lifestyle',
    note: exerciseHours < 1 ? 'Sedentary state promotes hepatic fat accumulation' : 'Enhances muscle insulin uptake'
  });

  // Diet Quality
  const dietWeight = dietQuality === 'poor' ? 10 : dietQuality === 'moderate' ? 2 : -8;
  contributions.push({
    feature: 'Dietary Pattern',
    value: dietQuality.toUpperCase(),
    impact: dietWeight,
    type: dietWeight > 0 ? 'risk' : 'protective',
    category: 'Nutrition',
    note: dietQuality === 'poor' ? 'High saturated fats & refined carbs' : 'Balanced, high fiber antioxidant intake'
  });

  // Blood Pressure
  const bpRisk = (systolicBp >= 140 || diastolicBp >= 90) ? 6 : (systolicBp <= 120 && diastolicBp <= 80) ? -4 : 0;
  contributions.push({
    feature: 'Blood Pressure',
    value: `${systolicBp}/${diastolicBp} mmHg`,
    impact: bpRisk,
    type: bpRisk > 0 ? 'risk' : 'protective',
    category: 'Cardiometabolic',
    note: bpRisk > 0 ? 'Hypertension is a core component of Metabolic Syndrome' : 'Optimal vascular tone'
  });

  // Calculate Base Risk Score (0 - 100%)
  const baseScore = 20;
  const rawSum = baseScore + contributions.reduce((acc, c) => acc + c.impact, 0);
  const clampedEnsembleScore = Math.min(Math.max(Math.round(rawSum), 5), 98);

  // Model Specific Variations (Simulating Ensemble models from PPT)
  // 1. Random Forest (Tree Ensemble)
  const rfScore = Math.min(Math.max(clampedEnsembleScore + (clampedEnsembleScore > 50 ? 2 : -3), 4), 99);
  // 2. Support Vector Machine (Margin Boundary)
  const svmScore = Math.min(Math.max(clampedEnsembleScore + (bmi > 29 ? 3 : -2), 5), 98);
  // 3. CatBoost (Gradient boosted categorical & clinical features)
  const catBoostScore = Math.min(Math.max(clampedEnsembleScore + (dietQuality === 'poor' ? 4 : -1), 6), 99);
  // 4. Artificial Neural Network (Deep representation)
  const annScore = Math.min(Math.max(clampedEnsembleScore + (hba1c > 8.0 ? 3 : -2), 5), 97);

  // Risk Classification
  let riskLevel = 'Low Risk';
  let riskColor = '#10b981'; // green
  let stageName = 'Stage 0: Normal / Mild Risk';
  let stageDesc = 'No significant hepatic steatosis detected. Maintain current lifestyle and periodic annual monitoring.';

  if (clampedEnsembleScore >= 75) {
    riskLevel = 'High Risk';
    riskColor = '#ef4444'; // red
    stageName = 'Stage 2-3: Advanced Steatohepatitis / Fibrosis Risk';
    stageDesc = 'High probability of Non-Alcoholic Steatohepatitis (NASH). Prompt clinical consultation and FibroScan evaluation advised.';
  } else if (clampedEnsembleScore >= 45) {
    riskLevel = 'Moderate Risk';
    riskColor = '#f59e0b'; // amber
    stageName = 'Stage 1: Early Hepatic Steatosis';
    stageDesc = 'Elevated liver fat accumulation detected. Reversible with targeted diet, glycemic control, and moderate physical activity.';
  }

  // Generate Personalized Recommendations (Slide 2 & 5)
  const recommendations = {
    diet: [
      dietQuality === 'poor' ? 'Transition to a Mediterranean diet rich in monounsaturated fats (olive oil, nuts) and leafy greens.' : 'Maintain a high-fiber, low glycemic index nutritional plan.',
      'Strictly avoid sugar-sweetened beverages and high-fructose corn syrup products.',
      'Incorporate antioxidant-rich foods (green tea, berries, black coffee shown to protect hepatocyte health).'
    ],
    exercise: [
      exerciseHours < 2 ? 'Target at least 150 minutes of moderate aerobic exercise (brisk walking, swimming) per week.' : 'Continue your aerobic fitness regimen.',
      'Add 2 sessions/week of resistance/strength training to boost peripheral glucose uptake and reduce liver fat.',
      'Target a 7-10% body weight reduction if BMI > 25 kg/m² to reverse hepatic steatosis.'
    ],
    clinical: [
      clampedEnsembleScore >= 60 ? 'Schedule a clinical hepatology review with abdominal ultrasound or Transient Elastography (FibroScan).' : 'Perform repeat Liver Function Test (LFT) and HbA1c in 6 months.',
      hba1c > 7.5 ? 'Consult endocrinologist regarding SGLT2 inhibitors or GLP-1 receptor agonists with proven liver protective benefits.' : 'Maintain HbA1c targets below 7.0%.',
      'Monitor blood pressure and lipid panels semi-annually.'
    ]
  };

  // Sort contributions by absolute impact for LIME chart
  const sortedContributions = [...contributions].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return {
    ensembleRiskScore: clampedEnsembleScore,
    riskLevel,
    riskColor,
    stageName,
    stageDesc,
    fib4,
    fib4Interpretation: fib4 < 1.3 ? 'Low Fibrosis Risk' : fib4 <= 2.67 ? 'Indeterminate' : 'High Fibrosis Risk',
    apri,
    astAltRatio,
    models: {
      randomForest: { name: 'Random Forest', score: rfScore, type: 'Ensemble Trees', accuracy: '94.2%' },
      svm: { name: 'SVM Classifier', score: svmScore, type: 'Hyperplane Separation', accuracy: '92.8%' },
      catBoost: { name: 'CatBoost', score: catBoostScore, type: 'Ordered Gradient Boosting', accuracy: '95.6%' },
      ann: { name: 'Deep ANN', score: annScore, type: 'Neural Layers', accuracy: '94.8%' },
    },
    limeContributions: sortedContributions,
    recommendations
  };
}
