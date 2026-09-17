import React from 'react';
import { Users, AlertTriangle, DollarSign, Target, TrendingUp } from 'lucide-react';
import { datasetSummary, notebookModelMetrics } from '../data/healthcareData';

export const OverviewStats: React.FC = () => {
  const cancerCases = datasetSummary.conditions['Cancer'] || 9227;
  const cancerRate = ((cancerCases / datasetSummary.totalRecords) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Inpatient Cohort
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {datasetSummary.totalRecords.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              55,500 encounters analyzed
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Confirmed Cancer Volume
            </p>
            <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">
              {cancerCases.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="font-bold text-rose-700">{cancerRate}%</span> population prevalence
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Mean Inpatient Charges
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight font-mono">
              ${datasetSummary.avgBilling.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Across 5 major insurance carriers
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              KNN Validation Metric
            </p>
            <p className="text-2xl font-black text-indigo-600 mt-1 tracking-tight">
              {notebookModelMetrics.accuracy}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Holdout test accuracy (K=5)
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Target className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
