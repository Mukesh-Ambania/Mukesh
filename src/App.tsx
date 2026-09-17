import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { OverviewStats } from './components/OverviewStats';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CancerPredictor } from './components/CancerPredictor';
import { ModelTelemetry } from './components/ModelTelemetry';
import { PatientRegistry } from './components/PatientRegistry';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeartPulse } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'predictor' | 'telemetry' | 'registry'>('analytics');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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
              {activeTab === 'analytics' && <AnalyticsDashboard />}
              {activeTab === 'predictor' && <CancerPredictor />}
              {activeTab === 'telemetry' && <ModelTelemetry />}
              {activeTab === 'registry' && <PatientRegistry />}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-rose-600" />
            <span className="font-semibold text-slate-700">
              Healthcare Cancer Prediction & Analytics
            </span>
            <span>• Migrated from Mukesh-Ambania/Mukesh repository</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>KNN (K=5) Classifier</span>
            <span>•</span>
            <span>Power BI Enterprise Model</span>
            <span>•</span>
            <span>55,500 Inpatient Encounters</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
