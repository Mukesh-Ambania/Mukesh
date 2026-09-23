import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, ActiveTabType } from './components/Header';
import { OverviewStats } from './components/OverviewStats';
import { WisconsinBiopsyPredictor } from './components/WisconsinBiopsyPredictor';
import { AIPatientReportStager } from './components/AIPatientReportStager';
import { BiradsImagingEvaluator } from './components/BiradsImagingEvaluator';
import { MedicalScanUploader } from './components/MedicalScanUploader';
import { CaseBasedMedicationAdvisor } from './components/CaseBasedMedicationAdvisor';
import { PatientBenefitsHub } from './components/PatientBenefitsHub';
import { GlobalEpidemiologyDashboard } from './components/GlobalEpidemiologyDashboard';
import { PrecisionTreatmentEngine } from './components/PrecisionTreatmentEngine';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Microscope } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('ai-report-staging');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Overview Stats Banner */}
        <OverviewStats />

        {/* Tab Views with Error Boundary and Motion Route Fade */}
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'wisconsin-biopsy' && <WisconsinBiopsyPredictor />}
              {activeTab === 'ai-report-staging' && <AIPatientReportStager />}
              {activeTab === 'scan-image-ai' && <MedicalScanUploader setActiveTab={setActiveTab} />}
              {activeTab === 'medication-advisor' && <CaseBasedMedicationAdvisor />}
              {activeTab === 'birads-imaging' && <BiradsImagingEvaluator />}
              {activeTab === 'patient-benefits' && <PatientBenefitsHub />}
              {activeTab === 'global-epidemiology' && <GlobalEpidemiologyDashboard />}
              {activeTab === 'precision-treatment' && <PrecisionTreatmentEngine />}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Microscope className="h-4 w-4 text-rose-600" />
            <span className="font-semibold text-slate-700">
              Breast Cancer Diagnosis — Clinical AI Staging, Medical Scan Vision & Diagnostics
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span className="text-emerald-600 font-bold">97.4% Diagnostic Accuracy</span>
            <span>•</span>
            <span>StandardScaler Pipeline</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">AJCC 8th Edition Staging</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


export default App;
