export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | string;
  bloodType: string;
  condition: string;
  dateAdm: string;
  doctor: string;
  hospital: string;
  insurance: string;
  billing: number;
  room: string;
  admissionType: 'Urgent' | 'Emergency' | 'Elective' | string;
  dischargeDate: string;
  medication: string;
  testResult: 'Normal' | 'Inconclusive' | 'Abnormal' | string;
  isCancer: boolean;
}

export interface AgeGroupMetric {
  total: number;
  cancer: number;
}

export interface BillingStat {
  count: number;
  avg: number;
}

export interface DatasetSummary {
  totalRecords: number;
  avgBilling: number;
  totalBilling: number;
  conditions: Record<string, number>;
  genders: Record<string, number>;
  bloodTypes: Record<string, number>;
  testResults: Record<string, number>;
  admissions: Record<string, number>;
  medications: Record<string, number>;
  insurances: Record<string, number>;
  ageGroups: Record<string, AgeGroupMetric>;
  conditionBilling: Record<string, BillingStat>;
  insuranceBilling: Record<string, BillingStat>;
  samplePatients: Patient[];
}

export interface PredictionInput {
  age: number;
  gender: string;
  bloodType: string;
  insurance: string;
  billing: number;
  admissionType: string;
  medication: string;
  testResult: string;
}

export interface NeighborDetail {
  patient: Patient;
  distance: number;
  similarityPct: number;
}

export interface BiomarkerScores {
  demographic: number;
  diagnostic: number;
  admissionAcuity: number;
  billingResource: number;
  neighborCancerDensity: number;
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  simulatedScore: number;
  delta: number;
  simulatedLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
}

export interface PredictionResult {
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
  isCancerPredicted: boolean;
  confidence: number;
  probability: number;
  riskFactors: string[];
  recommendations: string[];
  biomarkerScores: BiomarkerScores;
  topNeighbors: NeighborDetail[];
  whatIfScenarios: WhatIfScenario[];
  nearestNeighborsSummary: {
    cancerMatches: number;
    totalChecked: number;
    dominantNeighborCondition: string;
  };
}

export interface ModelMetrics {
  algorithm: string;
  kNeighbors: number;
  accuracy: number;
  precisionCancer: number;
  recallCancer: number;
  f1Cancer: number;
  precisionNonCancer: number;
  recallNonCancer: number;
  f1NonCancer: number;
  testSetSize: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  };
}
