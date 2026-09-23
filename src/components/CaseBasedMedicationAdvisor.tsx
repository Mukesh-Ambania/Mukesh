import React, { useState, useEffect } from 'react';
import {
  Pill,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Printer,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Info,
  Layers,
  Clock,
  BookOpen,
  FileCheck,
  ChevronRight,
  Heart,
  Stethoscope
} from 'lucide-react';

interface PrimaryEndocrineRegimen {
  drug: string;
  brandName: string;
  class: string;
  doseAndSchedule: string;
  recommendedDuration: string;
  clinicalRationale: string;
  ovarianSuppressionNeeded: boolean;
  keyMonitoring: string[];
}

interface TargetedTherapy {
  drug: string;
  brandName: string;
  mechanism: string;
  doseAndSchedule: string;
  indication: string;
  evidenceTrial: string;
  safetyAlert: string;
}

interface ChemotherapyRegimen {
  regimenName: string;
  abbreviation: string;
  drugs: string[];
  schedule: string;
  cycles: string;
  expectedBenefit: string;
  cardiacMonitoringRequired: boolean;
}

interface ImmunotherapyAgent {
  drug: string;
  brandName: string;
  class: string;
  clinicalRole: string;
}

interface SupportiveAgent {
  drug: string;
  brandName: string;
  role: string;
  administration: string;
}

interface MedicationProtocol {
  caseSummary: string;
  molecularSubtype: string;
  regimenGoal: string;
  primaryEndocrineRegimen: PrimaryEndocrineRegimen;
  targetedTherapies: TargetedTherapy[];
  chemotherapyRegimens: ChemotherapyRegimen[];
  immunotherapyAndNovelAgents: ImmunotherapyAgent[];
  supportiveAndBoneCare: SupportiveAgent[];
  criticalWarningsAndContraindications: string[];
}

const CASE_PRESETS = [
  {
    id: 'case-postmeno-hr-her2neg',
    title: 'Postmenopausal HR+/HER2- Stage IIA',
    subtitle: '62y female • Invasive Ductal Carcinoma • Luminal A',
    data: {
      stage: 'Stage IIA',
      erStatus: 'Positive',
      prStatus: 'Positive',
      her2Status: 'Negative',
      menopausalStatus: 'Postmenopausal',
      patientAge: 62,
      brcaStatus: 'Negative',
      oncotypeRisk: 'Intermediate (Score 21)',
      cardiacHistory: false
    }
  },
  {
    id: 'case-premeno-her2pos',
    title: 'Premenopausal HER2-Enriched Stage IIB',
    subtitle: '38y female • ER-/PR-/HER2+ • High Proliferation',
    data: {
      stage: 'Stage IIB',
      erStatus: 'Negative',
      prStatus: 'Negative',
      her2Status: 'Positive',
      menopausalStatus: 'Premenopausal',
      patientAge: 38,
      brcaStatus: 'Negative',
      oncotypeRisk: 'High Genomic Risk',
      cardiacHistory: false
    }
  },
  {
    id: 'case-tnbc-brca1',
    title: 'Triple-Negative (TNBC) Stage IIIA with BRCA1+',
    subtitle: '44y female • ER-/PR-/HER2- • Germline BRCA1 Mutant',
    data: {
      stage: 'Stage IIIA',
      erStatus: 'Negative',
      prStatus: 'Negative',
      her2Status: 'Negative',
      menopausalStatus: 'Premenopausal',
      patientAge: 44,
      brcaStatus: 'Positive (Deleterious BRCA1)',
      oncotypeRisk: 'High Genomic Risk',
      cardiacHistory: false
    }
  },
  {
    id: 'case-metastatic-stage4',
    title: 'De Novo Metastatic Stage IV HR+/HER2-',
    subtitle: '57y female • Bone & Soft Tissue Dissemination',
    data: {
      stage: 'Stage IV (Metastatic)',
      erStatus: 'Positive',
      prStatus: 'Positive',
      her2Status: 'Negative',
      menopausalStatus: 'Postmenopausal',
      patientAge: 57,
      brcaStatus: 'Negative',
      oncotypeRisk: 'Metastatic Disease',
      cardiacHistory: false
    }
  }
];

export const CaseBasedMedicationAdvisor: React.FC = () => {
  // Case Parameters State
  const [stage, setStage] = useState<string>('Stage IIA');
  const [erStatus, setErStatus] = useState<string>('Positive');
  const [prStatus, setPrStatus] = useState<string>('Positive');
  const [her2Status, setHer2Status] = useState<string>('Negative');
  const [menopausalStatus, setMenopausalStatus] = useState<string>('Postmenopausal');
  const [patientAge, setPatientAge] = useState<number>(58);
  const [brcaStatus, setBrcaStatus] = useState<string>('Negative');
  const [oncotypeRisk, setOncotypeRisk] = useState<string>('Intermediate (Score 21)');
  const [cardiacHistory, setCardiacHistory] = useState<boolean>(false);

  // Status & Data State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [protocol, setProtocol] = useState<MedicationProtocol | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'endocrine' | 'targeted' | 'chemo' | 'supportive'>('all');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);

  // Fetch Recommended Medication Regimen
  const fetchMedications = async (customParams?: any) => {
    setIsLoading(true);
    const payload = customParams || {
      stage,
      erStatus,
      prStatus,
      her2Status,
      menopausalStatus,
      patientAge,
      brcaStatus,
      oncotypeRisk,
      cardiacHistory
    };

    try {
      const res = await fetch('/api/recommend-medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Medication query failed');
      const data = await res.json();
      if (data.medications) {
        setProtocol(data.medications);
      }
    } catch {
      // Offline fallback
      setProtocol(getFallbackProtocol(payload));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleApplyPreset = (preset: typeof CASE_PRESETS[0]) => {
    setStage(preset.data.stage);
    setErStatus(preset.data.erStatus);
    setPrStatus(preset.data.prStatus);
    setHer2Status(preset.data.her2Status);
    setMenopausalStatus(preset.data.menopausalStatus);
    setPatientAge(preset.data.patientAge);
    setBrcaStatus(preset.data.brcaStatus);
    setOncotypeRisk(preset.data.oncotypeRisk);
    setCardiacHistory(preset.data.cardiacHistory);

    fetchMedications(preset.data);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Case-Based Oncology Medication Advisor
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NCCN &amp; ASCO 2024 Guidelines
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Precision Pharmacotherapy
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Generates tailored drug regimens, dosages, scheduling, clinical trial evidence, and safety monitoring protocols matching the exact cancer stage and molecular biomarkers of your case.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {protocol && (
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Medication Leaflet</span>
              </button>
            )}
          </div>
        </div>

        {/* Case Presets Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Load Standard Clinical Patient Cases:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {CASE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                    {preset.data.stage}
                  </span>
                  <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="font-semibold text-slate-900 text-xs line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {preset.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs (4 cols) & Medications Output (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Case Parameters Customizer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                <span>Patient Case Parameters</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">NCCN Stratification</span>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">
                AJCC Cancer Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Stage 0 (In Situ)">Stage 0 (DCIS In Situ)</option>
                <option value="Stage IA">Stage IA (T1 N0 M0)</option>
                <option value="Stage IB">Stage IB (T0/T1 N1mi M0)</option>
                <option value="Stage IIA">Stage IIA (T2 N0 M0)</option>
                <option value="Stage IIB">Stage IIB (T2 N1 M0)</option>
                <option value="Stage IIIA">Stage IIIA (T3 N1 M0 / T2 N2 M0)</option>
                <option value="Stage IIIB">Stage IIIB (T4 N0-N2 M0 - Chest wall/skin)</option>
                <option value="Stage IIIC">Stage IIIC (Any T N3 M0 - Infraclavicular/Internal mammary)</option>
                <option value="Stage IV (Metastatic)">Stage IV (Distant Metastatic M1)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">ER</label>
                <select
                  value={erStatus}
                  onChange={(e) => setErStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Positive">Positive (+)</option>
                  <option value="Negative">Negative (-)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">PR</label>
                <select
                  value={prStatus}
                  onChange={(e) => setPrStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Positive">Positive (+)</option>
                  <option value="Negative">Negative (-)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">HER2</label>
                <select
                  value={her2Status}
                  onChange={(e) => setHer2Status(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Positive">Positive (+)</option>
                  <option value="Negative">Negative (-)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">
                Menopausal Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Premenopausal', 'Postmenopausal'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setMenopausalStatus(status)}
                    className={`py-2 px-2 rounded-xl text-center font-bold border transition-all ${
                      menopausalStatus === status
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800">
                  Patient Age: <strong className="text-emerald-700">{patientAge} yrs</strong>
                </label>
              </div>
              <input
                type="range"
                min={25}
                max={85}
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">
                Germline BRCA Mutation
              </label>
              <select
                value={brcaStatus}
                onChange={(e) => setBrcaStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Negative">Negative / Wild-Type</option>
                <option value="Positive (Deleterious BRCA1)">Positive (Deleterious BRCA1 Mutation)</option>
                <option value="Positive (Deleterious BRCA2)">Positive (Deleterious BRCA2 Mutation)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Cardiac History Caution</span>
                <span className="text-slate-500 text-[11px]">Anthracycline cardiotoxicity guard</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardiacHistory}
                  onChange={(e) => setCardiacHistory(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <button
              onClick={() => fetchMedications()}
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>Generating Regimen...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Update Medication Regimen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Medication Protocols Dashboard */}
        <div className="lg:col-span-8 space-y-4">
          {protocol ? (
            <div className="space-y-4">
              {/* Header Molecular Subtype & Case Summary */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Prescription Strategy
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {protocol.molecularSubtype}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {protocol.caseSummary}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Clinical Goal
                    </span>
                    <span className="inline-block mt-0.5 px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {protocol.regimenGoal}
                    </span>
                  </div>
                </div>

                {/* Filter Navigation Tabs */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-1">
                  {[
                    { id: 'all', label: 'All Medications' },
                    { id: 'endocrine', label: 'Endocrine Blockade' },
                    { id: 'targeted', label: 'Targeted & ADCs' },
                    { id: 'chemo', label: 'Chemotherapy' },
                    { id: 'supportive', label: 'Supportive & Bone' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeCategory === tab.id
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Endocrine / Hormone Blockade */}
              {(activeCategory === 'all' || activeCategory === 'endocrine') && protocol.primaryEndocrineRegimen && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Primary Endocrine Therapy (Hormone Receptor Blockade)
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Indicated for Estrogen (ER) and/or Progesterone (PR) positive tumors
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-indigo-100/80">
                      <div>
                        <span className="text-sm font-black text-slate-900">
                          {protocol.primaryEndocrineRegimen.drug}
                        </span>
                        <span className="text-xs text-indigo-700 font-semibold ml-2">
                          ({protocol.primaryEndocrineRegimen.brandName})
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          {protocol.primaryEndocrineRegimen.class}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-semibold">Recommended Duration</span>
                        <span className="font-bold text-slate-800 text-xs">
                          {protocol.primaryEndocrineRegimen.recommendedDuration}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-semibold block">Dose &amp; Administration:</span>
                        <span className="font-mono text-slate-800 font-bold">
                          {protocol.primaryEndocrineRegimen.doseAndSchedule}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold block">Ovarian Suppression Needed:</span>
                        <span className={`font-bold ${
                          protocol.primaryEndocrineRegimen.ovarianSuppressionNeeded
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}>
                          {protocol.primaryEndocrineRegimen.ovarianSuppressionNeeded ? 'Yes (LHRH Agonist indicated)' : 'No (Standard monotherapy)'}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2.5 pt-2 border-t border-indigo-100/80 text-slate-700 leading-relaxed">
                      <strong>Clinical Rationale:</strong> {protocol.primaryEndocrineRegimen.clinicalRationale}
                    </p>

                    {protocol.primaryEndocrineRegimen.keyMonitoring?.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800">Laboratory &amp; Safety Monitoring:</span>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                          {protocol.primaryEndocrineRegimen.keyMonitoring.map((mon, i) => (
                            <li key={i}>{mon}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Targeted Biologics & ADCs */}
              {(activeCategory === 'all' || activeCategory === 'targeted') && protocol.targetedTherapies?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Targeted Biologics, Monoclonal Antibodies &amp; CDK4/6 Inhibitors
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Precision molecular targets: HER2, CDK4/6, or germline PARP
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {protocol.targetedTherapies.map((tgt, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-slate-200">
                          <div>
                            <span className="text-sm font-black text-slate-900">
                              {tgt.drug}
                            </span>
                            <span className="text-xs text-rose-700 font-semibold ml-2">
                              ({tgt.brandName})
                            </span>
                            <p className="text-[11px] text-slate-600 mt-0.5">{tgt.mechanism}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 shrink-0">
                            {tgt.evidenceTrial}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-semibold block">Dose &amp; Frequency:</span>
                            <span className="font-mono text-slate-800 font-bold">{tgt.doseAndSchedule}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Indication:</span>
                            <span className="text-slate-700">{tgt.indication}</span>
                          </div>
                        </div>

                        {tgt.safetyAlert && (
                          <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{tgt.safetyAlert}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Systemic Chemotherapy Protocols */}
              {(activeCategory === 'all' || activeCategory === 'chemo') && protocol.chemotherapyRegimens?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Systemic Chemotherapy Regimens
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Evidence-based cytotoxic combination protocols
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {protocol.chemotherapyRegimens.map((chemo, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                          <div>
                            <span className="font-black text-slate-900 text-sm">
                              {chemo.regimenName}
                            </span>
                            <span className="text-xs font-mono font-bold text-teal-700 ml-2">
                              [{chemo.abbreviation}]
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                            {chemo.cycles}
                          </span>
                        </div>

                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {chemo.drugs.map((drug, dIdx) => (
                            <span key={dIdx} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white border border-slate-300 text-slate-800">
                              {drug}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                          <p><strong>Administration Schedule:</strong> {chemo.schedule}</p>
                          <p className="mt-1"><strong>Expected Survival Benefit:</strong> {chemo.expectedBenefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Supportive, Antiemetic & Bone Modifying Medications */}
              {(activeCategory === 'all' || activeCategory === 'supportive') && protocol.supportiveAndBoneCare?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <HeartPulse className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Supportive Care, Bone Protection &amp; Infection Prophylaxis
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Bisphosphonates, G-CSF neutropenia support, and antiemetic regimens
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {protocol.supportiveAndBoneCare.map((supp, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-black text-slate-900 block text-xs">
                          {supp.drug}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold block mb-1">
                          {supp.brandName}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {supp.role}
                        </p>
                        <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                          {supp.administration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Warnings & Contraindications */}
              {protocol.criticalWarningsAndContraindications?.length > 0 && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-800">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <span>Clinical Oncology Safety Alerts &amp; Critical Monitoring:</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-amber-900/90 list-disc list-inside">
                    {protocol.criticalWarningsAndContraindications.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 flex flex-col items-center justify-center">
              <Activity className="h-8 w-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-800">Generating Evidence-Based Regimen...</p>
            </div>
          )}
        </div>
      </div>

      {/* Printable Pharmacotherapy Leaflet Modal */}
      {showPrescriptionModal && protocol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Clinical Oncology Pharmacotherapy Protocol
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Patient Medication Plan &amp; Administration Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Stage: {stage} • Molecular Profile: {protocol.molecularSubtype} • Patient Age: {patientAge}
                </p>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Primary Endocrine Prescriptions:</span>
                <p className="text-slate-700">
                  {protocol.primaryEndocrineRegimen?.drug} ({protocol.primaryEndocrineRegimen?.brandName}) — {protocol.primaryEndocrineRegimen?.doseAndSchedule} for {protocol.primaryEndocrineRegimen?.recommendedDuration}.
                </p>
              </div>

              {protocol.targetedTherapies?.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Targeted Biologics:</span>
                  {protocol.targetedTherapies.map((t, i) => (
                    <div key={i} className="mb-1 text-slate-700">
                      • {t.drug} ({t.brandName}): {t.doseAndSchedule}
                    </div>
                  ))}
                </div>
              )}

              {protocol.chemotherapyRegimens?.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Chemotherapy Protocol:</span>
                  {protocol.chemotherapyRegimens.map((c, i) => (
                    <div key={i} className="mb-1 text-slate-700">
                      • {c.regimenName} [{c.abbreviation}] — {c.cycles}
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Bone Health &amp; Supportive Therapy:</span>
                {protocol.supportiveAndBoneCare?.map((s, i) => (
                  <div key={i} className="mb-1 text-slate-700">
                    • {s.drug}: {s.role}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Medication Sheet</span>
              </button>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Client-side fallback protocol generator
function getFallbackProtocol(data: any): MedicationProtocol {
  const {
    stage = 'Stage IIA',
    erStatus = 'Positive',
    prStatus = 'Positive',
    her2Status = 'Negative',
    menopausalStatus = 'Postmenopausal',
    patientAge = 58,
    brcaStatus = 'Negative'
  } = data;

  const isEr = erStatus.includes('Pos');
  const isHer2 = her2Status.includes('Pos');
  const isPost = menopausalStatus.includes('Post') || patientAge >= 55;
  const isBrca = brcaStatus.includes('Pos');

  let subtype = 'Luminal A (HR+/HER2-)';
  if (!isEr && !isHer2) subtype = 'Triple-Negative Breast Cancer (TNBC)';
  else if (isHer2 && isEr) subtype = 'Luminal B (HER2-Positive)';
  else if (isHer2 && !isEr) subtype = 'HER2-Enriched';

  return {
    caseSummary: `Personalized Pharmacotherapy Protocol for ${stage} ${subtype}`,
    molecularSubtype: subtype,
    regimenGoal: stage.includes('IV') ? 'Metastatic Disease Control' : 'Curative / Adjuvant Eradication',
    primaryEndocrineRegimen: isEr
      ? {
          drug: isPost ? 'Anastrozole (or Letrozole)' : 'Tamoxifen + Ovarian Function Suppression (Goserelin)',
          brandName: isPost ? 'Arimidex / Femara' : 'Nolvadex + Zoladex',
          class: isPost ? 'Aromatase Inhibitor (AI)' : 'SERM + LHRH Agonist',
          doseAndSchedule: isPost ? '1 mg PO once daily' : 'Tamoxifen 20mg PO daily + Zoladex 3.6mg SC depot q28d',
          recommendedDuration: '5 to 10 years',
          clinicalRationale: 'Inhibits estrogen stimulation of tumor cells, significantly decreasing long-term recurrence rates.',
          ovarianSuppressionNeeded: !isPost,
          keyMonitoring: ['Baseline DEXA bone density scan every 1-2 years', 'Monitor for arthralgias']
        }
      : {
          drug: 'Receptor Negative',
          brandName: 'N/A',
          class: 'Endocrine Therapy Not Indicated',
          doseAndSchedule: 'None',
          recommendedDuration: 'None',
          clinicalRationale: 'Tumor lacks hormone receptors; endocrine therapy provides no therapeutic benefit.',
          ovarianSuppressionNeeded: false,
          keyMonitoring: []
        },
    targetedTherapies: isHer2
      ? [
          {
            drug: 'Trastuzumab + Pertuzumab',
            brandName: 'Phesgo / Herceptin + Perjeta',
            mechanism: 'Dual HER2 receptor domain II and IV blockade',
            doseAndSchedule: 'Subcutaneous 1200mg/600mg load, then 600mg/600mg q3w for 1 year',
            indication: 'HER2+ invasive breast cancer',
            evidenceTrial: 'APHINITY and CLEOPATRA Trials',
            safetyAlert: 'Echocardiogram required every 3 months to monitor LVEF ejection fraction.'
          }
        ]
      : (isBrca ? [
          {
            drug: 'Olaparib',
            brandName: 'Lynparza',
            mechanism: 'PARP inhibitor inducing synthetic lethality in BRCA-mutated cells',
            doseAndSchedule: '300 mg PO BID for 1 year',
            indication: 'High-risk HER2-negative germline BRCA1/2-mutated breast cancer',
            evidenceTrial: 'OlympiA Phase III Trial',
            safetyAlert: 'Monitor CBC for anemia and neutropenia.'
          }
        ] : []),
    chemotherapyRegimens: [
      {
        regimenName: isHer2 ? 'Docetaxel + Carboplatin + Trastuzumab + Pertuzumab' : 'Docetaxel + Cyclophosphamide (TC)',
        abbreviation: isHer2 ? 'TCH-P' : 'TC',
        drugs: isHer2 ? ['Docetaxel 75mg/m2', 'Carboplatin AUC 6', 'Trastuzumab', 'Pertuzumab'] : ['Docetaxel 75mg/m2', 'Cyclophosphamide 600mg/m2'],
        schedule: 'Intravenously on Day 1 of every 21-day cycle with G-CSF support',
        cycles: '4 to 6 cycles',
        expectedBenefit: 'Significantly improves disease-free survival and prevents distant metastasis.',
        cardiacMonitoringRequired: isHer2
      }
    ],
    immunotherapyAndNovelAgents: subtype.includes('Triple-Negative')
      ? [
          {
            drug: 'Pembrolizumab',
            brandName: 'Keytruda',
            class: 'Anti-PD-1 Checkpoint Inhibitor',
            clinicalRole: 'Restores anti-tumor T-cell immunity in high-risk TNBC.'
          }
        ]
      : [],
    supportiveAndBoneCare: [
      {
        drug: 'Zoledronic Acid (Zometa)',
        brandName: 'Zometa 4mg IV',
        role: 'Adjuvant bone protection; reduces bone recurrence in postmenopausal women.',
        administration: '4 mg IV every 6 months for 3 years.'
      },
      {
        drug: 'Pegfilgrastim (Neulasta)',
        brandName: 'Neulasta',
        role: 'Prophylaxis against chemotherapy-induced febrile neutropenia.',
        administration: '6 mg SC 24 hours after each chemotherapy cycle.'
      }
    ],
    criticalWarningsAndContraindications: [
      'Document baseline LVEF via echocardiogram prior to cardiotoxic therapies.',
      'Maintain strict daily adherence to oral endocrine therapy for maximum 10-year survival benefit.',
      'Check baseline bone density (DEXA) prior to aromatase inhibitors.'
    ]
  };
}
