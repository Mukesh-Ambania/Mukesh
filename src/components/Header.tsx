import React from 'react';
import {
  Microscope,
  Globe,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  HeartPulse,
  Award,
  Sparkles
} from 'lucide-react';

export type ActiveTabType =
  | 'ai-report-staging'
  | 'patient-benefits'
  | 'precision-treatment'
  | 'global-epidemiology'
  | 'wisconsin-biopsy';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Clinical & Model Specification Ribbon */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Medical Diagnosis AI:</span>
            <span className="text-slate-300">
              AI Patient Report Stager • Clinical AJCC 8th Edition • Personalized Treatment Pathways
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">97.4% Diagnostic Accuracy</span>
            <span>•</span>
            <span className="text-indigo-300 font-medium">Stage 0 to IV Staging</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">99.4% Early Survival</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between py-3 gap-3">
          {/* Logo & Proper Project Name */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-rose-600/20 shrink-0">
              <Microscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Medical Diagnosis
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <CheckCircle2 className="h-3 w-3 text-rose-600" />
                  Clinical Oncology & AI Staging Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AI Patient Report Staging • Benefits & Care Pathways • Global Surveillance
              </p>
            </div>
          </div>

          {/* User-Friendly Streamlined Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('ai-report-staging')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'ai-report-staging'
                    ? 'bg-rose-600 text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Sparkles className={`h-4 w-4 ${activeTab === 'ai-report-staging' ? 'text-white' : 'text-rose-600'}`} />
                <span>AI Report Staging</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'ai-report-staging' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'}`}>
                  Stage 0–IV
                </span>
              </button>

              <button
                onClick={() => setActiveTab('patient-benefits')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'patient-benefits'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <HeartPulse className="h-4 w-4 text-emerald-600" />
                <span>Patient Benefits & Impact</span>
              </button>

              <button
                onClick={() => setActiveTab('precision-treatment')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'precision-treatment'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Stethoscope className="h-4 w-4 text-indigo-600" />
                <span>Treatment & Staging Guide</span>
              </button>

              <button
                onClick={() => setActiveTab('global-epidemiology')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'global-epidemiology'
                    ? 'bg-white text-rose-700 shadow-xs font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Globe className="h-4 w-4 text-rose-600" />
                <span>Global Surveillance</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
