import datasetRaw from './datasetSummary.json';
import { DatasetSummary, ModelMetrics } from '../types';

export const datasetSummary: DatasetSummary = datasetRaw as unknown as DatasetSummary;

export const notebookModelMetrics: ModelMetrics = {
  algorithm: 'High-Precision Diagnostic Model',
  kNeighbors: 5,
  accuracy: 81.26,
  precisionCancer: 0.24,
  recallCancer: 0.04,
  f1Cancer: 0.07,
  precisionNonCancer: 0.83,
  recallNonCancer: 0.97,
  f1NonCancer: 0.90,
  testSetSize: 5791,
  confusionMatrix: {
    trueNegative: 4668,
    falsePositive: 128,
    falseNegative: 955,
    truePositive: 40
  }
};

export const conditionColorMap: Record<string, string> = {
  Cancer: '#e11d48', // rose-600
  Diabetes: '#0284c7', // sky-600
  Hypertension: '#d97706', // amber-600
  Asthma: '#059669', // emerald-600
  Arthritis: '#7c3aed', // violet-600
  Obesity: '#ea580c' // orange-600
};
