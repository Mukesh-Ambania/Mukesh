import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  Sliders,
  Database,
  Layers,
  Sparkles,
  Download,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { wisconsinFeatureStats } from '../data/wisconsinBreastCancerData';

export const WisconsinEdaDashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('radius_mean');

  // Class distribution data
  const classDistribution = [
    { name: 'Benign (Non-Cancerous)', count: 357, percentage: 62.7, color: '#10b981' },
    { name: 'Malignant (Cancerous)', count: 212, percentage: 37.3, color: '#e11d48' }
  ];

  // Top feature correlations with malignancy (r)
  const correlationData = [
    { feature: 'Concave Points (Mean)', correlation: 0.78, impact: 'Very High', color: '#e11d48' },
    { feature: 'Perimeter (Worst)', correlation: 0.78, impact: 'Very High', color: '#e11d48' },
    { feature: 'Radius (Worst)', correlation: 0.78, impact: 'Very High', color: '#e11d48' },
    { feature: 'Perimeter (Mean)', correlation: 0.74, impact: 'High', color: '#f43f5e' },
    { feature: 'Area (Worst)', correlation: 0.73, impact: 'High', color: '#f43f5e' },
    { feature: 'Radius (Mean)', correlation: 0.73, impact: 'High', color: '#f43f5e' },
    { feature: 'Area (Mean)', correlation: 0.71, impact: 'High', color: '#f43f5e' },
    { feature: 'Concavity (Mean)', correlation: 0.70, impact: 'High', color: '#fb7185' },
    { feature: 'Compactness (Mean)', correlation: 0.60, impact: 'Moderate', color: '#fb923c' },
    { feature: 'Texture (Worst)', correlation: 0.46, impact: 'Moderate', color: '#38bdf8' },
    { feature: 'Smoothness (Mean)', correlation: 0.36, impact: 'Low', color: '#94a3b8' },
    { feature: 'Symmetry (Mean)', correlation: 0.33, impact: 'Low', color: '#94a3b8' }
  ];

  // Malignant vs Benign Mean Comparison
  const featureComparisons = [
    {
      name: 'Radius (μm)',
      benign: 12.15,
      malignant: 17.46,
      ratio: '+43.7% larger'
    },
    {
      name: 'Texture (std)',
      benign: 17.92,
      malignant: 21.61,
      ratio: '+20.6% rougher'
    },
    {
      name: 'Perimeter (μm)',
      benign: 78.08,
      malignant: 115.37,
      ratio: '+47.8% larger'
    },
    {
      name: 'Area (μm² / 10)',
      benign: 46.28,
      malignant: 97.84,
      ratio: '+111.4% (2.1x area)'
    },
    {
      name: 'Concavity (x100)',
      benign: 4.6,
      malignant: 16.1,
      ratio: '+250.0% (3.5x notches)'
    },
    {
      name: 'Concave Pts (x100)',
      benign: 2.6,
      malignant: 8.8,
      ratio: '+238.5% (3.4x indentations)'
    }
  ];

  // PCA Explained Variance Ratio
  const pcaVarianceData = [
    { pc: 'PC 1 (Size/Perimeter)', variance: 44.3, cumulative: 44.3 },
    { pc: 'PC 2 (Texture/Smoothness)', variance: 19.0, cumulative: 63.3 },
    { pc: 'PC 3 (Fractal/Symmetry)', variance: 9.4, cumulative: 72.7 },
    { pc: 'PC 4 (Concave Points)', variance: 6.6, cumulative: 79.3 },
    { pc: 'PC 5 (Standard Error)', variance: 5.5, cumulative: 84.8 },
    { pc: 'PC 6 to 30 (Residual)', variance: 15.2, cumulative: 100.0 }
  ];

  // Export EDA Summary
  const exportEdaCSV = () => {
    const rows = [
      ['Feature', 'Correlation with Malignancy (r)', 'Malignant Mean', 'Benign Mean'],
      ...correlationData.map((c) => [c.feature, c.correlation.toString(), 'Calculated', 'Calculated'])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'wisconsin_breast_cancer_eda_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                Exploratory Data Analysis (EDA)
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Pandas, NumPy & Matplotlib Pipeline
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <BarChart2 className="h-5 w-5 text-indigo-600" />
              Wisconsin Breast Cancer Dataset Feature Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              569 fine-needle aspirate biopsies • 30 continuous real-valued cytological features • 0 missing values
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportEdaCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export EDA Data (.csv)</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Dataset Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Patient Biopsies</span>
            <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">569</p>
            <p className="text-[11px] text-slate-400 mt-0.5">UCI Machine Learning Repository</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Malignant Cases</span>
            <p className="text-3xl font-black text-rose-600 mt-1 tracking-tight">212 (37.3%)</p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Confirmed Carcinomas</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Benign Biopsies</span>
            <p className="text-3xl font-black text-emerald-600 mt-1 tracking-tight">357 (62.7%)</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Non-cancerous lesions</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Top Correlated Predictor</span>
            <p className="text-3xl font-black text-indigo-600 mt-1 tracking-tight">r = 0.78</p>
            <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Concave Points (Severity)</p>
          </div>
        </div>
      </div>

      {/* Row 1: Correlation Ranking & Class Balance Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pearson Correlation with Malignancy Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-rose-600" />
                Feature Correlation with Malignancy Diagnosis (Pearson r)
              </h3>
              <p className="text-xs text-slate-500">
                Shows which nuclear features are the strongest statistical drivers of breast cancer
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
              r &gt; 0.70 = Strong Driver
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={correlationData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 1.0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={110}
                />
                <Tooltip
                  formatter={(val: number) => [`r = ${val}`, 'Correlation with Malignant Class']}
                  contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                  {correlationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            Nuclear contour indentations (Concave Points) and extreme outer dimensions (Perimeter Worst) are the #1 hallmarks of invasive tumors.
          </p>
        </div>

        {/* Class Balance Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieChartIcon className="h-4 w-4 text-emerald-600" />
                Dataset Class Balance
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              357 Benign vs 212 Malignant cases
            </p>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} Biopsies`, 'Count']}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-emerald-900">Benign (B)</span>
              </div>
              <span className="font-mono font-bold text-emerald-900">357 (62.7%)</span>
            </div>

            <div className="flex justify-between items-center bg-rose-50/70 p-2 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <span className="font-semibold text-rose-900">Malignant (M)</span>
              </div>
              <span className="font-mono font-bold text-rose-900">212 (37.3%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Malignant vs Benign Mean Dimensions & PCA Variance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Means Comparison (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-indigo-600" />
                Malignant vs Benign Mean Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Notice the dramatic magnification of nuclear dimensions in malignant tissue
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureComparisons} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="benign" name="Benign Mean" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="malignant" name="Malignant Mean" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Area Expansion</span>
              <span className="font-bold text-rose-600 font-mono">+111.4% (2.1x)</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Notch Concavity</span>
              <span className="font-bold text-rose-600 font-mono">+250% (3.5x)</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Radius Enlarge</span>
              <span className="font-bold text-rose-600 font-mono">+43.7%</span>
            </div>
          </div>
        </div>

        {/* PCA Variance Decomposition (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-600" />
                Principal Component Analysis (PCA)
              </h3>
              <p className="text-xs text-slate-500">
                Variance explained by top orthogonal components
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              72.7% in 3 PCs
            </span>
          </div>

          <div className="space-y-3">
            {pcaVarianceData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="text-slate-800">{item.pc}</span>
                  <span className="font-mono text-indigo-700">
                    {item.variance}% (Cum: {item.cumulative}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.variance * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
            <strong>Key Data Science Takeaway: </strong>
            Because the first 2 principal components capture 63.3% of the dataset variance, 2D projections provide outstanding diagnostic clustering with clear linear & non-linear separability.
          </div>
        </div>
      </div>
    </div>
  );
};
