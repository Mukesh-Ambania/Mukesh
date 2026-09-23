import React, { useState, useEffect } from 'react';
import {
  Camera,
  Activity,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Microscope,
  Info,
  Layers,
  Sparkles,
  FileCheck,
  Printer,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Heart,
  HelpCircle
} from 'lucide-react';

interface DifferentialItem {
  condition: string;
  likelihoodPercent: number;
  category: 'Malignant' | 'Premalignant' | 'Benign';
  description: string;
}

interface BiradsEvaluation {
  biradsCategory: string;
  malignancyRiskPercent: number;
  riskClassification: string;
  biopsyRecommended: boolean;
  biopsyMethod: string;
  clinicalRationale: string;
  differentialDiagnosis: DifferentialItem[];
  recommendedActionPlan: string[];
  patientCounselingAdvice: string;
}

const PRESET_CASES = [
  {
    id: 'case-spiculated-birads5',
    title: 'Spiculated Mass + Linear Microcalcifications',
    subtitle: '58y female, palpable painless mass',
    category: 'BI-RADS 5',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    data: {
      patientAge: 58,
      modality: '3D Digital Tomosynthesis (DBT)',
      breastDensity: 'C',
      massShape: 'irregular',
      massMargin: 'spiculated',
      calcifications: 'fine_linear_branching',
      architecturalDistortion: true,
      palpableLump: 'firm_fixed',
      nippleDischarge: 'none',
      skinChanges: 'dimpling_retraction',
      lymphNodes: 'enlarged_palpable',
      familyHistory: 'one_first_degree',
      clinicalNotes: 'Screening DBT revealed upper-outer quadrant 18mm high-density irregular mass with radiating spicules and fine casting calcifications.'
    }
  },
  {
    id: 'case-fibroadenoma-birads2',
    title: 'Young Female Palpable Mobile Mass',
    subtitle: '24y female, smooth mobile nodule',
    category: 'BI-RADS 2/3',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    data: {
      patientAge: 24,
      modality: 'Targeted High-Resolution Ultrasound',
      breastDensity: 'B',
      massShape: 'oval',
      massMargin: 'circumscribed',
      calcifications: 'none',
      architecturalDistortion: false,
      palpableLump: 'mobile_soft',
      nippleDischarge: 'none',
      skinChanges: 'none',
      lymphNodes: 'normal',
      familyHistory: 'none',
      clinicalNotes: 'Well-circumscribed homogeneous hypoechoic oval nodule with wider-than-tall orientation in lower-inner quadrant, consistent with classic fibroadenoma.'
    }
  },
  {
    id: 'case-dense-masking-birads0',
    title: 'Extremely Dense Breast Tissue (ACR D)',
    subtitle: '49y female, inconclusive screening',
    category: 'BI-RADS 0',
    tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    data: {
      patientAge: 49,
      modality: 'Digital Screening Mammogram',
      breastDensity: 'D',
      massShape: 'none',
      massMargin: 'none',
      calcifications: 'none',
      architecturalDistortion: false,
      palpableLump: 'none',
      nippleDischarge: 'none',
      skinChanges: 'none',
      lymphNodes: 'normal',
      familyHistory: 'none',
      clinicalNotes: 'Extremely dense parenchymal background. Non-calcified soft tissue lesions may be completely masked by overlapping fibroglandular elements.'
    }
  },
  {
    id: 'case-bloody-discharge-birads4b',
    title: 'Spontaneous Bloody Nipple Discharge',
    subtitle: '53y female, subareolar duct dilation',
    category: 'BI-RADS 4B',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    data: {
      patientAge: 53,
      modality: 'Diagnostic Contrast Ultrasound',
      breastDensity: 'B',
      massShape: 'irregular',
      massMargin: 'indistinct',
      calcifications: 'none',
      architecturalDistortion: false,
      palpableLump: 'none',
      nippleDischarge: 'bloody',
      skinChanges: 'none',
      lymphNodes: 'normal',
      familyHistory: 'none',
      clinicalNotes: 'Single-pore spontaneous serosanguinous nipple discharge with 6mm retroareolar intraductal nodule and ectatic lactiferous duct.'
    }
  },
  {
    id: 'case-routine-screening-birads1',
    title: 'Routine Normal Screening Mammogram',
    subtitle: '52y female, annual health checkup',
    category: 'BI-RADS 1',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    data: {
      patientAge: 52,
      modality: 'Digital Screening Mammogram',
      breastDensity: 'B',
      massShape: 'none',
      massMargin: 'none',
      calcifications: 'none',
      architecturalDistortion: false,
      palpableLump: 'none',
      nippleDischarge: 'none',
      skinChanges: 'none',
      lymphNodes: 'normal',
      familyHistory: 'none',
      clinicalNotes: 'Bilateral symmetric fibroglandular parenchyma without architectural distortion, suspicious calcifications, or dominant masses.'
    }
  }
];

export const BiradsImagingEvaluator: React.FC = () => {
  // Form State
  const [patientAge, setPatientAge] = useState<number>(54);
  const [modality, setModality] = useState<string>('3D Digital Tomosynthesis (DBT)');
  const [breastDensity, setBreastDensity] = useState<string>('C');
  const [massShape, setMassShape] = useState<string>('irregular');
  const [massMargin, setMassMargin] = useState<string>('spiculated');
  const [calcifications, setCalcifications] = useState<string>('fine_linear_branching');
  const [architecturalDistortion, setArchitecturalDistortion] = useState<boolean>(true);
  const [palpableLump, setPalpableLump] = useState<string>('firm_fixed');
  const [nippleDischarge, setNippleDischarge] = useState<string>('none');
  const [skinChanges, setSkinChanges] = useState<string>('dimpling_retraction');
  const [lymphNodes, setLymphNodes] = useState<string>('enlarged_palpable');
  const [familyHistory, setFamilyHistory] = useState<string>('one_first_degree');
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    'Right breast upper outer quadrant 18mm firm palpable mass noted on diagnostic mammography and targeted sonogram.'
  );

  // Status & Evaluation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<BiradsEvaluation | null>(null);
  const [activeTab, setActiveTab] = useState<'imaging' | 'clinical' | 'risk'>('imaging');
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);

  // Evaluate Presentation
  const runEvaluation = async (customParams?: any) => {
    setIsLoading(true);
    const payload = customParams || {
      patientAge,
      modality,
      breastDensity,
      massShape,
      massMargin,
      calcifications,
      architecturalDistortion,
      palpableLump,
      nippleDischarge,
      skinChanges,
      lymphNodes,
      familyHistory,
      clinicalNotes
    };

    try {
      const response = await fetch('/api/evaluate-birads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Evaluation request failed');
      const data = await response.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch {
      // Direct local rule-based fallback
      setEvaluation(computeLocalFallback(payload));
    } finally {
      setIsLoading(false);
    }
  };

  // Run on first mount
  useEffect(() => {
    runEvaluation();
  }, []);

  const loadPreset = (preset: typeof PRESET_CASES[0]) => {
    setPatientAge(preset.data.patientAge);
    setModality(preset.data.modality);
    setBreastDensity(preset.data.breastDensity);
    setMassShape(preset.data.massShape);
    setMassMargin(preset.data.massMargin);
    setCalcifications(preset.data.calcifications);
    setArchitecturalDistortion(preset.data.architecturalDistortion);
    setPalpableLump(preset.data.palpableLump);
    setNippleDischarge(preset.data.nippleDischarge);
    setSkinChanges(preset.data.skinChanges);
    setLymphNodes(preset.data.lymphNodes);
    setFamilyHistory(preset.data.familyHistory);
    setClinicalNotes(preset.data.clinicalNotes);

    runEvaluation(preset.data);
  };

  const getBiradsBadgeColor = (category: string) => {
    if (category.includes('5')) return 'bg-rose-600 text-white border-rose-700 shadow-rose-200';
    if (category.includes('4C')) return 'bg-rose-500 text-white border-rose-600';
    if (category.includes('4B')) return 'bg-amber-600 text-white border-amber-700';
    if (category.includes('4A')) return 'bg-amber-500 text-white border-amber-600';
    if (category.includes('3')) return 'bg-yellow-500 text-white border-yellow-600';
    if (category.includes('2')) return 'bg-emerald-600 text-white border-emerald-700';
    if (category.includes('0')) return 'bg-indigo-600 text-white border-indigo-700';
    return 'bg-emerald-500 text-white border-emerald-600';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  BI-RADS® Diagnostic Evaluator & Imaging Risk Stratifier
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ACR BI-RADS 5th Edition
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Triple Diagnostic Concordance
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Evaluates screening & diagnostic mammography, 3D tomosynthesis, targeted ultrasound, and clinical exam findings to predict standardized BI-RADS categories (0 through 5), tissue biopsy urgency, and differential diagnoses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {evaluation && (
              <button
                onClick={() => setShowDossierModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Export Radiology Dossier</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            <span>Load Real-World Clinical Imaging Cases:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {PRESET_CASES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-rose-50/50 hover:border-rose-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${preset.tagColor}`}>
                    {preset.category}
                  </span>
                  <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-rose-600 transition-colors" />
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

      {/* Main Grid: Form Inputs & Diagnostic Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Clinical Findings Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            {/* Input Navigation Tabs */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-rose-600" />
                <span>Clinical & Imaging Findings</span>
              </h3>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('imaging')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'imaging' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Imaging
                </button>
                <button
                  onClick={() => setActiveTab('clinical')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'clinical' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Exam & Signs
                </button>
                <button
                  onClick={() => setActiveTab('risk')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'risk' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Patient Profile
                </button>
              </div>
            </div>

            {/* TAB 1: Imaging & Morphometry */}
            {activeTab === 'imaging' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Imaging Modality
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="3D Digital Tomosynthesis (DBT)">3D Digital Breast Tomosynthesis (DBT)</option>
                    <option value="Digital Screening Mammogram">2D Full-Field Digital Mammography (FFDM)</option>
                    <option value="Targeted High-Resolution Ultrasound">Targeted High-Resolution Diagnostic Sonography</option>
                    <option value="Contrast-Enhanced Breast MRI">Dynamic Contrast-Enhanced Breast MRI (DCE-MRI)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-slate-800">
                      ACR Breast Tissue Density
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {breastDensity === 'A' && 'Almost entirely fatty (<25% dense)'}
                      {breastDensity === 'B' && 'Scattered fibroglandular densities (25-50%)'}
                      {breastDensity === 'C' && 'Heterogeneously dense (51-75% - may obscure)'}
                      {breastDensity === 'D' && 'Extremely dense (>75% - lowers sensitivity)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: 'A', label: 'Type A (Fatty)' },
                      { val: 'B', label: 'Type B (Scattered)' },
                      { val: 'C', label: 'Type C (Dense)' },
                      { val: 'D', label: 'Type D (Extr. Dense)' },
                    ].map((d) => (
                      <button
                        key={d.val}
                        type="button"
                        onClick={() => setBreastDensity(d.val)}
                        className={`py-2 px-2 rounded-xl text-center font-bold border transition-all ${
                          breastDensity === d.val
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1.5">
                      Mass Shape
                    </label>
                    <select
                      value={massShape}
                      onChange={(e) => setMassShape(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    >
                      <option value="none">None (No mass identified)</option>
                      <option value="oval">Oval (Benign favored)</option>
                      <option value="round">Round (Globular)</option>
                      <option value="irregular">Irregular (High suspicion)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1.5">
                      Mass Margins
                    </label>
                    <select
                      value={massMargin}
                      onChange={(e) => setMassMargin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    >
                      <option value="none">None</option>
                      <option value="circumscribed">Circumscribed (&gt;75% well-defined)</option>
                      <option value="microlobulated">Microlobulated (Scalloped)</option>
                      <option value="indistinct">Indistinct / Ill-defined</option>
                      <option value="spiculated">Spiculated (Radiating starburst)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Microcalcification Morphology
                  </label>
                  <select
                    value={calcifications}
                    onChange={(e) => setCalcifications(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="none">None detected</option>
                    <option value="benign_popcorn">Typically Benign (Coarse popcorn, vascular, rim)</option>
                    <option value="amorphous">Amorphous / Hazy indistinct clusters (BI-RADS 4A)</option>
                    <option value="coarse_heterogeneous">Coarse Heterogeneous (Irregular &gt;0.5mm, BI-RADS 4B)</option>
                    <option value="fine_pleomorphic">Fine Pleomorphic (Irregular varied sizes &lt;0.5mm, BI-RADS 4C)</option>
                    <option value="fine_linear_branching">Fine Linear Branching (Casting along ducts, BI-RADS 5)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Architectural Distortion</span>
                    <span className="text-slate-500 text-[11px]">
                      Parenchymal focal retraction without a distinct central mass
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={architecturalDistortion}
                      onChange={(e) => setArchitecturalDistortion(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: Clinical Physical Exam & Signs */}
            {activeTab === 'clinical' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Palpable Breast Mass
                  </label>
                  <select
                    value={palpableLump}
                    onChange={(e) => setPalpableLump(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="none">Non-palpable (Screening detection only)</option>
                    <option value="mobile_soft">Mobile, smooth, non-tender (Fibroadenoma / cyst suspected)</option>
                    <option value="firm_fixed">Hard, fixed / tethered, painless nodule (Malignancy warning sign)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Nipple Discharge
                  </label>
                  <select
                    value={nippleDischarge}
                    onChange={(e) => setNippleDischarge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="none">None</option>
                    <option value="clear">Clear or physiological bilateral upon expression</option>
                    <option value="bloody">Spontaneous unilateral bloody or serosanguinous (Ductal neoplasm)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Skin / Nipple Retraction & Features
                  </label>
                  <select
                    value={skinChanges}
                    onChange={(e) => setSkinChanges(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="none">Normal skin contour</option>
                    <option value="dimpling_retraction">Focal skin dimpling or tethering / nipple inversion</option>
                    <option value="erythema_peau_d_orange">Peau d&apos;orange erythema & dermal edema (Inflammatory cancer sign)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Ipsilateral Axillary Lymph Nodes
                  </label>
                  <select
                    value={lymphNodes}
                    onChange={(e) => setLymphNodes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="normal">Normal (Clinically non-palpable / normal sonographic fatty hilum)</option>
                    <option value="enlarged_palpable">Enlarged palpable node / Cortical thickening &gt;3mm</option>
                    <option value="matted_fixed">Matted, hard, fixed axillary nodal conglomerate</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 3: Patient Profile & Risk Factors */}
            {activeTab === 'risk' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-slate-800">
                      Patient Age: <span className="text-rose-600 font-bold">{patientAge} years</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {patientAge < 35 && 'Young patient (Ultrasonography preferred)'}
                      {patientAge >= 35 && patientAge < 50 && 'Perimenopausal range'}
                      {patientAge >= 50 && 'Postmenopausal baseline'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={85}
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Family History / Hereditary Genetic Risk
                  </label>
                  <select
                    value={familyHistory}
                    onChange={(e) => setFamilyHistory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="none">Average Risk (No family history of breast/ovarian cancer)</option>
                    <option value="one_first_degree">Moderate Risk (1 first-degree relative diagnosed &gt;50y)</option>
                    <option value="multiple_or_brca">High Risk (Multiple relatives &lt;50y, male breast cancer, or BRCA1/2+)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Radiology / Clinical Presentation Notes
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Enter additional clinical notes, lesion quadrant (e.g. Right UOQ), or prior mammogram stability..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Evaluate Button */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMassShape('none');
                  setMassMargin('none');
                  setCalcifications('none');
                  setArchitecturalDistortion(false);
                  setPalpableLump('none');
                  setNippleDischarge('none');
                  setSkinChanges('none');
                  setLymphNodes('normal');
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs font-semibold px-2 py-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => runEvaluation()}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin" />
                    <span>Evaluating BI-RADS Concordance...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Re-evaluate Clinical Presentation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: BI-RADS Diagnostic Output Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {evaluation ? (
            <div className="space-y-4">
              {/* Main BI-RADS Category Banner */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                      Computed ACR Diagnostic Classification
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-4 py-1.5 rounded-xl text-xl font-black border shadow-xs ${getBiradsBadgeColor(evaluation.biradsCategory)}`}>
                        {evaluation.biradsCategory}
                      </span>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {evaluation.riskClassification}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">
                          Malignancy Probability: <strong className="text-rose-600">{evaluation.malignancyRiskPercent}%</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Biopsy Urgency Pill */}
                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Tissue Biopsy Protocol
                    </span>
                    <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-xl text-xs font-bold border">
                      {evaluation.biopsyRecommended ? (
                        <span className="flex items-center gap-1 text-rose-700 bg-rose-50 border-rose-200 px-2 py-0.5 rounded-lg border">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                          Core Biopsy Indicated
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border-emerald-200 px-2 py-0.5 rounded-lg border">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          No Biopsy Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Risk Probability Meter */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-600">Calculated Likelihood of Malignancy</span>
                    <span className="font-mono text-slate-900 font-bold">{evaluation.malignancyRiskPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        evaluation.malignancyRiskPercent > 50
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                          : evaluation.malignancyRiskPercent > 2
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(2, Math.min(100, evaluation.malignancyRiskPercent))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                    <span>BI-RADS 1/2 (~0%)</span>
                    <span>BI-RADS 3 (&lt;2%)</span>
                    <span>BI-RADS 4A (2-10%)</span>
                    <span>BI-RADS 4B (10-50%)</span>
                    <span>BI-RADS 4C/5 (&gt;50-95%)</span>
                  </div>
                </div>

                {/* Clinical Radiologic Rationale */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <Stethoscope className="h-3.5 w-3.5 text-rose-600" />
                    <span>Radiologic Findings & ACR Criteria:</span>
                  </div>
                  <p className="leading-relaxed">
                    {evaluation.clinicalRationale}
                  </p>
                  {evaluation.biopsyMethod && evaluation.biopsyRecommended && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2 text-rose-700 font-semibold text-[11px]">
                      <Microscope className="h-3.5 w-3.5 shrink-0" />
                      <span>Recommended Modality: {evaluation.biopsyMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Differential Diagnosis Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-rose-600" />
                    <span>Differential Diagnosis Probabilities</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Weighted by ACR Imaging Morphology
                  </span>
                </div>

                <div className="space-y-2.5">
                  {evaluation.differentialDiagnosis?.map((diff, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            diff.category === 'Malignant'
                              ? 'bg-rose-100 text-rose-700'
                              : diff.category === 'Premalignant'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {diff.category}
                          </span>
                          <span className="font-bold text-slate-900">{diff.condition}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-700 text-[11px]">
                          {diff.likelihoodPercent}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {diff.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action Plan Checklist */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span>Clinical Management & Next Steps</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {evaluation.recommendedActionPlan?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                      <ChevronRight className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Case-Linked Medication Suggestions Callout */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Case-Based Pharmacotherapy &amp; Medication Guidance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-900">
                    NCCN Adjuvant Protocols
                  </span>
                </div>
                <p className="text-indigo-900/90 text-[11px] leading-relaxed mb-2.5">
                  {evaluation.malignancyRiskPercent > 10
                    ? 'Patients with suspicious or biopsy-confirmed findings require tailored endocrine blockade (Tamoxifen / Aromatase Inhibitors), anti-HER2 targeted biologics (Trastuzumab + Pertuzumab), or systemic chemotherapy (ddAC-T / TC) based on hormone receptor status.'
                    : 'For benign breast lesions or fibroadenomas, symptomatic relief is provided via NSAIDs (Ibuprofen / Naproxen) or evening primrose oil without cytotoxic or endocrine therapy.'}
                </p>
                <div className="text-[11px] font-semibold text-indigo-700">
                  Tip: Use the <strong>Case Medicines</strong> or <strong>Scan Image AI</strong> tab to view exact dosages, cycles, and clinical trial evidence for this case.
                </div>
              </div>

              {/* Patient Counseling Advice Card */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-800">
                  <Heart className="h-4 w-4 text-emerald-600" />
                  <span>Physician Counseling Guidance for Patient:</span>
                </div>
                <p className="leading-relaxed text-emerald-800/90">
                  {evaluation.patientCounselingAdvice}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Activity className="h-8 w-8 text-rose-500 mx-auto animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">Computing BI-RADS classification...</p>
            </div>
          )}
        </div>
      </div>

      {/* Printable Radiology Dossier Modal */}
      {showDossierModal && evaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl relative">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Clinical Breast Diagnostic Dossier
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  ACR BI-RADS® Diagnostic Consultation Report
                </h3>
                <p className="text-xs text-slate-500">
                  Patient Age: {patientAge} • Date: {new Date().toLocaleDateString()} • Modality: {modality}
                </p>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-[11px] block">Calculated Assessment</span>
                  <span className="text-lg font-black text-slate-900">{evaluation.biradsCategory}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[11px] block">Malignancy Risk</span>
                  <span className="text-lg font-black text-rose-600">{evaluation.malignancyRiskPercent}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Radiologic Impressions:</h4>
                <p className="text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {evaluation.clinicalRationale}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Differential Probabilities:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {evaluation.differentialDiagnosis?.map((d, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-900 block">{d.condition}</span>
                      <span className="text-slate-500 text-[10px]">{d.category} — {d.likelihoodPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Recommended Directives:</h4>
                <ul className="space-y-1">
                  {evaluation.recommendedActionPlan?.map((plan, i) => (
                    <li key={i} className="text-slate-700">• {plan}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Dossier</span>
              </button>
              <button
                onClick={() => setShowDossierModal(false)}
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

// Client-side instant fallback helper
function computeLocalFallback(data: any): BiradsEvaluation {
  const {
    massMargin = 'none',
    calcifications = 'none',
    skinChanges = 'none',
    breastDensity = 'B',
    massShape = 'none',
    architecturalDistortion = false,
    palpableLump = 'none',
    nippleDischarge = 'none'
  } = data;

  if (massMargin === 'spiculated' || calcifications === 'fine_linear_branching' || skinChanges === 'erythema_peau_d_orange') {
    return {
      biradsCategory: 'BI-RADS 5',
      malignancyRiskPercent: 96,
      riskClassification: 'Highly Suggestive of Malignancy (>95% Risk)',
      biopsyRecommended: true,
      biopsyMethod: 'Ultrasound-guided 14G core needle biopsy with radiopaque marker clip',
      clinicalRationale: 'Classic malignant triad with spiculated margins or branching microcalcifications. High suspicion requires urgent histologic tissue diagnosis under ACR standards.',
      differentialDiagnosis: [
        { condition: 'Invasive Ductal Carcinoma (IDC)', likelihoodPercent: 78, category: 'Malignant', description: 'Most prevalent invasive breast carcinoma.' },
        { condition: 'Invasive Lobular Carcinoma (ILC)', likelihoodPercent: 14, category: 'Malignant', description: 'Infiltrating single-file carcinoma with architectural distortion.' },
        { condition: 'High-Grade DCIS', likelihoodPercent: 5, category: 'Premalignant', description: 'Intraductal necrosis with casting calcifications.' },
        { condition: 'Radial Scar / Sclerosing Adenosis', likelihoodPercent: 3, category: 'Benign', description: 'Benign stellate lesion mimicking cancer.' }
      ],
      recommendedActionPlan: [
        'Urgent image-guided core needle tissue biopsy',
        'Axillary nodal ultrasound to evaluate nodal morphometry',
        'Surgical oncology and multidisciplinary tumor board referral'
      ],
      patientCounselingAdvice: 'The scan shows an area that warrants immediate microscopic examination with a core needle biopsy so an exact, personalized treatment plan can be developed.'
    };
  }

  if (calcifications === 'fine_pleomorphic' || (massShape === 'irregular' && massMargin === 'indistinct')) {
    return {
      biradsCategory: 'BI-RADS 4C',
      malignancyRiskPercent: 72,
      riskClassification: 'High Suspicion of Malignancy (50% - 95%)',
      biopsyRecommended: true,
      biopsyMethod: 'Stereotactic or ultrasound core needle biopsy',
      clinicalRationale: 'Non-circumscribed irregular morphology or fine pleomorphic microcalcifications. Malignancy probability ranges between 50% and 95%.',
      differentialDiagnosis: [
        { condition: 'Invasive Breast Carcinoma', likelihoodPercent: 65, category: 'Malignant', description: 'Invasive malignancy with infiltrative margins.' },
        { condition: 'High-Grade DCIS', likelihoodPercent: 20, category: 'Premalignant', description: 'Pre-invasive ductal proliferation.' },
        { condition: 'Atypical Ductal Hyperplasia (ADH)', likelihoodPercent: 10, category: 'Premalignant', description: 'Borderline high-risk proliferative lesion.' },
        { condition: 'Fat Necrosis', likelihoodPercent: 5, category: 'Benign', description: 'Benign reparative changes.' }
      ],
      recommendedActionPlan: [
        'Expedited core needle tissue biopsy',
        'Post-biopsy specimen radiography'
      ],
      patientCounselingAdvice: 'A suspicious area was detected that needs a biopsy to test under the microscope to rule out or catch any early cancer cells.'
    };
  }

  if (calcifications === 'coarse_heterogeneous' || architecturalDistortion || nippleDischarge === 'bloody') {
    return {
      biradsCategory: 'BI-RADS 4B',
      malignancyRiskPercent: 32,
      riskClassification: 'Moderate Suspicion for Malignancy (10% - 50%)',
      biopsyRecommended: true,
      biopsyMethod: 'Targeted ultrasound core biopsy or ductoscopy',
      clinicalRationale: 'Intermediate suspicion features present. While there is a genuine probability of cancer, more than half of these cases prove benign on histology.',
      differentialDiagnosis: [
        { condition: 'Intraductal Papilloma', likelihoodPercent: 42, category: 'Benign', description: 'Benign arborizing growth in duct, common cause of bloody discharge.' },
        { condition: 'Invasive Carcinoma / DCIS', likelihoodPercent: 32, category: 'Malignant', description: 'Malignant transformation.' },
        { condition: 'Radial Scar / Complex Sclerosing Lesion', likelihoodPercent: 16, category: 'Benign', description: 'Benign stellate lesion.' },
        { condition: 'Fibrocystic Changes', likelihoodPercent: 10, category: 'Benign', description: 'Hormonal breast changes.' }
      ],
      recommendedActionPlan: [
        'Image-guided core needle tissue sampling',
        'Histologic-radiologic concordance evaluation'
      ],
      patientCounselingAdvice: 'This finding is moderately suspicious, but remember that more than half of cases turn out to be completely benign conditions like papillomas.'
    };
  }

  if (calcifications === 'amorphous' || massMargin === 'indistinct' || palpableLump === 'firm_fixed') {
    return {
      biradsCategory: 'BI-RADS 4A',
      malignancyRiskPercent: 6,
      riskClassification: 'Low Suspicion for Malignancy (2% - 10%)',
      biopsyRecommended: true,
      biopsyMethod: 'Stereotactic vacuum-assisted or ultrasound biopsy',
      clinicalRationale: 'Mildly suspicious features requiring tissue verification. More than 90% of BI-RADS 4A biopsies are completely benign.',
      differentialDiagnosis: [
        { condition: 'Fibrocystic Changes / Adenosis', likelihoodPercent: 55, category: 'Benign', description: 'Common non-cancerous variations.' },
        { condition: 'Fibroadenoma', likelihoodPercent: 25, category: 'Benign', description: 'Benign fibroepithelial mass.' },
        { condition: 'Atypical Hyperplasia', likelihoodPercent: 14, category: 'Premalignant', description: 'Premalignant high-risk finding.' },
        { condition: 'Early Invasive Carcinoma', likelihoodPercent: 6, category: 'Malignant', description: 'Early-stage neoplasm.' }
      ],
      recommendedActionPlan: [
        'Outpatient core biopsy for definitive exclusion',
        '6-month follow-up if benign and concordant'
      ],
      patientCounselingAdvice: 'Over 90% of biopsies in this category are non-cancerous. We perform a biopsy purely as a precaution to give you full peace of mind.'
    };
  }

  if ((massShape === 'oval' || massShape === 'round') && massMargin === 'circumscribed' && palpableLump === 'none') {
    return {
      biradsCategory: 'BI-RADS 3',
      malignancyRiskPercent: 1.2,
      riskClassification: 'Probably Benign (<2% Malignancy Risk)',
      biopsyRecommended: false,
      biopsyMethod: 'Biopsy not indicated; 6-month imaging surveillance recommended',
      clinicalRationale: 'Circumscribed oval mass meets strict criteria for probably benign finding. Short interval surveillance avoids unnecessary surgical procedures.',
      differentialDiagnosis: [
        { condition: 'Fibroadenoma (Benign)', likelihoodPercent: 75, category: 'Benign', description: 'Well-circumscribed benign tumor.' },
        { condition: 'Complicated Cyst', likelihoodPercent: 18, category: 'Benign', description: 'Fluid-filled cavity.' },
        { condition: 'Intramammary Lymph Node', likelihoodPercent: 5, category: 'Benign', description: 'Benign node with fatty hilum.' },
        { condition: 'Circumscribed Carcinoma', likelihoodPercent: 2, category: 'Malignant', description: 'Rare circumscribed malignant variant.' }
      ],
      recommendedActionPlan: [
        'Follow-up targeted ultrasound in 6 months',
        'Repeat at 12 and 24 months to document long-term radiographic stability'
      ],
      patientCounselingAdvice: 'This finding is more than 98% likely to be benign. We will re-scan in 6 months to ensure it has not changed.'
    };
  }

  if (breastDensity === 'D' && massShape === 'none' && calcifications === 'none') {
    return {
      biradsCategory: 'BI-RADS 0',
      malignancyRiskPercent: 4,
      riskClassification: 'Incomplete Assessment (Dense Breast Masking Effect)',
      biopsyRecommended: false,
      biopsyMethod: 'Supplemental diagnostic imaging required prior to biopsy consideration',
      clinicalRationale: 'Extremely dense breast tissue reduces mammographic sensitivity. Supplemental automated breast ultrasound (ABUS) or screening MRI is indicated.',
      differentialDiagnosis: [
        { condition: 'Normal Dense Fibroglandular Tissue', likelihoodPercent: 82, category: 'Benign', description: 'Normal dense breast tissue.' },
        { condition: 'Masked Non-Calcified Lesion', likelihoodPercent: 12, category: 'Benign', description: 'Benign lesion hidden by density.' },
        { condition: 'Occult Early Neoplasm', likelihoodPercent: 6, category: 'Malignant', description: 'Malignant lesion obscured by tissue.' }
      ],
      recommendedActionPlan: [
        'Supplemental Whole-Breast Ultrasound (ABUS)',
        'Consider breast MRI if lifetime risk exceeds 20%'
      ],
      patientCounselingAdvice: 'Your breast tissue is naturally very dense, so an ultrasound is needed to make sure everything is clearly visualized.'
    };
  }

  return {
    biradsCategory: 'BI-RADS 1',
    malignancyRiskPercent: 0.1,
    riskClassification: 'Negative (Normal Screening Mammogram)',
    biopsyRecommended: false,
    biopsyMethod: 'None',
    clinicalRationale: 'Bilateral symmetric fibroglandular tissue architecture without dominant masses, suspicious microcalcifications, or architectural distortion.',
    differentialDiagnosis: [
      { condition: 'Normal Mammary Parenchyma', likelihoodPercent: 99, category: 'Benign', description: 'Normal physiologic tissue.' },
      { condition: 'Subcentimeter Benign Cyst', likelihoodPercent: 1, category: 'Benign', description: 'Insignificant benign microscopic cyst.' }
    ],
    recommendedActionPlan: [
      'Continue routine age-appropriate screening intervals (every 1-2 years)',
      'Regular self breast-awareness'
    ],
    patientCounselingAdvice: 'Your screening exam is completely normal and healthy. Continue routine annual checkups as recommended for your age.'
  };
}
