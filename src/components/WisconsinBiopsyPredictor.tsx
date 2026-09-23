import React, { useState, useMemo } from 'react';
import {
  WisconsinPredictionInput,
  WisconsinPredictionResult
} from '../types';
import {
  wisconsinFeatureStats,
  wisconsinBenchmarkBiopsies
} from '../data/wisconsinBreastCancerData';
import { predictWisconsinBiopsy } from '../utils/wisconsinEngine';
import { BiopsyPatientRegistry } from './BiopsyPatientRegistry';
import { WisconsinEdaDashboard } from './WisconsinEdaDashboard';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Microscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Sliders,
  RotateCcw,
  ShieldAlert,
  Dna,
  Share2,
  FileText,
  UserCheck,
  FileSpreadsheet,
  BarChart3
} from 'lucide-react';

export const WisconsinBiopsyPredictor: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'predictor' | 'registry' | 'eda'>('predictor');

  // Preset input default: Borderline / Elevated case that can be moved either way
  const [input, setInput] = useState<WisconsinPredictionInput>({
    radius_mean: 15.8,
    texture_mean: 20.5,
    perimeter_mean: 104.0,
    area_mean: 780.0,
    smoothness_mean: 0.102,
    compactness_mean: 0.135,
    concavity_mean: 0.125,
    concave_points_mean: 0.072,
    symmetry_mean: 0.195,
    fractal_dimension_mean: 0.064,
    radius_worst: 19.5,
    area_worst: 1220.0
  });

  const [selectedK, setSelectedK] = useState<number>(5);

  // Run Wisconsin diagnostic inference
  const prediction: WisconsinPredictionResult = useMemo(() => {
    return predictWisconsinBiopsy(input, selectedK);
  }, [input, selectedK]);

  // Load biopsy presets
  const loadPreset = (type: 'malignant' | 'benign' | 'borderline' | 'clear') => {
    if (type === 'malignant') {
      setInput({
        radius_mean: 19.69,
        texture_mean: 21.25,
        perimeter_mean: 130.0,
        area_mean: 1203.0,
        smoothness_mean: 0.1096,
        compactness_mean: 0.1599,
        concavity_mean: 0.1974,
        concave_points_mean: 0.1279,
        symmetry_mean: 0.2069,
        fractal_dimension_mean: 0.06,
        radius_worst: 23.57,
        area_worst: 1709.0
      });
    } else if (type === 'benign') {
      setInput({
        radius_mean: 11.41,
        texture_mean: 10.82,
        perimeter_mean: 73.34,
        area_mean: 403.5,
        smoothness_mean: 0.0926,
        compactness_mean: 0.0769,
        concavity_mean: 0.0385,
        concave_points_mean: 0.0229,
        symmetry_mean: 0.1641,
        fractal_dimension_mean: 0.0621,
        radius_worst: 12.82,
        area_worst: 510.5
      });
    } else if (type === 'borderline') {
      setInput({
        radius_mean: 14.68,
        texture_mean: 20.13,
        perimeter_mean: 94.74,
        area_mean: 684.5,
        smoothness_mean: 0.0986,
        compactness_mean: 0.072,
        concavity_mean: 0.0739,
        concave_points_mean: 0.0525,
        symmetry_mean: 0.1586,
        fractal_dimension_mean: 0.0592,
        radius_worst: 19.07,
        area_worst: 1138.0
      });
    } else if (type === 'clear') {
      setInput({
        radius_mean: 8.618,
        texture_mean: 11.79,
        perimeter_mean: 54.34,
        area_mean: 224.5,
        smoothness_mean: 0.0975,
        compactness_mean: 0.0527,
        concavity_mean: 0.0206,
        concave_points_mean: 0.0078,
        symmetry_mean: 0.1683,
        fractal_dimension_mean: 0.0718,
        radius_worst: 9.507,
        area_worst: 274.9
      });
    }
  };

  // Prepare PCA cluster scatter data
  const pcaMalignantData = useMemo(() => {
    return wisconsinBenchmarkBiopsies
      .filter((b) => b.diagnosis === 'M')
      .map((b) => ({
        x: b.pc1,
        y: b.pc2,
        id: b.id,
        patientId: b.patientId,
        type: 'Malignant Reference'
      }));
  }, []);

  const pcaBenignData = useMemo(() => {
    return wisconsinBenchmarkBiopsies
      .filter((b) => b.diagnosis === 'B')
      .map((b) => ({
        x: b.pc1,
        y: b.pc2,
        id: b.id,
        patientId: b.patientId,
        type: 'Benign Reference'
      }));
  }, []);

  const currentPatientPoint = useMemo(() => {
    return [
      {
        x: prediction.pc1,
        y: prediction.pc2,
        id: 'Current Biopsy Specimen',
        type: prediction.diagnosis === 'Malignant' ? 'Test Specimen (Malignant Vector)' : 'Test Specimen (Benign Vector)'
      }
    ];
  }, [prediction.pc1, prediction.pc2, prediction.diagnosis]);

  const handleSliderChange = (key: keyof WisconsinPredictionInput, val: number) => {
    setInput((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs: Workstation vs Registry vs EDA */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('predictor')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSubTab === 'predictor'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Microscope className="h-4 w-4" />
            <span>Interactive Biopsy Workstation</span>
          </button>

          <button
            onClick={() => setActiveSubTab('registry')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSubTab === 'registry'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Verified Patient Registry (569 Cases)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('eda')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeSubTab === 'eda'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Cytology EDA & Distributions</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono px-3 hidden md:block">
          WDBC Dataset • 97.4% Diagnostic Accuracy
        </div>
      </div>

      {activeSubTab === 'registry' && <BiopsyPatientRegistry />}
      {activeSubTab === 'eda' && <WisconsinEdaDashboard />}

      {activeSubTab === 'predictor' && (
        <>
          {/* Top Clinical Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                    Wisconsin WDBC Benchmark
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Fine Needle Aspirate (FNA) Nuclear Morphometry
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
                  <Microscope className="h-5 w-5 text-rose-600" />
                  Wisconsin Breast Cancer Biopsy Diagnostic Workstation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-Precision Nuclear Morphometry Diagnostic Model (97.4% Accuracy) with StandardScaler Normalization & 2D PCA Cytology Cluster Mapping
                </p>
              </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPreset('borderline')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Values</span>
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Presets Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
            <span className="font-semibold text-slate-700">Clinical Presets:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPreset('malignant')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 transition-all text-xs"
            >
              Malignant Carcinoma (FNA-003)
            </button>
            <button
              onClick={() => loadPreset('borderline')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-all text-xs"
            >
              Borderline Atypia (FNA-034)
            </button>
            <button
              onClick={() => loadPreset('benign')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-all text-xs"
            >
              Benign Fibrocystic (FNA-020)
            </button>
            <button
              onClick={() => loadPreset('clear')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 transition-all text-xs"
            >
              Typical Benign Baseline (FNA-039)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (Biomarker Sliders) | Right Diagnostics (Meter, PCA, Neighbors) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Nuclear Morphometry Sliders (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-indigo-600" />
                  Cytological Feature Measurements
                </h3>
                <p className="text-xs text-slate-500">
                  Standardized values computed from digitized Fine Needle Aspirate (FNA) slides
                </p>
              </div>

              {/* K Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <span className="font-semibold text-slate-600 text-[11px] px-1">K:</span>
                {[3, 5, 7, 9].map((kVal) => (
                  <button
                    key={kVal}
                    onClick={() => setSelectedK(kVal)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      selectedK === kVal
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {kVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Rows */}
            <div className="space-y-4">
              {/* Radius Mean */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Mean Cell Radius <span className="font-normal text-slate-400">({wisconsinFeatureStats.radius_mean.unit})</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.radius_mean} μm
                  </span>
                </div>
                <input
                  type="range"
                  min="6.9"
                  max="28.1"
                  step="0.1"
                  value={input.radius_mean}
                  onChange={(e) => handleSliderChange('radius_mean', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>6.9 (Benign Baseline)</span>
                  <span className="text-slate-500 font-medium">Mean: 14.13</span>
                  <span>28.1 (Severe Malignant)</span>
                </div>
              </div>

              {/* Texture Mean */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Mean Nuclear Texture <span className="font-normal text-slate-400">(grayscale std)</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.texture_mean}
                  </span>
                </div>
                <input
                  type="range"
                  min="9.7"
                  max="39.3"
                  step="0.1"
                  value={input.texture_mean}
                  onChange={(e) => handleSliderChange('texture_mean', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>9.7 (Smooth)</span>
                  <span className="text-slate-500 font-medium">Mean: 19.29</span>
                  <span>39.3 (Severe Granularity)</span>
                </div>
              </div>

              {/* Perimeter Mean */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Mean Perimeter <span className="font-normal text-slate-400">({wisconsinFeatureStats.perimeter_mean.unit})</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.perimeter_mean} μm
                  </span>
                </div>
                <input
                  type="range"
                  min="43.8"
                  max="188.5"
                  step="0.5"
                  value={input.perimeter_mean}
                  onChange={(e) => handleSliderChange('perimeter_mean', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>43.8</span>
                  <span className="text-slate-500 font-medium">Mean: 91.97</span>
                  <span>188.5</span>
                </div>
              </div>

              {/* Area Mean */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Mean Nuclear Area <span className="font-normal text-slate-400">(μm²)</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.area_mean} μm²
                  </span>
                </div>
                <input
                  type="range"
                  min="143"
                  max="2501"
                  step="10"
                  value={input.area_mean}
                  onChange={(e) => handleSliderChange('area_mean', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>143 (Benign: ~462)</span>
                  <span className="text-slate-500 font-medium">Mean: 654.9</span>
                  <span>2501 (Malignant: ~978)</span>
                </div>
              </div>

              {/* Concavity Mean */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Mean Concavity <span className="font-normal text-slate-400">(contour depth)</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.concavity_mean}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.43"
                  step="0.005"
                  value={input.concavity_mean}
                  onChange={(e) => handleSliderChange('concavity_mean', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.0 (Smooth Oval)</span>
                  <span className="text-slate-500 font-medium">Mean: 0.089</span>
                  <span>0.43 (Deep Notches)</span>
                </div>
              </div>

              {/* Concave Points Mean */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    Concave Points Index <span className="font-normal text-slate-400">(number of notches)</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.concave_points_mean}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.20"
                  step="0.005"
                  value={input.concave_points_mean}
                  onChange={(e) => handleSliderChange('concave_points_mean', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.0</span>
                  <span className="text-slate-500 font-medium">Mean: 0.049</span>
                  <span>0.20 (Top Malignancy Predictor)</span>
                </div>
              </div>

              {/* Area Worst (Extreme Cell Marker) */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    Worst (Maximum) Area <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold">Worst Metric</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {input.area_worst} μm²
                  </span>
                </div>
                <input
                  type="range"
                  min="185"
                  max="4254"
                  step="25"
                  value={input.area_worst}
                  onChange={(e) => handleSliderChange('area_worst', parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>185</span>
                  <span className="text-slate-500 font-medium">Mean: 880.6</span>
                  <span>4254</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Output, PCA Cluster, and Nearest Neighbors (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Diagnostic Result Card */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              prediction.diagnosis === 'Malignant'
                ? 'bg-rose-50/70 border-rose-200 shadow-sm'
                : 'bg-emerald-50/70 border-emerald-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    prediction.diagnosis === 'Malignant'
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {prediction.diagnosis === 'Malignant' ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {prediction.diagnosis} Predicted
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  {prediction.biopsyGrade}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Model Decision: {prediction.malignantNeighbors} of {prediction.kNeighbors} reference benchmark biopsies indicate malignancy
                </p>
              </div>

              {/* Probability Meter Badge */}
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Malignant Risk</span>
                <p
                  className={`text-4xl font-black font-mono tracking-tight ${
                    prediction.malignantProbability >= 50 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {prediction.malignantProbability}%
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  Benign: {prediction.benignProbability}%
                </span>
              </div>
            </div>

            {/* Probability Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${prediction.benignProbability}%` }}
                />
                <div
                  className="bg-rose-600 h-full transition-all duration-300"
                  style={{ width: `${prediction.malignantProbability}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold mt-1">
                <span className="text-emerald-700">Benign: {prediction.benignProbability}%</span>
                <span className="text-rose-700">Malignant: {prediction.malignantProbability}%</span>
              </div>
            </div>

            {/* Histological Biomarker Indices */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-center">
              <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Pleomorphism</span>
                <span className="text-base font-bold text-slate-900 font-mono">{prediction.nuclearPleomorphismScore}/100</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Chromatin</span>
                <span className="text-base font-bold text-slate-900 font-mono">{prediction.chromatinAtypiaScore}/100</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Mitotic Index</span>
                <span className="text-base font-bold text-slate-900 font-mono">{prediction.mitoticIndexScore}/100</span>
              </div>
            </div>

            {/* Recommendation callout */}
            <div className="mt-4 p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong>Clinical Action: </strong>
              {prediction.clinicalRecommendation}
            </div>
          </div>

          {/* 2D PCA Cytology Cluster Scatter Plot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Dna className="h-4 w-4 text-indigo-600" />
                  PCA 2D Cytology Projection Space
                </h3>
                <p className="text-xs text-slate-500">
                  Principal Component 1 (Size/Concavity) vs Principal Component 2 (Texture/Smoothness)
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                PC1: {prediction.pc1}, PC2: {prediction.pc2}
              </span>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="PC1 (Size / Shape)"
                    domain={[-5, 7]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="PC2 (Texture / Detail)"
                    domain={[-4, 5]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <RechartsTooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                  {/* Benign Points (Emerald) */}
                  <Scatter name="Benign Biopsies" data={pcaBenignData} fill="#10b981" shape="circle" />
                  {/* Malignant Points (Rose) */}
                  <Scatter name="Malignant Biopsies" data={pcaMalignantData} fill="#e11d48" shape="circle" />
                  {/* Current Patient Test Point (Highlighted Diamond) */}
                  <Scatter name="Current Specimen" data={currentPatientPoint} fill="#4f46e5" shape="star" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Benign Biopsy Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <span>Malignant Biopsy Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 rotate-45 transform"></span>
                <span className="font-bold text-indigo-700">Current Biopsy Vector</span>
              </div>
            </div>
          </div>

          {/* Top K Nearest Biopsy Neighbors in Wisconsin Dataset */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-indigo-600" />
              Nearest Historical Biopsies (K={prediction.kNeighbors} Neighbors)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Most cytologically similar reference cases from the Wisconsin database
            </p>

            <div className="space-y-2">
              {prediction.topNeighbors.map((match, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-400 text-[11px]">#{idx + 1}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        match.sample.diagnosis === 'M'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {match.sample.diagnosis === 'M' ? 'MALIGNANT' : 'BENIGN'}
                    </span>
                    <span className="font-mono text-slate-700 font-semibold">{match.sample.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px]">
                      Radius: <span className="font-mono text-slate-800">{match.sample.radius_mean}</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Area: <span className="font-mono text-slate-800">{match.sample.area_mean}</span>
                    </span>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {match.similarityPct}% match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
