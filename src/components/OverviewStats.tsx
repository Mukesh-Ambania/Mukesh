import React from 'react';
import { Target, Sparkles, HeartPulse } from 'lucide-react';
import { wisconsinModelMetrics } from '../data/wisconsinBreastCancerData';

export const OverviewStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {/* Metric 1: Benchmark Accuracy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Diagnostic Model Accuracy
            </p>
            <p className="text-2xl font-black text-indigo-600 mt-1 tracking-tight font-mono">
              {wisconsinModelMetrics.testAccuracy}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Nuclear Morphometry Classifier
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Target className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Metric 2: AI Report Staging Identification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-rose-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              AI Patient Report Staging
            </p>
            <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight font-mono">
              Stage 0 – IV
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              AJCC TNM & Biomarker Detection
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Metric 3: Early Interception Survival */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Early Detection Survival
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight font-mono">
              99.4%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Stage I Relative 5-Year Survival
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <HeartPulse className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
