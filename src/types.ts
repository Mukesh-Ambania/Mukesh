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

// ==========================================
// WISCONSIN BREAST CANCER DIAGNOSTIC TYPES
// ==========================================

export interface WisconsinFnaSample {
  id: string;
  patientId: string;
  diagnosis: 'M' | 'B'; // Malignant vs Benign
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  concavity_worst: number;
  pc1: number;
  pc2: number;
}

export interface WisconsinPredictionInput {
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;
  radius_worst: number;
  area_worst: number;
}

export interface WisconsinFeatureZScore {
  key: string;
  label: string;
  unit: string;
  rawValue: number;
  mean: number;
  std: number;
  zScore: number;
  status: 'Normal' | 'Elevated' | 'Critical';
}

export interface WisconsinNeighborMatch {
  sample: WisconsinFnaSample;
  distance: number;
  similarityPct: number;
}

export interface WisconsinPredictionResult {
  diagnosis: 'Malignant' | 'Benign';
  malignantProbability: number; // 0 to 100%
  benignProbability: number;
  confidence: number;
  kNeighbors: number;
  malignantNeighbors: number;
  benignNeighbors: number;
  pc1: number;
  pc2: number;
  featureZScores: WisconsinFeatureZScore[];
  topNeighbors: WisconsinNeighborMatch[];
  biopsyGrade: 'Grade I (Benign / Typical)' | 'Grade II (Atypical / Borderline)' | 'Grade III (High-Grade Malignant)';
  mitoticIndexScore: number; // 0 to 100
  nuclearPleomorphismScore: number; // 0 to 100
  chromatinAtypiaScore: number; // 0 to 100
  clinicalRecommendation: string;
  criticalFeatures: string[];
}

// ==========================================
// GLOBAL EPIDEMIOLOGY & HISTORICAL SURVEILLANCE (1975-2026 & ANCIENT ERA)
// ==========================================

export interface HistoricalMilestone {
  era: 'Ancient & Classical (3000 BC–1800s)' | 'Radical Surgery Era (1894–1969)' | 'Chemotherapy & Trials Era (1970–1989)' | 'Genomics & Targeted HER2 (1990–2009)' | 'Precision & Immunotherapy (2010–2019)' | 'Next-Gen AI & Liquid Biopsies (2020–2026)';
  year: string;
  exactYearNumber?: number;
  title: string;
  leadScientistOrInstitution: string;
  clinicalImpactSummary: string;
  survivalRateImpact: string;
  scientificBreakthrough: string;
  tag: 'Discovery' | 'Clinical Trial' | 'Surgical Shift' | 'Pharmacology' | 'AI & Diagnostics' | 'Genetics';
}

export interface LongitudinalDataPoint {
  year: number;
  decade: string;
  globalCases: number;
  globalDeaths: number;
  fiveYearSurvivalRate: number;
  screeningPenetrationPct: number;
  stage1DetectionPct: number; // Localized
  stage4MetastaticPct: number;
  usSeerSurvivalRate: number;
  indiaSurvivalRate: number;
  keyMilestone: string;
  dominantTreatmentModality: string;
}

export interface LiveBiopsyTelemetryEvent {
  id: string;
  timestamp: string;
  centerName: string;
  country: string;
  patientAge: number;
  biopsyMethod: 'Fine Needle Aspirate (FNA)' | 'Core Needle Biopsy (CNB)' | 'Vacuum-Assisted Biopsy (VAB)';
  meanArea: number;
  meanConcavity: number;
  meanTexture: number;
  aiClassification: 'Malignant' | 'Benign';
  aiConfidencePct: number;
  molecularSubtypePredicted: 'HR+/HER2- (Luminal A)' | 'HR+/HER2- (Luminal B)' | 'HER2-Enriched' | 'Triple-Negative (TNBC)';
  recommendedTriage: string;
  status: 'Streaming' | 'Verified' | 'Triaged';
}

export interface CountryEpidemiologyStat {
  country: string;
  countryCode: string;
  flag: string;
  region: string;
  year: number;
  totalDiagnosedCases: number;
  incidencePer100k: number;
  annualDeaths: number;
  mortalityRatePer100k: number;
  fiveYearSurvivalPct: number;
  screeningCoveragePct: number;
  earlyStageDetectionPct: number; // Detected at Stage 0-II
  lateStageDetectionPct: number;  // Detected at Stage III-IV
  medianAgeAtDiagnosis: number;
  topContributingFactors: string[];
  keyHealthInitiative: string;
}

export interface GlobalYearlySummary {
  year: number;
  globalCases: number;
  globalDeaths: number;
  globalSurvivalRate: number;
  averageScreeningRate: number;
  earlyDetectionRate: number;
  keyGlobalMilestone: string;
  ageDistribution: { ageGroup: string; percentage: number; cases: number }[];
  stageAtDiagnosis: { stage: string; percentage: number; survivalRate: number; color: string }[];
}

// ==========================================
// PREVENTION & MORTALITY REDUCTION TYPES
// ==========================================

export interface PreventionStrategyItem {
  id: string;
  category: 'Primary Prevention (Lifestyle)' | 'Secondary Screening (Early Detection)' | 'Genetic High-Risk Surveillance' | 'Clinical & Policy System';
  title: string;
  impactScorePct: number; // e.g., 25% reduction in mortality
  evidenceLevel: 'Level 1A (Meta-Analysis)' | 'Level 1B (RCT)' | 'Level 2A (Cohort)';
  implementationTimeline: string;
  clinicalDescription: string;
  actionableDirectives: string[];
  targetDemographic: string;
  goldStandardRecommendation: string;
}

// ==========================================
// PRECISION ONCOLOGY & CASE-BY-CASE PRESCRIPTION TYPES
// ==========================================

export interface PatientCaseParameters {
  age: number;
  menopausalStatus: 'Premenopausal' | 'Postmenopausal';
  tumorSizeMm: number; // e.g. 18 mm (T1c)
  lymphNodeInvolved: number; // e.g. 0 (N0), 1-3 (N1), 4-9 (N2)
  metastasisPresent: boolean;
  erStatus: 'Positive (>10%)' | 'Low-Positive (1-9%)' | 'Negative (<1%)';
  prStatus: 'Positive' | 'Negative';
  her2Status: 'Negative (IHC 0/1+)' | 'Equivocal (FISH required)' | 'Positive (IHC 3+ / FISH Amplified)';
  ki67Index: number; // proliferation %
  histologicalGrade: 'Grade 1 (Well-Differentiated)' | 'Grade 2 (Intermediate)' | 'Grade 3 (Poorly Differentiated)';
  brcaMutation: 'None / Wild-Type' | 'BRCA1 Pathogenic' | 'BRCA2 Pathogenic';
  oncotypeDxRecurrenceScore?: number; // 0-100
}

export interface PrecisionPrescriptionResult {
  molecularSubtype: 'HR+/HER2- (Luminal A)' | 'HR+/HER2- (Luminal B)' | 'HER2-Enriched (HR- / HER2+)' | 'Triple-Positive (HR+ / HER2+)' | 'Triple-Negative (TNBC)';
  clinicalStage: 'Stage 0 (DCIS)' | 'Stage IA' | 'Stage IB' | 'Stage IIA' | 'Stage IIB' | 'Stage IIIA' | 'Stage IIIB' | 'Stage IIIC' | 'Stage IV (Metastatic)';
  systemicTherapyCategory: string;
  firstLineRegimen: string;
  regimenCycleDetails: string;
  targetedTherapy?: string;
  immunotherapy?: string;
  endocrineTherapy?: string;
  endocrineDurationYears?: number;
  surgicalProtocol: string;
  radiationProtocol: string;
  chemoBenefitBenefitScore: string;
  projected5YearSurvivalRate: number;
  projected10YearRecurrenceRisk: number;
  postTreatmentSurveillance: string[];
  clinicalRationaleSummary: string;
  nccnGuidelineRef: string;
}

export interface PredefinedArchetypeCase {
  id: string;
  caseName: string;
  shortDescription: string;
  patientAge: number;
  stage: string;
  subtype: string;
  defaultInput: PatientCaseParameters;
}
