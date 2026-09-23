import React, { useState, useMemo } from 'react';
import { PredictionInput, PredictionResult } from '../types';
import { predictCancerRisk } from '../utils/predictionEngine';
import { ClinicalReportModal } from './ClinicalReportModal';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Stethoscope,
  Info,
  Users,
  Compass,
  ArrowRight,
  RefreshCw,
  FlaskConical,
  Scale
} from 'lucide-react';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ADMISSION_TYPES = ['Urgent', 'Emergency', 'Elective'];
const INSURANCE_PROVIDERS = ['Blue Cross', 'Medicare', 'Aetna', 'UnitedHealthcare', 'Cigna'];
const MEDICATIONS = ['Paracetamol', 'Ibuprofen', 'Aspirin', 'Penicillin', 'Lipitor'];
const TEST_RESULTS = ['Normal', 'Inconclusive', 'Abnormal'];

export const CancerPredictor: React.FC = () => {
  const [input, setInput] = useState<PredictionInput>({
    age: 64,
    gender: 'Female',
    bloodType: 'AB-',
    insurance: 'Medicare',
    billing: 34500,
    admissionType: 'Urgent',
    medication: 'Paracetamol',
    testResult: 'Abnormal'
  });

  const [showReportModal, setShowReportModal] = useState(false);
  const [activeAnalysisView, setActiveAnalysisView] = useState<'overview' | 'neighbors' | 'whatif'>('overview');

  // Compute prediction results
  const result: PredictionResult = useMemo(() => {
    return predictCancerRisk(input);
  }, [input]);

  const loadPreset = (type: 'high' | 'borderline' | 'geriatric' | 'low') => {
    if (type === 'high') {
      setInput({
        age: 74,
        gender: 'Male',
        bloodType: 'O+',
        insurance: 'Medicare',
        billing: 44200,
        admissionType: 'Emergency',
        medication: 'Paracetamol',
        testResult: 'Abnormal'
      });
    } else if (type === 'borderline') {
      setInput({
        age: 52,
        gender: 'Female',
        bloodType: 'B+',
        insurance: 'UnitedHealthcare',
        billing: 26800,
        admissionType: 'Urgent',
        medication: 'Aspirin',
        testResult: 'Inconclusive'
      });
    } else if (type === 'geriatric') {
      setInput({
        age: 81,
        gender: 'Male',
        bloodType: 'A-',
        insurance: 'Blue Cross',
        billing: 31000,
        admissionType: 'Elective',
        medication: 'Lipitor',
        testResult: 'Normal'
      });
    } else {
      setInput({
        age: 24,
        gender: 'Female',
        bloodType: 'A+',
        insurance: 'Aetna',
        billing: 13200,
        admissionType: 'Elective',
        medication: 'Ibuprofen',
        testResult: 'Normal'
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Elevated':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Moderate':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  // Radial Gauge Math (Semi-circle meter)
  const score = result.riskScore;
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="space-y-6">
      {/* Top Header Card with Quick Presets and Dossier Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                Clinical AI Inference Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">StandardScaler Normalized</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <Activity className="h-5 w-5 text-rose-600" />
              Oncology Clinical Risk Classification Workstation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live algorithmic scoring parameterized against 55,500 patient encounters from hospital dataset
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => loadPreset('high')}
                className="px-2.5 py-1 rounded-lg text-rose-700 hover:bg-white transition-all font-semibold"
              >
                High Risk
              </button>
              <button
                onClick={() => loadPreset('borderline')}
                className="px-2.5 py-1 rounded-lg text-amber-700 hover:bg-white transition-all font-semibold"
              >
                Borderline
              </button>
              <button
                onClick={() => loadPreset('geriatric')}
                className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white transition-all"
              >
                Elderly Normal
              </button>
              <button
                onClick={() => loadPreset('low')}
                className="px-2.5 py-1 rounded-lg text-emerald-700 hover:bg-white transition-all font-semibold"
              >
                Low Risk
              </button>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Workstation Grid: Input Panel (7 cols) + Real-time Telemetry & Gauge (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Form Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Age and Biological Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Patient Age
                  </label>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {input.age} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="89"
                  value={input.age}
                  onChange={(e) => setInput({ ...input, age: parseInt(e.target.value) || 14 })}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>14 y (Min)</span>
                  <span>51 y (Dataset Mean)</span>
                  <span>89 y (Max)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Biological Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setInput({ ...input, gender: g })}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        input.gender === g
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blood Type & Diagnostic Test Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Blood Group (ABO & Rh)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_TYPES.map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => setInput({ ...input, bloodType: bt })}
                      className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                        input.bloodType === bt
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Diagnostic Lab Test Finding
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Critical Metric</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {TEST_RESULTS.map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setInput({ ...input, testResult: res })}
                      className={`py-1.5 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                        input.testResult === res
                          ? res === 'Abnormal'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : res === 'Inconclusive'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Admission Acuity & Active Medication */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Admission Acuity Classification
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ADMISSION_TYPES.map((adm) => (
                    <button
                      key={adm}
                      type="button"
                      onClick={() => setInput({ ...input, admissionType: adm })}
                      className={`py-1.5 px-1 text-xs font-medium rounded-lg border text-center transition-all ${
                        input.admissionType === adm
                          ? 'bg-slate-800 text-white border-slate-800 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {adm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Administered Hospital Medication
                </label>
                <select
                  value={input.medication}
                  onChange={(e) => setInput({ ...input, medication: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                >
                  {MEDICATIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inpatient Billing & Insurance Payer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Billed Hospital Charges
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    ${input.billing.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="52000"
                  step="500"
                  value={input.billing}
                  onChange={(e) => setInput({ ...input, billing: parseInt(e.target.value) || 25000 })}
                  className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>$2k (Min)</span>
                  <span>$25.5k (Avg)</span>
                  <span>$52k (Max)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Insurance Carrier
                </label>
                <select
                  value={input.insurance}
                  onChange={(e) => setInput({ ...input, insurance: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                >
                  {INSURANCE_PROVIDERS.map((ins) => (
                    <option key={ins} value={ins}>
                      {ins}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry & Clinical Gauge Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Primary Gauge Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Real-Time Decision Gauge
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel} Tier
                </span>
              </div>

              {/* Radial Score Visualizer */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#1e293b"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={
                        result.riskScore >= 65
                          ? '#e11d48'
                          : result.riskScore >= 45
                          ? '#f59e0b'
                          : result.riskScore >= 25
                          ? '#eab308'
                          : '#10b981'
                      }
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-white tracking-tight">
                      {result.riskScore}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Cancer Risk
                    </span>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-sm font-bold flex items-center justify-center gap-1.5">
                    {result.isCancerPredicted ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Oncology Referral Indicated
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Standard Surveillance Tier
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Diagnostic Similarity Vote: <strong className="text-white">{result.nearestNeighborsSummary.cancerMatches} of 5</strong> matches
                  </p>
                </div>
              </div>

              {/* Biomarker Multi-Axis Bars */}
              <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Multi-Axis Biomarker Indices (0 - 100)
                </span>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>Diagnostic Lab Biomarker</span>
                    <span className="font-mono font-bold text-white">{result.biomarkerScores.diagnostic}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        result.biomarkerScores.diagnostic > 70 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${result.biomarkerScores.diagnostic}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>Age / Demographic Risk</span>
                    <span className="font-mono font-bold text-white">{result.biomarkerScores.demographic}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${result.biomarkerScores.demographic}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>Admission Acuity Intensity</span>
                    <span className="font-mono font-bold text-white">{result.biomarkerScores.admissionAcuity}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${result.biomarkerScores.admissionAcuity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                    <span>Benchmark Case Cancer Density</span>
                    <span className="font-mono font-bold text-white">{result.biomarkerScores.neighborCancerDensity}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${result.biomarkerScores.neighborCancerDensity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Analysis Switcher Tabs (Overview / What-If / Nearest Neighbors) */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveAnalysisView('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeAnalysisView === 'overview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Risk Factors & Protocols
              </button>
              <button
                onClick={() => setActiveAnalysisView('whatif')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  activeAnalysisView === 'whatif'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>What-If Clinical Simulator</span>
              </button>
              <button
                onClick={() => setActiveAnalysisView('neighbors')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  activeAnalysisView === 'neighbors'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>K=5 Matched Inpatients ({result.topNeighbors.length})</span>
              </button>
            </div>
            <span className="text-xs text-slate-500">
              Interactive clinical decision support sub-panels
            </span>
          </div>

          {/* View 1: Overview (Contributing Factors & Protocols) */}
          {activeAnalysisView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-rose-600" />
                  Primary Contributing Risk Factors
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.riskFactors.map((rf, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-emerald-600" />
                  Evidence-Based Clinical Follow-Up Protocols
                </h3>
                <div className="space-y-2 text-xs text-slate-700">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View 2: What-If Simulator */}
          {activeAnalysisView === 'whatif' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Sensitivity Analysis:</strong> See how adjusting individual clinical parameters shifts the diagnostic model output. Click <strong>"Adopt Simulation"</strong> to load any scenario directly into the model inputs.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.whatIfScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">{scenario.title}</span>
                        <span
                          className={`text-xs font-bold flex items-center font-mono ${
                            scenario.delta > 0
                              ? 'text-rose-600'
                              : scenario.delta < 0
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {scenario.delta > 0 ? (
                            <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                          )}
                          {scenario.delta > 0 ? `+${scenario.delta}%` : `${scenario.delta}%`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">{scenario.description}</p>
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-500">Projected Risk:</span>
                        <span className="font-extrabold text-slate-900 font-mono">
                          {scenario.simulatedScore}% ({scenario.simulatedLevel})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (scenario.id === 'test-normal') setInput({ ...input, testResult: 'Normal' });
                        if (scenario.id === 'test-abnormal') setInput({ ...input, testResult: 'Abnormal' });
                        if (scenario.id === 'admission-elective') setInput({ ...input, admissionType: 'Elective' });
                        if (scenario.id === 'admission-urgent') setInput({ ...input, admissionType: 'Urgent' });
                        if (scenario.id === 'billing-baseline') setInput({ ...input, billing: 25539 });
                      }}
                      className="mt-3 w-full py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Adopt Scenario</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 3: Nearest Neighbors Table */}
          {activeAnalysisView === 'neighbors' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200/80 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
                <Users className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Instance-Based Memory:</strong> The diagnostic engine identifies the 5 historical patient encounters most mathematically similar across normalized continuous features (Age, Billing) and categorical distance metrics.
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Neighbor ID & Patient</th>
                      <th className="py-2.5 px-3">Age / Sex</th>
                      <th className="py-2.5 px-3">Actual Condition</th>
                      <th className="py-2.5 px-3">Test Result</th>
                      <th className="py-2.5 px-3">Admission</th>
                      <th className="py-2.5 px-3">Billed</th>
                      <th className="py-2.5 px-3 text-right">Similarity Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.topNeighbors.map((n, idx) => (
                      <tr key={idx} className={n.patient.isCancer ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-4">
                          <span className="font-semibold text-slate-900">{n.patient.name}</span>
                          <span className="block text-[11px] text-slate-400 font-mono">{n.patient.id}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {n.patient.age}y • {n.patient.gender}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              n.patient.isCancer
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {n.patient.condition}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">
                          {n.patient.testResult}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {n.patient.admissionType}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-800">
                          ${n.patient.billing.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">
                          {n.similarityPct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Clinical Report Dossier Modal */}
      {showReportModal && (
        <ClinicalReportModal
          input={input}
          result={result}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
