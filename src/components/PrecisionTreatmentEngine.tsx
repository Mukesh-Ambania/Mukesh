import React, { useState, useMemo } from 'react';
import {
  PatientCaseParameters,
  PrecisionPrescriptionResult
} from '../types';
import {
  generatePrecisionPrescription,
  predefinedArchetypeCases
} from '../data/precisionOncologyProtocols';
import {
  Stethoscope,
  Pill,
  Scissors,
  Zap,
  Activity,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle2,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  UserCheck,
  Percent,
  Sliders,
  Info
} from 'lucide-react';

export const PrecisionTreatmentEngine: React.FC = () => {
  // Active Case Parameters State
  const [caseParams, setCaseParams] = useState<PatientCaseParameters>(
    predefinedArchetypeCases[0].defaultInput
  );
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>(
    predefinedArchetypeCases[0].id
  );

  // Compute precision prescription in real-time
  const prescriptionResult: PrecisionPrescriptionResult = useMemo(() => {
    return generatePrecisionPrescription(caseParams);
  }, [caseParams]);

  const handleSelectArchetype = (archetypeId: string) => {
    const found = predefinedArchetypeCases.find((c) => c.id === archetypeId);
    if (found) {
      setSelectedArchetypeId(found.id);
      setCaseParams({ ...found.defaultInput });
    }
  };

  const handleCustomParamChange = <K extends keyof PatientCaseParameters>(
    key: K,
    val: PatientCaseParameters[K]
  ) => {
    setSelectedArchetypeId('custom');
    setCaseParams((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  const printOrExportTreatmentPlan = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                Precision Oncology Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                NCCN / ASCO Clinical Guidelines v2.2024
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <Stethoscope className="h-5 w-5 text-indigo-600" />
              Case-Specific Clinical Prescription & Treatment Protocol Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or customize tumor markers (ER, PR, HER2, Ki-67, Stage, BRCA) to receive instant evidence-based systemic, surgical, and radiation prescriptions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={printOrExportTreatmentPlan}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Export Clinical Protocol</span>
            </button>
          </div>
        </div>

        {/* Archetype Quick-Selector Buttons */}
        <div className="pt-4">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Load Clinical Archetype Presentations:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {predefinedArchetypeCases.map((archetype) => {
              const isSelected = selectedArchetypeId === archetype.id;
              return (
                <button
                  key={archetype.id}
                  onClick={() => handleSelectArchetype(archetype.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isSelected ? 'text-indigo-700' : 'text-slate-500'
                      }`}
                    >
                      {archetype.stage}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {archetype.caseName.split(':')[1] || archetype.caseName}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 font-mono line-clamp-1">
                    {archetype.subtype.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Output Protocol on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Tuner (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-indigo-600" />
              Patient Biomarker & Staging Profile
            </h3>
            {selectedArchetypeId === 'custom' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Custom Case
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Age & Menopause */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Patient Age: <span className="font-mono text-indigo-600 font-bold">{caseParams.age} yrs</span>
                </label>
                <input
                  type="range"
                  min="24"
                  max="85"
                  value={caseParams.age}
                  onChange={(e) => handleCustomParamChange('age', Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Menopause Status</label>
                <select
                  value={caseParams.menopausalStatus}
                  onChange={(e) =>
                    handleCustomParamChange(
                      'menopausalStatus',
                      e.target.value as PatientCaseParameters['menopausalStatus']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Premenopausal">Premenopausal</option>
                  <option value="Postmenopausal">Postmenopausal</option>
                </select>
              </div>
            </div>

            {/* Tumor Size & Nodal status */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Tumor Dimension (T-Stage):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {caseParams.tumorSizeMm} mm ({caseParams.tumorSizeMm <= 20 ? 'T1' : caseParams.tumorSizeMm <= 50 ? 'T2' : 'T3'})
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={caseParams.tumorSizeMm}
                  onChange={(e) => handleCustomParamChange('tumorSizeMm', Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Involved Axillary Nodes (N-Stage):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {caseParams.lymphNodeInvolved} nodes ({caseParams.lymphNodeInvolved === 0 ? 'N0' : caseParams.lymphNodeInvolved <= 3 ? 'N1' : 'N2/N3'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={caseParams.lymphNodeInvolved}
                  onChange={(e) => handleCustomParamChange('lymphNodeInvolved', Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Metastasis Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700">Distant Metastases (M-Stage):</span>
                <button
                  type="button"
                  onClick={() => handleCustomParamChange('metastasisPresent', !caseParams.metastasisPresent)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    caseParams.metastasisPresent
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {caseParams.metastasisPresent ? 'M1 (Present / Stage IV)' : 'M0 (None / Localized)'}
                </button>
              </div>
            </div>

            {/* IHC Biomarkers: ER, PR, HER2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Estrogen (ER)</label>
                <select
                  value={caseParams.erStatus}
                  onChange={(e) =>
                    handleCustomParamChange(
                      'erStatus',
                      e.target.value as PatientCaseParameters['erStatus']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Positive (>10%)">Positive (&gt;10%)</option>
                  <option value="Low-Positive (1-9%)">Low-Pos (1-9%)</option>
                  <option value="Negative (<1%)">Negative (&lt;1%)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Progesterone (PR)</label>
                <select
                  value={caseParams.prStatus}
                  onChange={(e) =>
                    handleCustomParamChange(
                      'prStatus',
                      e.target.value as PatientCaseParameters['prStatus']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">HER2 / Neu</label>
                <select
                  value={caseParams.her2Status}
                  onChange={(e) =>
                    handleCustomParamChange(
                      'her2Status',
                      e.target.value as PatientCaseParameters['her2Status']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Negative (IHC 0/1+)">Negative (0/1+)</option>
                  <option value="Positive (IHC 3+ / FISH Amplified)">Positive (3+)</option>
                  <option value="Equivocal (FISH required)">Equivocal</option>
                </select>
              </div>
            </div>

            {/* Ki-67 Proliferation & Histologic Grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Ki-67 Index:</span>
                  <span className="font-mono font-bold text-slate-900">{caseParams.ki67Index}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="95"
                  value={caseParams.ki67Index}
                  onChange={(e) => handleCustomParamChange('ki67Index', Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Histologic Grade</label>
                <select
                  value={caseParams.histologicalGrade}
                  onChange={(e) =>
                    handleCustomParamChange(
                      'histologicalGrade',
                      e.target.value as PatientCaseParameters['histologicalGrade']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Grade 1 (Well-Differentiated)">Grade 1 (Well)</option>
                  <option value="Grade 2 (Intermediate)">Grade 2 (Interm)</option>
                  <option value="Grade 3 (Poorly Differentiated)">Grade 3 (Poorly)</option>
                </select>
              </div>
            </div>

            {/* Germline BRCA & Oncotype DX */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Germline BRCA</label>
                <select
                  value={caseParams.brcaMutation}
                  onChange={(e) =>
                    handleCustomParamChange(
                      'brcaMutation',
                      e.target.value as PatientCaseParameters['brcaMutation']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none"
                >
                  <option value="None / Wild-Type">None / Wild-Type</option>
                  <option value="BRCA1 Pathogenic">BRCA1 Pathogenic</option>
                  <option value="BRCA2 Pathogenic">BRCA2 Pathogenic</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Oncotype DX Score: <span className="font-mono text-indigo-600 font-bold">{caseParams.oncotypeDxRecurrenceScore ?? 'N/A'}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={caseParams.oncotypeDxRecurrenceScore ?? 15}
                  onChange={(e) =>
                    handleCustomParamChange('oncotypeDxRecurrenceScore', Number(e.target.value))
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tailored Clinical Prescription Protocol (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Diagnostic Badges & Prognosis Meters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-xs shadow-2xs">
                  {prescriptionResult.clinicalStage}
                </span>
                <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold text-xs">
                  {prescriptionResult.molecularSubtype}
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-500 font-medium">
                {prescriptionResult.nccnGuidelineRef}
              </span>
            </div>

            {/* Prognostic Score Meters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Projected 5-Yr Survival
                </span>
                <span className="text-2xl font-black font-mono text-emerald-700">
                  {prescriptionResult.projected5YearSurvivalRate}%
                </span>
                <span className="text-[10px] text-emerald-800 block mt-0.5">
                  Under guideline therapy
                </span>
              </div>

              <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-800 block">
                  10-Yr Recurrence Risk
                </span>
                <span className="text-2xl font-black font-mono text-rose-700">
                  {prescriptionResult.projected10YearRecurrenceRisk}%
                </span>
                <span className="text-[10px] text-rose-800 block mt-0.5">
                  Distant metastasis risk
                </span>
              </div>

              <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-indigo-800 block">
                  Chemotherapy Benefit
                </span>
                <span className="text-xs font-bold text-indigo-900 block mt-1">
                  {prescriptionResult.chemoBenefitBenefitScore}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Systemic Chemotherapy & Targeted Prescription */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Pill className="h-4 w-4 text-rose-600" />
              <span>1. Systemic Medical Oncology Prescription</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-sm">
                  {prescriptionResult.firstLineRegimen}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {prescriptionResult.regimenCycleDetails}
              </p>

              {prescriptionResult.targetedTherapy && (
                <div className="pt-2 border-t border-slate-200 flex items-start gap-1.5">
                  <strong className="text-indigo-900 font-semibold shrink-0">Targeted Agent:</strong>
                  <span className="text-indigo-800">{prescriptionResult.targetedTherapy}</span>
                </div>
              )}

              {prescriptionResult.immunotherapy && (
                <div className="pt-1 flex items-start gap-1.5">
                  <strong className="text-blue-900 font-semibold shrink-0">Immunotherapy:</strong>
                  <span className="text-blue-800">{prescriptionResult.immunotherapy}</span>
                </div>
              )}

              {prescriptionResult.endocrineTherapy && (
                <div className="pt-1 flex items-start gap-1.5">
                  <strong className="text-emerald-900 font-semibold shrink-0">Endocrine Therapy:</strong>
                  <span className="text-emerald-800">
                    {prescriptionResult.endocrineTherapy} ({prescriptionResult.endocrineDurationYears} years duration)
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Rationale: </strong>
                {prescriptionResult.clinicalRationaleSummary}
              </span>
            </div>
          </div>

          {/* Section 2: Surgical & Radiation Oncology Protocols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Surgery */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Scissors className="h-4 w-4 text-emerald-600" />
                <span>2. Surgical Oncology Strategy</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {prescriptionResult.surgicalProtocol}
              </p>
            </div>

            {/* Radiation */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>3. Radiation Oncology Strategy</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {prescriptionResult.radiationProtocol}
              </p>
            </div>
          </div>

          {/* Section 3: Surveillance & Follow-up Directives */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>4. Post-Treatment Survivorship & Surveillance Protocol</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-600">
              {prescriptionResult.postTreatmentSurveillance.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
