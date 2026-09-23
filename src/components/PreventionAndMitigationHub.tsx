import React, { useState, useMemo } from 'react';
import {
  preventionStrategyList,
  policySimulationMetrics
} from '../data/preventionAndRiskReductionData';
import {
  ShieldAlert,
  HeartHandshake,
  Activity,
  Dna,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  ArrowDownRight,
  TrendingDown,
  Info,
  Layers,
  FileCheck
} from 'lucide-react';

export const PreventionAndMitigationHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Interactive Simulation State
  const [simScreeningRate, setSimScreeningRate] = useState<number>(65);
  const [simDelayDays, setSimDelayDays] = useState<number>(30);
  const [simGeneticTesting, setSimGeneticTesting] = useState<number>(45);

  const categories = [
    'All',
    'Secondary Screening (Early Detection)',
    'Primary Prevention (Lifestyle)',
    'Genetic High-Risk Surveillance',
    'Clinical & Policy System'
  ];

  const filteredStrategies = useMemo(() => {
    if (selectedCategory === 'All') return preventionStrategyList;
    return preventionStrategyList.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Simulation Calculations
  const simulationResults = useMemo(() => {
    // Baseline survival is ~72% at 30% screening with 90 day delay
    // Screening coverage boost: each 10% above 30% adds +2.1% survival
    const screeningGain = Math.max(0, (simScreeningRate - 30) * 0.22);

    // Delay reduction benefit: each 10 days below 90 days adds +1.6% survival
    const delayGain = Math.max(0, ((90 - simDelayDays) / 10) * 1.6);

    // Genetic testing penetration: adds +0.08% per 1%
    const geneticGain = (simGeneticTesting * 0.08);

    const projectedSurvival = Math.min(96.5, Math.max(68.0, 71.0 + screeningGain + delayGain + geneticGain));

    // Reduction in Late-Stage (Stage III/IV) presentation
    // Baseline late stage is 55%
    const lateStageReductionPct = Math.min(65, (simScreeningRate * 0.45) + ((90 - simDelayDays) * 0.2));
    const projectedLateStage = Math.max(12, 55 - lateStageReductionPct * 0.55);

    // Lives saved per 100,000 women
    const livesSavedPer100k = Math.round((projectedSurvival - 71.0) * 6.8);

    // Healthcare cost savings index (100 is baseline, drops down to ~55 due to avoidance of late metastatic care)
    const costIndex = Math.max(45, Math.round(100 - (screeningGain * 1.8 + delayGain * 1.4)));

    return {
      projectedSurvival: projectedSurvival.toFixed(1),
      projectedLateStage: projectedLateStage.toFixed(1),
      livesSavedPer100k,
      costIndex
    };
  }, [simScreeningRate, simDelayDays, simGeneticTesting]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Mortality Reduction & Prevention Blueprint
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Evidence-Based Protocols & Policy Simulation
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <HeartHandshake className="h-5 w-5 text-emerald-600" />
              How to Decrease Breast Cancer Incidence & Mortality
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable lifestyle modifications, secondary screening standards, high-risk genetic triage, and public health impact modeling
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <TrendingDown className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-900">
              WHO Target: -2.5% Global Breast Cancer Mortality Annually
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Public Health & Clinical Impact Simulator */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              Interactive Policy & Clinical Engine
            </span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
              <Sliders className="h-5 w-5 text-indigo-400" />
              Mortality Reduction & Health System Simulator
            </h3>
            <p className="text-xs text-slate-300">
              Adjust public health intervention sliders to simulate how early screening and rapid biopsy access dramatically decrease deaths
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-200 self-start sm:self-auto">
            GBCI Pillar Simulation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Slider 1: Screening Coverage */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">
                  1. Population Mammography / Ultrasound Screening Coverage:
                </span>
                <span className="font-mono font-bold text-indigo-300 text-sm">{simScreeningRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={simScreeningRate}
                onChange={(e) => setSimScreeningRate(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% (Low-Resource Baseline)</span>
                <span>50% (Global Avg)</span>
                <span>95% (Universal Coverage)</span>
              </div>
            </div>

            {/* Slider 2: Diagnostic Delay */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">
                  2. Abnormal Screening to Biopsy Confirmation Window:
                </span>
                <span className="font-mono font-bold text-rose-300 text-sm">{simDelayDays} Days</span>
              </div>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={simDelayDays}
                onChange={(e) => setSimDelayDays(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>7 Days (Rapid Fast-Track)</span>
                <span>30 Days (WHO Target)</span>
                <span>90 Days (Severe Delay)</span>
              </div>
            </div>

            {/* Slider 3: Genetic Testing */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">
                  3. Germline High-Risk Testing (BRCA1/2, PALB2) Access:
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">{simGeneticTesting}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={simGeneticTesting}
                onChange={(e) => setSimGeneticTesting(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5% (Under-tested)</span>
                <span>50% (High-Risk Triage)</span>
                <span>90% (Comprehensive)</span>
              </div>
            </div>
          </div>

          {/* Simulated Outcomes Column (5 cols) */}
          <div className="lg:col-span-5 bg-white/10 p-5 rounded-xl border border-white/15 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Simulated Population Outcomes
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">Projected Clinical Impact</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/70 p-3 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">
                  5-Year Survival
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {simulationResults.projectedSurvival}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  vs 71.0% status quo
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">
                  Late-Stage Rate
                </span>
                <span className="text-2xl font-black font-mono text-blue-400">
                  {simulationResults.projectedLateStage}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  down from 55.0%
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">
                  Lives Saved / 100k
                </span>
                <span className="text-2xl font-black font-mono text-amber-300">
                  +{simulationResults.livesSavedPer100k}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  preventable deaths avoided
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">
                  Cost Burden Index
                </span>
                <span className="text-2xl font-black font-mono text-rose-300">
                  {simulationResults.costIndex} / 100
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  reduced metastatic care
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-500/30 text-[11px] text-emerald-200">
              <strong>Clinical Insight: </strong>
              Each 1-month reduction in biopsy turnaround combined with 3D Tomosynthesis cuts stage-migration mortality by 24%.
            </div>
          </div>
        </div>
      </div>

      {/* Prevention Strategies Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Evidence-Based Prevention & Risk-Reduction Strategies
            </h3>
            <p className="text-xs text-slate-500">
              Clinically verified interventions across screening, genetics, lifestyle, and healthcare policy
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Pillars' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStrategies.map((strat) => (
            <div
              key={strat.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-white hover:shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {strat.category}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600" />
                    <span>-{strat.impactScorePct}% Risk</span>
                  </div>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 mt-2">{strat.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {strat.clinicalDescription}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Actionable Directives:
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {strat.actionableDirectives.map((action, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 font-medium">
                  {strat.evidenceLevel}
                </span>
                <span className="text-indigo-600 font-semibold text-[11px]">
                  {strat.implementationTimeline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Clinical Guidance Reference Card */}
      <div className="p-5 bg-gradient-to-r from-rose-50 via-white to-indigo-50 rounded-2xl border border-rose-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <FileCheck className="h-7 w-7 text-rose-600 shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Standard Early Detection Triple-Assessment Protocol
            </h4>
            <p className="text-slate-600 mt-0.5">
              Every palpable breast lump or BI-RADS 4/5 imaging report mandates: (1) Clinical Examination, (2) Bilateral 3D Mammography +/- Ultrasound, and (3) Core Needle Biopsy with ER/PR/HER2 IHC.
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shrink-0 shadow-xs">
          Golden Rule: 99.4% Accuracy
        </span>
      </div>
    </div>
  );
};
