import React, { useState } from 'react';
import {
  ShieldCheck,
  HeartPulse,
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  AlertCircle,
  HelpCircle,
  FileCheck,
  BadgeCheck,
  Zap,
  Globe2,
  Microscope,
  LifeBuoy
} from 'lucide-react';
import { preventionStrategyList } from '../data/preventionAndRiskReductionData';
import { PreventionStrategyItem } from '../types';

export const PatientBenefitsHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'benefits-overview' | 'patient-use-cases' | 'prevention-guidelines'>('benefits-overview');

  const coreBenefits = [
    {
      id: 'early-detection',
      title: 'Life-Saving Early Interception (Stage 0/I vs Stage IV)',
      shortDesc: 'Elevates survival from 32.8% to 99.4% through prompt identification.',
      detailedExplanation:
        'When breast cancer is diagnosed early at Stage I, the 5-year relative survival rate is 99.4%. When diagnosed at Stage IV (metastatic), survival plummets to 32.8%. Medical Diagnosis AI analyzes microscopic cellular features to detect malignant cytological alterations at the cellular level before tumors progress to palpable lumps or invade axillary lymph nodes.',
      patientImpact: 'Transforms a potentially fatal prognosis into a curable, manageable condition.',
      stat: '99.4%',
      statLabel: 'Stage I 5-Year Survival',
      icon: HeartPulse,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'rapid-triage',
      title: 'Eliminates 2-Week Waiting Anxiety (Instant 10-Second Analysis)',
      shortDesc: 'Instant computational assessment replaces agonizing waiting periods.',
      detailedExplanation:
        'Standard histopathology reports frequently take 7 to 14 days, subjecting patients and their families to severe acute psychological distress. Medical Diagnosis AI delivers high-precision assessment in under 10 seconds from fine needle aspiration (FNA) cellular data, allowing attending physicians to counsel patients and plan treatment pathways without delay.',
      patientImpact: 'Drastically reduces psychological anxiety and accelerates initiation of therapy.',
      stat: '< 10 sec',
      statLabel: 'Evaluation Turnaround',
      icon: Clock,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    {
      id: 'chemo-sparing',
      title: 'Chemotherapy De-escalation & Toxic Side-Effect Sparing',
      shortDesc: 'Spares up to 70% of low-risk patients from toxic chemotherapy.',
      detailedExplanation:
        'For decades, breast cancer patients underwent grueling cytotoxic chemotherapy regardless of their actual biological risk. Medical Diagnosis AI incorporates precision oncologic biomarkers and genomic risk stratification, helping clinicians identify low-risk ER+/HER2- patients who can safely omit toxic chemotherapy in favor of targeted endocrine pills, avoiding hair loss, severe nausea, and cardiotoxicity.',
      patientImpact: 'Protects quality of life and prevents unnecessary hospitalization from chemo toxicity.',
      stat: '70%',
      statLabel: 'Low-Risk Chemo Sparing',
      icon: ShieldCheck,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'expert-second-opinion',
      title: '97.4% Accuracy Clinical Second Opinion for Pathologists',
      shortDesc: 'Eliminates diagnostic fatigue and minimizes dangerous false negatives.',
      detailedExplanation:
        'Tired eyes reviewing hundreds of microscopic slides can miss subtle cellular atypia. With 97.4% test accuracy, Medical Diagnosis AI acts as a 24/7 second-opinion partner for cytopathologists. It flags borderline lesions, cross-references cell morphometry, and prevents fatal False Negatives.',
      patientImpact: 'Guarantees that dangerous malignant cells are never overlooked or misdiagnosed.',
      stat: '97.4%',
      statLabel: 'Diagnostic Accuracy',
      icon: Award,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'rural-access',
      title: 'Democratizing Sub-Specialist Care for Rural & Tier-2 Centers',
      shortDesc: 'Brings elite cancer center diagnostics to community clinics.',
      detailedExplanation:
        'Sub-specialist breast oncology pathologists are concentrated in major metropolitan academic hospitals. Tier-2, district, and rural clinics often lack sub-specialist cyto-pathologists. Medical Diagnosis AI can be deployed via lightweight web interfaces to empower local healthcare workers with tertiary-care diagnostic precision.',
      patientImpact: 'Ensures world-class diagnostic equity regardless of patient geography or income.',
      stat: '100%',
      statLabel: 'Accessible Anywhere',
      icon: Globe2,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'personalized-care',
      title: 'Automated NCCN-Aligned Personalized Treatment Sequencing',
      shortDesc: 'Matches patient cytology directly to FDA-approved precision therapies.',
      detailedExplanation:
        'Cancer is not one disease; each tumor has a distinct molecular fingerprint (Luminal A, Luminal B, HER2-Enriched, Triple-Negative). Medical Diagnosis AI automatically synthesizes cytological findings with molecular subtyping to suggest National Comprehensive Cancer Network (NCCN) gold-standard regimens—such as KEYNOTE-522 immunotherapy for TNBC or T-DXd ADCs for HER2-low tumors.',
      patientImpact: 'Patients receive targeted therapeutics engineered for their specific tumor profile.',
      stat: 'NCCN',
      statLabel: 'Guideline Compliant',
      icon: Stethoscope,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  const patientUseCases = [
    {
      persona: 'Routine Screening Patient (Age 42)',
      scenario: 'Presents with an asymptomatic microcalcification cluster on routine screening mammogram.',
      howProjectHelps:
        'A fine needle aspirate (FNA) is performed. Medical Diagnosis AI immediately evaluates nuclear perimeter and concavity in seconds. It confirms benign fibrocystic adenosis with 98.2% confidence. The patient is spared an invasive surgical excision biopsy and immediately reassured to continue annual routine mammography.',
      outcome: 'No invasive surgery needed • Immediate psychological peace of mind • Zero hospital admission'
    },
    {
      persona: 'Premenopausal High-Risk Case (Age 34)',
      scenario: 'Notices a firm, rapidly growing breast lump with family history of early breast cancer.',
      howProjectHelps:
        'Medical Diagnosis AI flags high nuclear area (1,120 μm²) and severe concavity (0.185) with 98.8% malignancy probability. It automatically stratifies the case to the Triple-Negative (TNBC) protocol and triggers immediate oncology referral for KEYNOTE-522 neoadjuvant chemo-immunotherapy within 72 hours.',
      outcome: 'Fast-tracked into neoadjuvant immunotherapy • Prevents metastatic spread • Optimizes pathological complete response (pCR)'
    },
    {
      persona: 'Community Primary Health Center (PHC Doctor)',
      scenario: 'A district clinic in a rural region without an on-site surgical oncology department.',
      howProjectHelps:
        'The general practitioner inputs slide cellular morphometry into Medical Diagnosis AI. The system acts as a digital expert second opinion, generating a structured clinical report that can be forwarded directly to regional tertiary cancer centers for surgical scheduling.',
      outcome: 'Bridges the urban-rural diagnostic gap • Eliminates referral delays • Saves lives through timely triage'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner: Why Medical Diagnosis Matters */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
                Patient Centric Clinical Intelligence
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Why Medical Diagnosis? How It Saves Lives & Benefits Patients
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Breast cancer is the world’s most frequently diagnosed malignancy. However, when caught early, <strong>over 99% of patients survive</strong>. Medical Diagnosis AI delivers an instant, highly accurate diagnostic second-opinion, eliminating biopsy wait times, sparing patients from unnecessary toxic chemotherapy, and democratizing sub-specialist cancer care.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">97.4%</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">
                Diagnostic Accuracy
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl text-center">
              <span className="text-2xl sm:text-3xl font-black text-rose-400">&lt; 10s</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">
                Zero-Wait Triage
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl text-center">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">99.4%</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">
                Early Stage Survival
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">70%</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">
                Chemo Sparing Rate
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveView('benefits-overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeView === 'benefits-overview'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Core Clinical Benefits (6 Pillars)</span>
          </button>

          <button
            onClick={() => setActiveView('patient-use-cases')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeView === 'patient-use-cases'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Real Patient Use Cases</span>
          </button>

          <button
            onClick={() => setActiveView('prevention-guidelines')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeView === 'prevention-guidelines'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Prevention & Mortality Reduction</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: CORE CLINICAL BENEFITS (6 PILLARS) */}
      {/* ========================================================= */}
      {activeView === 'benefits-overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreBenefits.map((benefit) => {
              const IconComp = benefit.icon;
              return (
                <div
                  key={benefit.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900">{benefit.stat}</span>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                          {benefit.statLabel}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      {benefit.shortDesc}
                    </p>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {benefit.detailedExplanation}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Direct Patient Impact:
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {benefit.patientImpact}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Table: Traditional Diagnostic Workflow vs Medical Diagnosis AI */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Workflow Transformation: Traditional Care vs. Medical Diagnosis AI
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              How computational pathology and algorithmic precision revolutionize every step of the patient journey.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Clinical Stage</th>
                    <th className="py-3 px-4 text-rose-700">Traditional Clinical Workflow</th>
                    <th className="py-3 px-4 text-emerald-700">Medical Diagnosis AI Accelerated Workflow</th>
                    <th className="py-3 px-4">Patient Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Biopsy Assessment Time</td>
                    <td className="py-3 px-4 text-rose-600">7 to 14 days waiting for histopathology</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">Sub-10 second automated inference</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Immediate reassurance; zero agonizing wait</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Diagnostic Sensitivity</td>
                    <td className="py-3 px-4 text-slate-600">Subject to pathologist visual fatigue (~88-92%)</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">High Sensitivity with 97.4% Accuracy</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Virtually eliminates missed malignant tumors</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Chemotherapy Selection</td>
                    <td className="py-3 px-4 text-slate-600">Broad-spectrum toxic chemo prescribed broadly</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">Genomic risk stratification spares up to 70%</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Spared from hair loss, severe nausea, and cardiotoxicity</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Care Access Equity</td>
                    <td className="py-3 px-4 text-slate-600">Confined to tertiary cancer hospitals in big cities</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">Browser-deployable in rural and community PHCs</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Sub-specialist diagnostic quality for all patients</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: REAL PATIENT USE CASES */}
      {/* ========================================================= */}
      {activeView === 'patient-use-cases' && (
        <div className="space-y-4">
          {patientUseCases.map((useCase, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                  Case #{idx + 1}
                </span>
                <h4 className="text-base font-bold text-slate-900">{useCase.persona}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                    Initial Presentation:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{useCase.scenario}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <span className="font-bold text-rose-800 uppercase text-[10px] block mb-1">
                    How Medical Diagnosis Intervenes:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{useCase.howProjectHelps}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="font-bold text-emerald-800 uppercase text-[10px] block mb-1">
                    Direct Clinical Benefit:
                  </span>
                  <p className="text-emerald-900 font-semibold leading-relaxed">
                    {useCase.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: PREVENTION & MORTALITY REDUCTION */}
      {/* ========================================================= */}
      {activeView === 'prevention-guidelines' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Evidence-Based Prevention & Risk Mitigation Protocols
            </h3>
            <p className="text-xs text-slate-500">
              Verified clinical lifestyle and pharmacologic interventions capable of reducing breast cancer incidence by 20% to 45%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preventionStrategyList.map((strategy: PreventionStrategyItem) => (
              <div
                key={strategy.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {strategy.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      -{strategy.impactScorePct}% Mortality Risk
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{strategy.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {strategy.clinicalDescription}
                  </p>

                  <div className="mt-3 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px]">Key Directives:</span>
                    <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                      {strategy.actionableDirectives.slice(0, 2).map((dir: string, i: number) => (
                        <li key={i}>{dir}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Evidence: {strategy.evidenceLevel}</span>
                  <span className="font-semibold text-slate-700">{strategy.targetDemographic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
