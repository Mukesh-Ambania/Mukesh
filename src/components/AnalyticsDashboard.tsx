import React, { useState, useMemo } from 'react';
import { datasetSummary } from '../data/healthcareData';
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
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  Activity,
  HeartPulse,
  Filter,
  Download,
  Stethoscope,
  ShieldCheck,
  Flame,
  Pill,
  Sparkles
} from 'lucide-react';

const TEST_RESULT_COLORS = {
  Normal: '#10b981',
  Inconclusive: '#f59e0b',
  Abnormal: '#e11d48'
};

export const AnalyticsDashboard: React.FC = () => {
  const [selectedCohort, setSelectedCohort] = useState<'All' | 'Cancer' | 'Non-Cancer'>('All');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('All');
  const [selectedAdmission, setSelectedAdmission] = useState<string>('All');

  // Filter sample patients dynamically
  const filteredPatients = useMemo(() => {
    return datasetSummary.samplePatients.filter((p) => {
      const matchCohort =
        selectedCohort === 'All'
          ? true
          : selectedCohort === 'Cancer'
          ? p.isCancer
          : !p.isCancer;

      const matchInsurance =
        selectedInsurance === 'All' || p.insurance === selectedInsurance;

      const matchAdmission =
        selectedAdmission === 'All' || p.admissionType === selectedAdmission;

      return matchCohort && matchInsurance && matchAdmission;
    });
  }, [selectedCohort, selectedInsurance, selectedAdmission]);

  // Dynamic KPI calculations based on filtered subset
  const dynamicKPIs = useMemo(() => {
    const total = filteredPatients.length;
    if (total === 0) {
      return {
        totalEncounters: 0,
        cancerCases: 0,
        cancerRate: 0,
        avgBilling: 0,
        abnormalTests: 0,
        abnormalRate: 0,
        emergencyRate: 0
      };
    }

    const cancerCases = filteredPatients.filter((p) => p.isCancer).length;
    const totalBilling = filteredPatients.reduce((sum, p) => sum + p.billing, 0);
    const abnormalTests = filteredPatients.filter((p) => p.testResult === 'Abnormal').length;
    const emergencyCount = filteredPatients.filter((p) => p.admissionType === 'Emergency' || p.admissionType === 'Urgent').length;

    // Scale up proportionally to entire 55,500 population for display realism
    const scaleFactor = 55.5;

    return {
      totalEncounters: Math.round(total * scaleFactor),
      sampleCount: total,
      cancerCases: Math.round(cancerCases * scaleFactor),
      cancerRate: parseFloat(((cancerCases / total) * 100).toFixed(1)),
      avgBilling: Math.round(totalBilling / total),
      abnormalTests: Math.round(abnormalTests * scaleFactor),
      abnormalRate: parseFloat(((abnormalTests / total) * 100).toFixed(1)),
      emergencyRate: parseFloat(((emergencyCount / total) * 100).toFixed(1))
    };
  }, [filteredPatients]);

  // Dynamic condition breakdown
  const conditionData = useMemo(() => {
    const counts: Record<string, number> = {};
    const billingSum: Record<string, number> = {};

    filteredPatients.forEach((p) => {
      counts[p.condition] = (counts[p.condition] || 0) + 1;
      billingSum[p.condition] = (billingSum[p.condition] || 0) + p.billing;
    });

    const conditions = ['Cancer', 'Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Obesity'];
    const total = filteredPatients.length || 1;

    return conditions.map((name) => {
      const count = counts[name] || 0;
      const scaledCount = Math.round(count * 55.5);
      const avgBilling = count > 0 ? Math.round(billingSum[name] / count) : 25000;
      return {
        name,
        count: scaledCount,
        sampleCount: count,
        avgBilling,
        percentage: ((count / total) * 100).toFixed(1),
        highlight: name === 'Cancer'
      };
    });
  }, [filteredPatients]);

  // Dynamic age cohorts breakdown
  const ageGroupData = useMemo(() => {
    const groups: Record<string, { total: number; cancer: number }> = {
      '14-29': { total: 0, cancer: 0 },
      '30-44': { total: 0, cancer: 0 },
      '45-59': { total: 0, cancer: 0 },
      '60-74': { total: 0, cancer: 0 },
      '75+': { total: 0, cancer: 0 }
    };

    filteredPatients.forEach((p) => {
      let g = '75+';
      if (p.age < 30) g = '14-29';
      else if (p.age < 45) g = '30-44';
      else if (p.age < 60) g = '45-59';
      else if (p.age < 75) g = '60-74';

      groups[g].total += 1;
      if (p.isCancer) groups[g].cancer += 1;
    });

    return Object.entries(groups).map(([group, val]) => {
      const rate = val.total > 0 ? parseFloat(((val.cancer / val.total) * 100).toFixed(1)) : 0;
      return {
        group,
        total: Math.round(val.total * 55.5),
        cancer: Math.round(val.cancer * 55.5),
        cancerRate: rate
      };
    });
  }, [filteredPatients]);

  // Dynamic insurance billing data
  const insuranceData = useMemo(() => {
    const stats: Record<string, { count: number; totalBilling: number }> = {};
    const carriers = ['Blue Cross', 'Medicare', 'Aetna', 'UnitedHealthcare', 'Cigna'];
    carriers.forEach((c) => {
      stats[c] = { count: 0, totalBilling: 0 };
    });

    filteredPatients.forEach((p) => {
      if (stats[p.insurance]) {
        stats[p.insurance].count += 1;
        stats[p.insurance].totalBilling += p.billing;
      }
    });

    return Object.entries(stats)
      .map(([name, stat]) => ({
        name,
        shortName: name === 'UnitedHealthcare' ? 'UnitedHealth' : name,
        count: Math.round(stat.count * 55.5),
        avgBilling: stat.count > 0 ? Math.round(stat.totalBilling / stat.count) : 0
      }))
      .filter((item) => selectedInsurance === 'All' || item.name === selectedInsurance);
  }, [filteredPatients, selectedInsurance]);

  // Dynamic test results breakdown
  const testResultsData = useMemo(() => {
    const counts: Record<string, number> = { Normal: 0, Inconclusive: 0, Abnormal: 0 };
    filteredPatients.forEach((p) => {
      counts[p.testResult] = (counts[p.testResult] || 0) + 1;
    });
    const total = filteredPatients.length || 1;

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count: Math.round(count * 55.5),
      percentage: ((count / total) * 100).toFixed(1)
    }));
  }, [filteredPatients]);

  // Dynamic admission types breakdown
  const admissionData = useMemo(() => {
    const counts: Record<string, number> = { Urgent: 0, Emergency: 0, Elective: 0 };
    filteredPatients.forEach((p) => {
      counts[p.admissionType] = (counts[p.admissionType] || 0) + 1;
    });
    const total = filteredPatients.length || 1;

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count: Math.round(count * 55.5),
        percentage: ((count / total) * 100).toFixed(1)
      }))
      .filter((item) => selectedAdmission === 'All' || item.name === selectedAdmission);
  }, [filteredPatients, selectedAdmission]);

  // Download CSV export summary
  const exportSummaryCSV = () => {
    const rows = [
      ['Dimension', 'Category', 'Encounter Count', 'Metric'],
      ...conditionData.map((c) => ['Condition', c.name, c.count.toString(), `$${c.avgBilling} avg`]),
      ...ageGroupData.map((a) => ['Age Group', a.group, a.total.toString(), `${a.cancerRate}% cancer`]),
      ...insuranceData.map((i) => ['Insurance', i.name, i.count.toString(), `$${i.avgBilling} avg`])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'healthcare_cancer_analytics_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Interactive Slicers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                Healthcare BI Workstation
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Interactive Dynamic Slicers</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <HeartPulse className="h-5 w-5 text-rose-600" />
              Oncology & Clinical Inpatient Analytics Dashboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any cohort, insurance payer, or acuity level below to update all charts and metrics in real time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportSummaryCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export BI Summary (.csv)</span>
            </button>
          </div>
        </div>

        {/* Interactive Slicer Toolbar - Value Changes Update Everything */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="font-semibold text-slate-700 shrink-0">Cohort:</span>
            <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 overflow-hidden">
              {(['All', 'Cancer', 'Non-Cancer'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCohort(c)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    selectedCohort === c
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="font-semibold text-slate-700 shrink-0">Payer:</span>
            <select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-[11px] font-medium focus:outline-none w-full"
            >
              <option value="All">All Carriers (5)</option>
              {Object.keys(datasetSummary.insurances).map((ins) => (
                <option key={ins} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="font-semibold text-slate-700 shrink-0">Admission:</span>
            <select
              value={selectedAdmission}
              onChange={(e) => setSelectedAdmission(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-[11px] font-medium focus:outline-none w-full"
            >
              <option value="All">All Acuity Levels</option>
              {Object.keys(datasetSummary.admissions).map((adm) => (
                <option key={adm} value={adm}>
                  {adm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 4 KPI Micro Cards - Reacts dynamically to slicers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Selected Cancer Volume</span>
              <Flame className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600 tracking-tight">
              {dynamicKPIs.cancerCases.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {dynamicKPIs.cancerRate}% cohort prevalence
            </div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Mean Billed Charges</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              ${dynamicKPIs.avgBilling.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Inpatient financial baseline
            </div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Abnormal Diagnostics</span>
              <Stethoscope className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 tracking-tight">
              {dynamicKPIs.abnormalTests.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {dynamicKPIs.abnormalRate}% biomarker alert rate
            </div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Emergency / Urgent Influx</span>
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-600 tracking-tight">
              {dynamicKPIs.emergencyRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Acutely flagged encounters
            </div>
          </div>
        </div>

        {/* First Row of Charts: Condition Distribution + Age Cohort Cancer Incidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Medical Condition Distribution - Clean horizontal labels, no merged text */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Medical Condition Patient Volume
                </h3>
                <p className="text-xs text-slate-500">
                  Total encounters partitioned by primary admitting diagnosis
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg border border-rose-200">
                Cancer: {conditionData.find((c) => c.name === 'Cancer')?.count.toLocaleString()} cases
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionData} margin={{ top: 10, right: 15, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#475569' }}
                    interval={0}
                    height={30}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value.toLocaleString()} patients`, 'Encounter Count']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {conditionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Cancer' ? '#e11d48' : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-600 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-600"></span>
                <span className="font-semibold text-rose-700">Cancer Target Cohort</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500"></span>
                <span>Other Medical Conditions</span>
              </div>
            </div>
          </div>

          {/* Age Cohorts & Cancer Incidence Curve */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-rose-500" />
                  Cancer Incidence Proportion by Age Cohort
                </h3>
                <p className="text-xs text-slate-500">
                  Stratified oncology rate across demographic age brackets
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                5 Age Brackets
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ageGroupData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                  <defs>
                    <linearGradient id="cancerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} height={30} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`${value}%`, 'Cancer Incidence Rate']}
                  />
                  <Area
                    type="monotone"
                    dataKey="cancerRate"
                    stroke="#e11d48"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#cancerGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Oncology incidence stabilizes near ~16.6% across age brackets in the hospital cohort.
            </p>
          </div>
        </div>

        {/* Second Row of Charts: Financials & Diagnostic Test Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Average Billing by Insurance - Short name to avoid text clipping */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Mean Inpatient Billed Charges by Insurance Provider
                </h3>
                <p className="text-xs text-slate-500">
                  Total encounters and mean billed charges across major payers
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                Avg: ${dynamicKPIs.avgBilling.toLocaleString()}
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insuranceData} margin={{ top: 10, right: 15, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: '#475569' }}
                    interval={0}
                    height={30}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Avg Billing']}
                  />
                  <Bar dataKey="avgBilling" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Results Breakdown Pie */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-indigo-600" />
                  Diagnostic Test Results
                </h3>
                <p className="text-xs text-slate-500">
                  Normal vs Inconclusive vs Abnormal
                </p>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testResultsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {testResultsData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={TEST_RESULT_COLORS[entry.name as keyof typeof TEST_RESULT_COLORS] || '#64748b'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(val: number) => [`${val.toLocaleString()} tests`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center pt-2 border-t border-slate-200 text-xs">
              {testResultsData.map((t) => (
                <div key={t.name}>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      t.name === 'Normal' ? 'bg-emerald-500' : t.name === 'Inconclusive' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="font-semibold text-slate-700">{t.name}</span>
                  <p className="text-slate-500 font-mono">{t.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row: Admission Types & Medication */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Admission Type Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Urgent, Emergency, and Elective distribution
            </p>
            <div className="space-y-3">
              {admissionData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{item.name}</span>
                    <span>{item.count.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.name === 'Emergency'
                          ? 'bg-rose-500'
                          : item.name === 'Urgent'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Pill className="h-4 w-4 text-purple-600" />
              Prescribed Medications
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Inpatient pharmaceutical distribution
            </p>
            <div className="space-y-2.5">
              {Object.entries(datasetSummary.medications).map(([name, count]) => {
                const pct = ((count / datasetSummary.totalRecords) * 100).toFixed(1);
                return (
                  <div key={name} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="font-semibold text-slate-800">{name}</span>
                    </div>
                    <span className="font-mono text-slate-600">{count.toLocaleString()} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
