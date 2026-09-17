import React from 'react';
import { PredictionInput, PredictionResult, Patient } from '../types';
import { Printer, Download, X, HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck, Stethoscope } from 'lucide-react';

interface ClinicalReportModalProps {
  patientInfo?: Patient | null;
  input: PredictionInput;
  result: PredictionResult;
  onClose: () => void;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  patientInfo,
  input,
  result,
  onClose
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4">
        {/* Top Control Bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <HeartPulse className="h-4 w-4 text-rose-500" />
            Clinical Oncology Decision Dossier
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 space-y-6 text-slate-800 text-xs">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
                  +
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  METROPOLITAN ONCOLOGY CLINICAL REPORT
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Clinical Decision Support System • Powered by KNN Classifier (K=5, Scikit-Learn Pipeline)
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono">
              <p>Report Date: <strong className="text-slate-900">{currentDate}</strong></p>
              <p>Document ID: CDSS-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p>Status: <span className="text-emerald-700 font-semibold uppercase">Verified Engine</span></p>
            </div>
          </div>

          {/* Patient Demographic Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Patient Identification & Encounter Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px]">Patient Name:</span>
                <span className="font-bold text-slate-900">{patientInfo?.name || 'Assessed Inpatient Candidate'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Age / Biological Sex:</span>
                <span className="font-semibold text-slate-800">{input.age} yrs • {input.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Blood Type:</span>
                <span className="font-semibold text-slate-800">{input.bloodType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Admission Acuity:</span>
                <span className="font-semibold text-slate-800">{input.admissionType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Attending Physician:</span>
                <span className="font-semibold text-slate-800">{patientInfo?.doctor ? `Dr. ${patientInfo.doctor}` : 'Staff Oncologist'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Facility:</span>
                <span className="font-semibold text-slate-800">{patientInfo?.hospital || 'Regional Medical Center'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Insurance Provider:</span>
                <span className="font-semibold text-slate-800">{input.insurance}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Inpatient Charges:</span>
                <span className="font-mono font-bold text-slate-900">${input.billing.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Risk Evaluation Findings */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Classification Finding</span>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  {result.isCancerPredicted ? (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> HIGH-PRIORITY ONCOLOGY ASSESSMENT FLAG
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> STANDARD SURVEILLANCE PROFILE (NON-CANCER)
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Risk Index</span>
                  <span className="text-2xl font-black text-rose-600">{result.riskScore}%</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs uppercase border border-slate-200">
                  {result.riskLevel} Tier
                </div>
              </div>
            </div>

            {/* Sub Indices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block">Lab Biomarker Index:</span>
                <span className="font-bold text-slate-800">{result.biomarkerScores.diagnostic}/100</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block">Demographic Factor:</span>
                <span className="font-bold text-slate-800">{result.biomarkerScores.demographic}/100</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block">Admission Acuity Factor:</span>
                <span className="font-bold text-slate-800">{result.biomarkerScores.admissionAcuity}/100</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 block">KNN Matched Cancer Density:</span>
                <span className="font-bold text-slate-800">{result.biomarkerScores.neighborCancerDensity}%</span>
              </div>
            </div>
          </div>

          {/* Primary Clinical Factors */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Contributing Risk Factors (Algorithmic Diagnostics)
            </h2>
            <ul className="space-y-1.5 text-slate-700">
              {result.riskFactors.map((rf, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{rf}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Protocols */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Clinical Action Recommendations
            </h2>
            <div className="space-y-1.5">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Historical Patient Matches */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Top 5 Nearest Clinical Encounters (K=5 KNN Model Memory)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-1.5">Neighbor ID</th>
                    <th className="p-1.5">Age/Sex</th>
                    <th className="p-1.5">Primary Condition</th>
                    <th className="p-1.5">Test Result</th>
                    <th className="p-1.5">Admission</th>
                    <th className="p-1.5 text-right">Similarity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.topNeighbors.map((n, idx) => (
                    <tr key={idx} className={n.patient.isCancer ? 'bg-rose-50/50' : ''}>
                      <td className="p-1.5 font-mono">{n.patient.id}</td>
                      <td className="p-1.5">{n.patient.age} / {n.patient.gender}</td>
                      <td className="p-1.5 font-semibold">
                        <span className={n.patient.isCancer ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                          {n.patient.condition}
                        </span>
                      </td>
                      <td className="p-1.5">{n.patient.testResult}</td>
                      <td className="p-1.5">{n.patient.admissionType}</td>
                      <td className="p-1.5 text-right font-mono font-bold text-slate-900">{n.similarityPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Physician Sign-Off Block */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <p className="text-slate-500 mb-6">Algorithm Model Governance:</p>
              <p className="font-semibold text-slate-900">Scikit-Learn KNN Classifier Engine v2.4</p>
              <p className="text-slate-500">Validation Accuracy: 81.26% on stratified holdout</p>
            </div>
            <div>
              <p className="text-slate-500 mb-6">Attending Physician Verification / Signature:</p>
              <div className="border-b border-slate-400 w-48 mb-1"></div>
              <p className="text-slate-400 text-[10px]">Authorized Clinical Pathologist / Oncologist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
