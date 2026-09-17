import { PredictionInput, PredictionResult, Patient, NeighborDetail, BiomarkerScores, WhatIfScenario } from '../types';
import { datasetSummary } from '../data/healthcareData';

/**
 * Feature normalization matching StandardScaler & One-Hot Encoding
 * used in the Healthcare_cancer_prediction_Colab.ipynb notebook.
 */
function normalizeAge(age: number): number {
  return (age - 51.5) / 21.6;
}

function normalizeBilling(billing: number): number {
  return (billing - 25539) / 14100;
}

function calculateDistance(input: PredictionInput, patient: Patient): number {
  const normAge = normalizeAge(input.age);
  const patientNormAge = normalizeAge(patient.age);
  const normBilling = normalizeBilling(input.billing);
  const patientNormBilling = normalizeBilling(patient.billing);

  let distanceSq = 0;
  distanceSq += Math.pow(normAge - patientNormAge, 2) * 1.5;
  distanceSq += Math.pow(normBilling - patientNormBilling, 2) * 0.8;
  distanceSq += (input.gender === patient.gender ? 0 : 1) * 0.5;
  distanceSq += (input.bloodType === patient.bloodType ? 0 : 1) * 0.4;
  distanceSq += (input.admissionType === patient.admissionType ? 0 : 1) * 1.2;
  distanceSq += (input.testResult === patient.testResult ? 0 : 1) * 1.8;
  distanceSq += (input.medication === patient.medication ? 0 : 1) * 0.6;
  distanceSq += (input.insurance === patient.insurance ? 0 : 1) * 0.3;

  return Math.sqrt(distanceSq);
}

function determineRiskLevel(score: number): 'Low' | 'Moderate' | 'Elevated' | 'High' {
  if (score < 25) return 'Low';
  if (score < 45) return 'Moderate';
  if (score < 65) return 'Elevated';
  return 'High';
}

/**
 * Non-recursive pure scoring function that determines nearest neighbors and raw risk score.
 */
function computeRawRiskScore(
  input: PredictionInput,
  trainingSample: Patient[]
): {
  rawScore: number;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
  isCancerPredicted: boolean;
  topK: NeighborDetail[];
  cancerNeighborCount: number;
  k: number;
  dominantNeighborCondition: string;
} {
  const scoredPatients: NeighborDetail[] = trainingSample.map((patient) => {
    const dist = calculateDistance(input, patient);
    return {
      patient,
      distance: dist,
      similarityPct: Math.round(Math.max(15, 100 - dist * 22))
    };
  });

  // Sort by closest distance
  scoredPatients.sort((a, b) => a.distance - b.distance);

  // Take top K=5 neighbors (as specified in Colab notebook)
  const k = 5;
  const topK = scoredPatients.slice(0, k);
  const cancerNeighborCount = topK.filter((item) => item.patient.isCancer).length;

  // Additional clinical risk heuristic factor based on test result & age
  let clinicalRiskMultiplier = 1.0;
  if (input.testResult === 'Abnormal') clinicalRiskMultiplier += 0.35;
  if (input.testResult === 'Inconclusive') clinicalRiskMultiplier += 0.15;
  if (input.age >= 60) clinicalRiskMultiplier += 0.25;
  if (input.admissionType === 'Urgent' || input.admissionType === 'Emergency') clinicalRiskMultiplier += 0.15;

  // Base prevalence is ~16.6%
  const neighborRatio = cancerNeighborCount / k;
  const rawScore = Math.min(
    95,
    Math.max(5, Math.round((neighborRatio * 65 + 16.6) * clinicalRiskMultiplier))
  );

  const riskLevel = determineRiskLevel(rawScore);
  const isCancerPredicted = rawScore >= 45 || cancerNeighborCount >= 3;

  // Dominant condition among neighbors
  const conditionVotes: Record<string, number> = {};
  topK.forEach((item) => {
    conditionVotes[item.patient.condition] = (conditionVotes[item.patient.condition] || 0) + 1;
  });
  const dominantNeighborCondition = Object.entries(conditionVotes).sort((a, b) => b[1] - a[1])[0][0];

  return {
    rawScore,
    riskLevel,
    isCancerPredicted,
    topK,
    cancerNeighborCount,
    k,
    dominantNeighborCondition
  };
}

export function predictCancerRisk(
  input: PredictionInput,
  trainingSample: Patient[] = datasetSummary.samplePatients
): PredictionResult {
  const {
    rawScore,
    riskLevel,
    isCancerPredicted,
    topK,
    cancerNeighborCount,
    k,
    dominantNeighborCondition
  } = computeRawRiskScore(input, trainingSample);

  // Calculate top contributing risk factors
  const riskFactors: string[] = [];
  if (input.testResult === 'Abnormal') {
    riskFactors.push('Abnormal diagnostic test result indicating systemic clinical biomarker irregularity');
  }
  if (input.age >= 60) {
    riskFactors.push(`Advanced age bracket (${input.age} years) correlates with heightened oncology risk`);
  }
  if (input.admissionType === 'Urgent' || input.admissionType === 'Emergency') {
    riskFactors.push(`Acutely elevated admission type (${input.admissionType}) requiring close inpatient surveillance`);
  }
  if (input.billing > 35000) {
    riskFactors.push(`High billing index ($${input.billing.toLocaleString()}) reflecting intensive diagnostic procedures`);
  }
  if (cancerNeighborCount > 0) {
    riskFactors.push(`${cancerNeighborCount} of ${k} nearest clinical neighbors in dataset are confirmed Cancer cases`);
  }
  if (riskFactors.length === 0) {
    riskFactors.push('Baseline demographic and normal clinical panel indicate standard health indicators');
  }

  // Clinical recommendations
  const recommendations: string[] = [];
  if (isCancerPredicted || riskLevel === 'High' || riskLevel === 'Elevated') {
    recommendations.push('Schedule priority oncology consultation and comprehensive histopathology review');
    recommendations.push('Order targeted secondary blood biomarkers (CEA, CA-125, PSA, or specific panel)');
    recommendations.push('Perform cross-sectional imaging (contrast CT / PET / MRI) to correlate with test results');
    recommendations.push('Re-evaluate medication regimen and hospital monitoring schedule');
  } else {
    recommendations.push('Continue routine preventative annual cancer screenings according to age guidelines');
    recommendations.push('Repeat routine laboratory panel in 6 months to monitor inconclusive markers');
    recommendations.push('Maintain lifestyle interventions and regular primary care physician follow-up');
  }

  // Radar/Multi-axis Clinical Biomarker Sub-scores (normalized 0-100)
  const biomarkerScores: BiomarkerScores = {
    demographic: Math.min(100, Math.round((input.age / 85) * 80 + (input.gender === 'Female' ? 10 : 5))),
    diagnostic: input.testResult === 'Abnormal' ? 90 : input.testResult === 'Inconclusive' ? 55 : 20,
    admissionAcuity: input.admissionType === 'Emergency' ? 88 : input.admissionType === 'Urgent' ? 68 : 28,
    billingResource: Math.min(100, Math.round((input.billing / 50000) * 100)),
    neighborCancerDensity: Math.round((cancerNeighborCount / k) * 100)
  };

  // What-If Simulations: Uses non-recursive computeRawRiskScore directly
  const runSim = (modifiedInput: Partial<PredictionInput>): number => {
    const simInput = { ...input, ...modifiedInput };
    const simResult = computeRawRiskScore(simInput, trainingSample);
    return simResult.rawScore;
  };

  const whatIfScenarios: WhatIfScenario[] = [];

  if (input.testResult !== 'Normal') {
    const normalScore = runSim({ testResult: 'Normal' });
    whatIfScenarios.push({
      id: 'test-normal',
      title: 'Lab Biomarker Normalization',
      description: 'If diagnostic test result was Normal instead of ' + input.testResult,
      simulatedScore: normalScore,
      delta: normalScore - rawScore,
      simulatedLevel: determineRiskLevel(normalScore)
    });
  }

  if (input.testResult !== 'Abnormal') {
    const abnormalScore = runSim({ testResult: 'Abnormal' });
    whatIfScenarios.push({
      id: 'test-abnormal',
      title: 'Diagnostic Lab Anomaly Trigger',
      description: 'If secondary diagnostics flag an Abnormal biomarker finding',
      simulatedScore: abnormalScore,
      delta: abnormalScore - rawScore,
      simulatedLevel: determineRiskLevel(abnormalScore)
    });
  }

  if (input.admissionType !== 'Elective') {
    const electiveScore = runSim({ admissionType: 'Elective' });
    whatIfScenarios.push({
      id: 'admission-elective',
      title: 'Elective Admission Protocol',
      description: 'Patient admitted as standard Elective vs current ' + input.admissionType,
      simulatedScore: electiveScore,
      delta: electiveScore - rawScore,
      simulatedLevel: determineRiskLevel(electiveScore)
    });
  } else {
    const urgentScore = runSim({ admissionType: 'Urgent' });
    whatIfScenarios.push({
      id: 'admission-urgent',
      title: 'Urgent Admission Protocol',
      description: 'If patient presentation required acute Urgent admission',
      simulatedScore: urgentScore,
      delta: urgentScore - rawScore,
      simulatedLevel: determineRiskLevel(urgentScore)
    });
  }

  const baselineBillingScore = runSim({ billing: 25539 });
  whatIfScenarios.push({
    id: 'billing-baseline',
    title: 'Average Inpatient Resource Baseline',
    description: 'Billed charges pegged to population mean ($25,539)',
    simulatedScore: baselineBillingScore,
    delta: baselineBillingScore - rawScore,
    simulatedLevel: determineRiskLevel(baselineBillingScore)
  });

  return {
    riskScore: rawScore,
    riskLevel,
    isCancerPredicted,
    confidence: Math.round((Math.abs(rawScore - 40) / 60) * 100),
    probability: Math.round(rawScore) / 100,
    riskFactors,
    recommendations,
    biomarkerScores,
    topNeighbors: topK,
    whatIfScenarios,
    nearestNeighborsSummary: {
      cancerMatches: cancerNeighborCount,
      totalChecked: k,
      dominantNeighborCondition
    }
  };
}
