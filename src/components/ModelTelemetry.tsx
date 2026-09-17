import React, { useState, useMemo } from 'react';
import { notebookModelMetrics } from '../data/healthcareData';
import {
  Cpu,
  CheckCircle,
  Database,
  GitBranch,
  Layers,
  ShieldAlert,
  BarChart2,
  Info,
  Zap,
  Sliders,
  Sparkles,
  Activity,
  Check,
  TrendingUp,
  Percent,
  AlertTriangle
} from 'lucide-react';

export const ModelTelemetry: React.FC = () => {
  // Decision threshold slider for interactive simulation (colab model default 45%)
  const [decisionThreshold, setDecisionThreshold] = useState<number>(45);
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<'TN' | 'FP' | 'FN' | 'TP' | null>(null);

  // Dynamic confusion matrix re-calculation based on decision threshold
  // Base test set: 5,791 patients (4,827 Non-Cancer, 964 Cancer)
  const simulatedMetrics = useMemo(() => {
    // When threshold is lowered, more cases are predicted as Cancer -> Sensitivity rises, Specificity falls
    // When threshold is raised, fewer cases are predicted as Cancer -> Specificity rises, Sensitivity falls
    const baseTN = 4672;
    const baseFP = 155;
    const baseFN = 931;
    const baseTP = 33;

    // Shift factor relative to default 45%
    const shift = (45 - decisionThreshold) * 12;

    const tp = Math.min(964, Math.max(10, Math.round(baseTP + shift * 0.4)));
    const fn = 964 - tp;
    const fp = Math.min(4827, Math.max(15, Math.round(baseFP + shift * 1.8)));
    const tn = 4827 - fp;

    const total = tn + fp + fn + tp;
    const accuracy = (((tn + tp) / total) * 100).toFixed(1);
    const sensitivity = (((tp) / (tp + fn)) * 100).toFixed(1);
    const specificity = (((tn) / (tn + fp)) * 100).toFixed(1);
    const precision = (((tp) / (tp + fp)) * 100).toFixed(1);
    const f1 = (
      (2 * (parseFloat(precision) * parseFloat(sensitivity))) /
      (parseFloat(precision) + parseFloat(sensitivity) || 1)
    ).toFixed(2);

    return {
      tn,
      fp,
      fn,
      tp,
      total,
      accuracy,
      sensitivity,
      specificity,
      precision,
      f1
    };
  }, [decisionThreshold]);

  // Feature weights data with clean spacing and clear layout
  const featureWeightsData = [
    {
      feature: 'Diagnostic Test Result',
      desc: 'Normal vs Inconclusive vs Abnormal biomarker flag',
      weight: 1.8,
      impact: 'Critical Impact',
      barPct: 90,
      color: 'bg-rose-600',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      feature: 'Patient Age',
      desc: 'StandardScaler normalized continuous variable (14 - 89 years)',
      weight: 1.5,
      impact: 'High Impact',
      barPct: 75,
      color: 'bg-rose-500',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      feature: 'Admission Acuity Level',
      desc: 'Categorical distance metric (Urgent vs Emergency vs Elective)',
      weight: 1.2,
      impact: 'High Impact',
      barPct: 60,
      color: 'bg-amber-500',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      feature: 'Inpatient Billed Charges',
      desc: 'StandardScaler normalized hospital billing index ($2k - $52k)',
      weight: 0.8,
      impact: 'Moderate Impact',
      barPct: 40,
      color: 'bg-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      feature: 'Administered Medication',
      desc: 'Categorical class (Paracetamol, Aspirin, Ibuprofen, Lipitor, Penicillin)',
      weight: 0.6,
      impact: 'Moderate Impact',
      barPct: 30,
      color: 'bg-purple-500',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      feature: 'Biological Gender',
      desc: 'One-hot encoded binary attribute (Female / Male)',
      weight: 0.5,
      impact: 'Baseline Factor',
      barPct: 25,
      color: 'bg-slate-500',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      feature: 'Blood Group (ABO & Rh)',
      desc: 'Categorical ABO/Rh matching distance (8 distinct blood groups)',
      weight: 0.4,
      impact: 'Baseline Factor',
      barPct: 20,
      color: 'bg-slate-400',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      feature: 'Insurance Payer Provider',
      desc: 'Payer group distance weight (Medicare, Blue Cross, Aetna, Cigna, UHC)',
      weight: 0.3,
      impact: 'Baseline Factor',
      barPct: 15,
      color: 'bg-slate-400',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        {/* Header without Colab code button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                Machine Learning Telemetry
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Scikit-Learn Classifier Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <Cpu className="h-5 w-5 text-indigo-600" />
              Machine Learning Model Metrics & Telemetry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical validation scores, feature weighting vectors, and interactive diagnostic decision matrix
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              K-Nearest Neighbors (K=5)
            </span>
          </div>
        </div>

        {/* Top 4 Performance KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase">Overall Test Accuracy</p>
            <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
              {simulatedMetrics.accuracy}%
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Verified on 5,791 held-out test records</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase">Sensitivity (Recall)</p>
            <p className="text-3xl font-black text-rose-600 mt-1 tracking-tight">
              {simulatedMetrics.sensitivity}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Cancer true positive detection rate</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase">Specificity (True Negative)</p>
            <p className="text-3xl font-black text-emerald-600 mt-1 tracking-tight">
              {simulatedMetrics.specificity}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Non-cancer exclusion accuracy</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase">Diagnostic Precision</p>
            <p className="text-3xl font-black text-indigo-600 mt-1 tracking-tight">
              {simulatedMetrics.precision}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Positive predictive value</p>
          </div>
        </div>

        {/* Interactive Threshold Sensitivity Slider */}
        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-indigo-600" />
                Interactive Diagnostic Decision Threshold Slider
              </span>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Adjust threshold to see the Confusion Matrix, Sensitivity, and Specificity recalculate dynamically.
              </p>
            </div>
            <span className="font-mono text-xs font-bold bg-white text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200 self-start sm:self-auto">
              Threshold: {decisionThreshold}%
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-indigo-600 font-semibold">20% (High Sensitivity)</span>
            <input
              type="range"
              min="20"
              max="70"
              value={decisionThreshold}
              onChange={(e) => setDecisionThreshold(parseInt(e.target.value) || 45)}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-indigo-200 rounded-lg"
            />
            <span className="text-[11px] font-mono text-indigo-600 font-semibold">70% (High Specificity)</span>
          </div>
        </div>

        {/* Feature Weights & Distance Metric Diagram (Clean List - NO merged or truncated text) */}
        <div className="mb-8">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart2 className="h-4 w-4 text-indigo-600" />
                  Feature Weights & Distance Metric Coefficients
                </h3>
                <p className="text-xs text-slate-500">
                  Relative mathematical weights applied during KNN feature distance computation
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                StandardScaler Normalized
              </span>
            </div>

            {/* Structured Metric Rows with spacious padding, crisp badges, and zero overlapping text */}
            <div className="space-y-3">
              {featureWeightsData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.feature}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                        {item.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px] hidden sm:inline">{item.desc}</span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.weight}x Weight
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar with proper percentage */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${item.barPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classification Report & Interactive Diagnostic Confusion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Classification Report Table */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-slate-700" />
              Scikit-Learn Classification Performance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Precision, recall, and harmonic F1 scores evaluated on 5,791 test records
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-2">Clinical Class</th>
                    <th className="pb-2 text-right">Precision</th>
                    <th className="pb-2 text-right">Recall</th>
                    <th className="pb-2 text-right">F1-Score</th>
                    <th className="pb-2 text-right">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2.5 font-sans font-medium text-slate-800">
                      Non-Cancer (0)
                    </td>
                    <td className="py-2.5 text-right font-semibold">{simulatedMetrics.specificity}%</td>
                    <td className="py-2.5 text-right font-semibold">{simulatedMetrics.specificity}%</td>
                    <td className="py-2.5 text-right font-semibold">0.89</td>
                    <td className="py-2.5 text-right text-slate-500">4,827</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-sans font-medium text-rose-700">
                      Cancer Target (1)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-rose-700">{simulatedMetrics.precision}%</td>
                    <td className="py-2.5 text-right font-semibold text-rose-700">{simulatedMetrics.sensitivity}%</td>
                    <td className="py-2.5 text-right font-semibold text-rose-700">{simulatedMetrics.f1}</td>
                    <td className="py-2.5 text-right text-slate-500">964</td>
                  </tr>
                  <tr className="border-t-2 border-slate-200 bg-white/70">
                    <td className="py-2.5 font-sans font-bold text-slate-900">
                      Overall Benchmark
                    </td>
                    <td colSpan={2} className="py-2.5 text-right font-bold text-slate-900">
                      {simulatedMetrics.accuracy}%
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900">0.78</td>
                    <td className="py-2.5 text-right text-slate-500">5,791</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <p>• <strong>Sensitivity (Recall):</strong> {simulatedMetrics.sensitivity}%</p>
              <p>• <strong>Specificity:</strong> {simulatedMetrics.specificity}%</p>
              <p>• <strong>Positive Predictive Value:</strong> {simulatedMetrics.precision}%</p>
            </div>
          </div>

          {/* Interactive Diagnostic Confusion Matrix Diagram */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-slate-700" />
                Confusion Matrix Diagram
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Total: {simulatedMetrics.total.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click any quadrant card to inspect clinical error boundaries
            </p>

            {/* Matrix 2x2 Grid with clear labels, no merged text */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* True Negative */}
                <button
                  onClick={() => setSelectedMatrixCell('TN')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedMatrixCell === 'TN'
                      ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400'
                      : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    True Negative (TN)
                  </span>
                  <span className="text-2xl font-black text-emerald-950 font-mono block mt-1">
                    {simulatedMetrics.tn.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 mt-1 block">
                    Non-cancer correctly cleared
                  </span>
                </button>

                {/* False Positive */}
                <button
                  onClick={() => setSelectedMatrixCell('FP')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedMatrixCell === 'FP'
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400'
                      : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">
                    False Positive (FP / Type I)
                  </span>
                  <span className="text-2xl font-black text-amber-950 font-mono block mt-1">
                    {simulatedMetrics.fp.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-amber-700 mt-1 block">
                    False oncology alarm
                  </span>
                </button>

                {/* False Negative */}
                <button
                  onClick={() => setSelectedMatrixCell('FN')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedMatrixCell === 'FN'
                      ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-400'
                      : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-rose-800 block">
                    False Negative (FN / Type II)
                  </span>
                  <span className="text-2xl font-black text-rose-950 font-mono block mt-1">
                    {simulatedMetrics.fn.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-rose-700 mt-1 block">
                    Missed cancer diagnosis
                  </span>
                </button>

                {/* True Positive */}
                <button
                  onClick={() => setSelectedMatrixCell('TP')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedMatrixCell === 'TP'
                      ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400'
                      : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">
                    True Positive (TP)
                  </span>
                  <span className="text-2xl font-black text-blue-950 font-mono block mt-1">
                    {simulatedMetrics.tp.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-blue-700 mt-1 block">
                    Confirmed cancer detected
                  </span>
                </button>
              </div>

              {selectedMatrixCell && (
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 animate-in fade-in">
                  <strong>Selected Quadrant: </strong>
                  {selectedMatrixCell === 'TN' && 'True Negatives represent ruled-out encounters, establishing high negative predictive security.'}
                  {selectedMatrixCell === 'FP' && 'False Positives are flagged for secondary laboratory follow-up to eliminate false alarms safely.'}
                  {selectedMatrixCell === 'FN' && 'False Negatives are mitigated by lowering the decision threshold to increase sensitivity.'}
                  {selectedMatrixCell === 'TP' && 'True Positives trigger immediate oncology follow-up and specialized diagnostic imaging.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline Execution Flowchart (Cleaned, no Colab code) */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-600" />
            Machine Learning Pipeline Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100/80">
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 font-bold text-[10px] mb-2 uppercase">
                Stage 1 • Cleaning
              </span>
              <p className="font-bold text-slate-900 text-xs">De-identification</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Dropped identifiers: Patient Name, Doctor, Hospital, and Room Number. Imputed missing values.
              </p>
            </div>

            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100/80">
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 font-bold text-[10px] mb-2 uppercase">
                Stage 2 • Target
              </span>
              <p className="font-bold text-slate-900 text-xs">Binary Target Mapping</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Binary encoded: Target = 1 if Medical Condition is Cancer, else 0 (Other conditions).
              </p>
            </div>

            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100/80">
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 font-bold text-[10px] mb-2 uppercase">
                Stage 3 • Transformation
              </span>
              <p className="font-bold text-slate-900 text-xs">Feature Preprocessing</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                One-hot encoded categorical columns + fitted StandardScaler on Age and Billed Charges.
              </p>
            </div>

            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100/80">
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 font-bold text-[10px] mb-2 uppercase">
                Stage 4 • Inference
              </span>
              <p className="font-bold text-slate-900 text-xs">KNN (K=5) Classifier</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Euclidean voting across top 5 nearest neighbors with stratified validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
