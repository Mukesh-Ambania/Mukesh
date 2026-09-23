import {
  WisconsinPredictionInput,
  WisconsinPredictionResult,
  WisconsinFeatureZScore,
  WisconsinNeighborMatch
} from '../types';
import {
  wisconsinFeatureStats,
  wisconsinBenchmarkBiopsies
} from '../data/wisconsinBreastCancerData';

/**
 * Standardizes a single feature value using empirical mean & std
 */
function standardize(key: keyof typeof wisconsinFeatureStats, val: number): number {
  const stat = wisconsinFeatureStats[key];
  if (!stat) return 0;
  return (val - stat.mean) / stat.std;
}

/**
 * Computes Euclidean distance between normalized input and normalized reference sample
 */
function computeBiopsyDistance(input: WisconsinPredictionInput, sample: typeof wisconsinBenchmarkBiopsies[0]): number {
  const keys: (keyof typeof wisconsinFeatureStats)[] = [
    'radius_mean',
    'texture_mean',
    'perimeter_mean',
    'area_mean',
    'smoothness_mean',
    'compactness_mean',
    'concavity_mean',
    'concave_points_mean',
    'symmetry_mean',
    'fractal_dimension_mean',
    'radius_worst',
    'area_worst'
  ];

  let sumSq = 0;
  for (const k of keys) {
    const inputZ = standardize(k, input[k]);
    const sampleZ = standardize(k, sample[k as keyof typeof sample] as number);
    // Weight critical morphometry features slightly higher (as identified in EDA)
    let weight = 1.0;
    if (k === 'concave_points_mean' || k === 'concavity_mean') weight = 1.6;
    if (k === 'area_mean' || k === 'area_worst' || k === 'radius_worst') weight = 1.4;
    sumSq += Math.pow(inputZ - sampleZ, 2) * weight;
  }

  return Math.sqrt(sumSq);
}

/**
 * Predicts Breast Cancer diagnosis from cytological FNA biopsy measurements using high-precision metric classification
 */
export function predictWisconsinBiopsy(
  input: WisconsinPredictionInput,
  k: number = 5
): WisconsinPredictionResult {
  // 1. Calculate distances to all benchmark biopsy samples
  const matches: WisconsinNeighborMatch[] = wisconsinBenchmarkBiopsies.map((sample) => {
    const dist = computeBiopsyDistance(input, sample);
    // Optical similarity percentage (0 dist = 100%, 6 dist = ~20%)
    const similarityPct = Math.round(Math.max(10, 100 - dist * 14));
    return {
      sample,
      distance: dist,
      similarityPct
    };
  });

  // 2. Sort by nearest distance and take top K
  matches.sort((a, b) => a.distance - b.distance);
  const topK = matches.slice(0, k);

  const malignantNeighbors = topK.filter((m) => m.sample.diagnosis === 'M').length;
  const benignNeighbors = k - malignantNeighbors;

  // 3. Compute Z-scores for all input features to identify cellular anomalies
  const featureZScores: WisconsinFeatureZScore[] = Object.entries(wisconsinFeatureStats).map(([key, stat]) => {
    const rawVal = input[key as keyof WisconsinPredictionInput] ?? stat.mean;
    const z = (rawVal - stat.mean) / stat.std;
    let status: 'Normal' | 'Elevated' | 'Critical' = 'Normal';
    if (z > 1.8) status = 'Critical';
    else if (z > 0.8) status = 'Elevated';
    else if (z < -1.5) status = 'Normal';

    return {
      key,
      label: stat.label,
      unit: stat.unit,
      rawValue: rawVal,
      mean: stat.mean,
      std: stat.std,
      zScore: parseFloat(z.toFixed(2)),
      status
    };
  });

  // 4. Critical features that flag malignancy
  const criticalFeatures = featureZScores
    .filter((f) => f.status === 'Critical' || f.zScore > 1.2)
    .map((f) => `${f.label} (${f.rawValue} ${f.unit}, Z = +${f.zScore})`);

  // 5. Calculate malignant probability based on neighbor voting + severe cytological flags
  let baseMalignantProb = (malignantNeighbors / k) * 100;
  
  // Refine probability with nuclear concavity and area worst
  const areaWorstZ = (input.area_worst - wisconsinFeatureStats.area_worst.mean) / wisconsinFeatureStats.area_worst.std;
  const concavityZ = (input.concavity_mean - wisconsinFeatureStats.concavity_mean.mean) / wisconsinFeatureStats.concavity_mean.std;
  
  if (concavityZ > 1.5 && areaWorstZ > 1.5) {
    baseMalignantProb = Math.max(baseMalignantProb, 88);
  } else if (concavityZ < -0.5 && areaWorstZ < -0.5) {
    baseMalignantProb = Math.min(baseMalignantProb, 12);
  }

  const finalMalignantProb = Math.min(99, Math.max(1, Math.round(baseMalignantProb)));
  const finalBenignProb = 100 - finalMalignantProb;
  const isMalignant = finalMalignantProb >= 50;

  // 6. PCA 2D coordinates projection
  const zRadius = standardize('radius_mean', input.radius_mean);
  const zPerimeter = standardize('perimeter_mean', input.perimeter_mean);
  const zArea = standardize('area_mean', input.area_mean);
  const zConcavity = standardize('concavity_mean', input.concavity_mean);
  const zConcavePts = standardize('concave_points_mean', input.concave_points_mean);
  const zTexture = standardize('texture_mean', input.texture_mean);
  const zSmooth = standardize('smoothness_mean', input.smoothness_mean);
  const zFractal = standardize('fractal_dimension_mean', input.fractal_dimension_mean);

  const pc1 = parseFloat((0.35 * zRadius + 0.38 * zPerimeter + 0.37 * zArea + 0.38 * zConcavity + 0.40 * zConcavePts).toFixed(2));
  const pc2 = parseFloat((-0.25 * zRadius + 0.35 * zTexture + 0.32 * zSmooth + 0.42 * zFractal - 0.20 * zArea).toFixed(2));

  // 7. Morphological Scores
  const nuclearPleomorphismScore = Math.min(100, Math.max(10, Math.round((Math.max(0, zRadius) + Math.max(0, zArea) + Math.max(0, zConcavity)) * 22)));
  const chromatinAtypiaScore = Math.min(100, Math.max(10, Math.round((Math.max(0, zTexture) + Math.max(0, zConcavePts)) * 28)));
  const mitoticIndexScore = Math.min(100, Math.max(10, Math.round((finalMalignantProb * 0.8) + (zConcavity > 1 ? 15 : 0))));

  // 8. Biopsy Grade
  let biopsyGrade: 'Grade I (Benign / Typical)' | 'Grade II (Atypical / Borderline)' | 'Grade III (High-Grade Malignant)' = 'Grade I (Benign / Typical)';
  if (finalMalignantProb >= 70) {
    biopsyGrade = 'Grade III (High-Grade Malignant)';
  } else if (finalMalignantProb >= 35) {
    biopsyGrade = 'Grade II (Atypical / Borderline)';
  }

  // 9. Clinical Recommendation
  let clinicalRecommendation = '';
  if (isMalignant) {
    clinicalRecommendation = 'Immediate referral to surgical oncology and multidisciplinary tumor board. Recommend core needle biopsy (CNB) with immunohistochemistry (ER, PR, HER2, Ki-67) and bilateral diagnostic mammography / breast MRI.';
  } else if (finalMalignantProb >= 35) {
    clinicalRecommendation = 'Borderline / atypical cytologic presentation. Recommend repeat ultrasound-guided aspiration or core needle biopsy in 3-6 months. Short-interval clinical surveillance advised.';
  } else {
    clinicalRecommendation = 'Cytological morphology is consistent with benign fibrocystic change or fibroadenoma. Standard routine annual clinical breast examination and screening mammography recommended.';
  }

  return {
    diagnosis: isMalignant ? 'Malignant' : 'Benign',
    malignantProbability: finalMalignantProb,
    benignProbability: finalBenignProb,
    confidence: Math.abs(finalMalignantProb - 50) * 2,
    kNeighbors: k,
    malignantNeighbors,
    benignNeighbors,
    pc1,
    pc2,
    featureZScores,
    topNeighbors: topK,
    biopsyGrade,
    mitoticIndexScore,
    nuclearPleomorphismScore,
    chromatinAtypiaScore,
    clinicalRecommendation,
    criticalFeatures
  };
}
