import React, { useState } from 'react';
import { Patient, PredictionResult } from '../types';
import { predictCancerRisk } from '../utils/predictionEngine';
import { ClinicalReportModal } from './ClinicalReportModal';
import {
  X,
  Calendar,
  DollarSign,
  Heart,
  Stethoscope,
  Building,
  Pill,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const [showFullDossier, setShowFullDossier] = useState(false);

  if (!patient) return null;

  // Run real-time cancer risk prediction on this patient's profile
  const riskResult: PredictionResult = predictCancerRisk({
    age: patient.age,
    gender: patient.gender,
    bloodType: patient.bloodType,
    insurance: patient.insurance,
    billing: patient.billing,
    admissionType: patient.admissionType,
    medication: patient.medication,
    testResult: patient.testResult
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">{patient.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {patient.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {patient.gender} • {patient.age} yrs • Blood Type {patient.bloodType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullDossier(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Full Dossier</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
            {/* Real-time Risk Prediction Banner */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                riskResult.isCancerPredicted
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    riskResult.isCancerPredicted
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {riskResult.isCancerPredicted ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Diagnostic AI Risk Score: <strong className="text-base">{riskResult.riskScore}%</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/80 border border-current">
                      {riskResult.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Ground Truth Pathology: <strong className="underline">{patient.condition}</strong> • {riskResult.nearestNeighborsSummary.cancerMatches}/5 Benchmark Biopsy Matches Confirmed Cancer
                  </p>
                </div>
              </div>

              <span
                className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border shadow-2xs ${
                  patient.isCancer
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-800 text-white border-slate-800'
                }`}
              >
                {patient.isCancer ? 'Cancer Patient' : 'Non-Cancer Patient'}
              </span>
            </div>

            {/* Biomarker Sub-Indices Bar Trackers */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block mb-1">
                Biomarker Sub-Score Breakdown (0 - 100)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Diagnostic Lab Result ({patient.testResult})</span>
                    <span className="font-mono font-bold text-slate-900">{riskResult.biomarkerScores.diagnostic}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        riskResult.biomarkerScores.diagnostic > 60 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${riskResult.biomarkerScores.diagnostic}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Age / Demographic Risk ({patient.age}y)</span>
                    <span className="font-mono font-bold text-slate-900">{riskResult.biomarkerScores.demographic}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${riskResult.biomarkerScores.demographic}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Admission Acuity ({patient.admissionType})</span>
                    <span className="font-mono font-bold text-slate-900">{riskResult.biomarkerScores.admissionAcuity}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${riskResult.biomarkerScores.admissionAcuity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Neighbor Cancer Density</span>
                    <span className="font-mono font-bold text-slate-900">{riskResult.biomarkerScores.neighborCancerDensity}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${riskResult.biomarkerScores.neighborCancerDensity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500" /> Medical Condition
                </span>
                <span className="font-bold text-slate-900 text-sm">{patient.condition}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Activity className="h-3.5 w-3.5 text-indigo-500" /> Test Results
                </span>
                <span
                  className={`font-bold text-sm ${
                    patient.testResult === 'Abnormal'
                      ? 'text-rose-600'
                      : patient.testResult === 'Inconclusive'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {patient.testResult}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Pill className="h-3.5 w-3.5 text-purple-500" /> Medication
                </span>
                <span className="font-bold text-slate-900 text-sm">{patient.medication}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" /> Admission Date
                </span>
                <span className="font-bold text-slate-900 text-sm">{patient.dateAdm}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" /> Discharge Date
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {patient.dischargeDate || 'Active Inpatient'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Billed Charges
                </span>
                <span className="font-bold text-slate-900 text-sm font-mono">
                  ${patient.billing.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Hospital & Attending Provider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-slate-400" /> Hospital Facility:
                </span>
                <span className="font-semibold text-slate-900">{patient.hospital}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-slate-400" /> Attending Physician:
                </span>
                <span className="font-semibold text-slate-900">Dr. {patient.doctor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-slate-400" /> Insurance Provider:
                </span>
                <span className="font-semibold text-slate-900">{patient.insurance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  Room Assigned:
                </span>
                <span className="font-semibold text-slate-900">Room #{patient.room}</span>
              </div>
            </div>

            {/* Clinical Protocols */}
            <div>
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block mb-2">
                Recommended Action Protocols
              </span>
              <div className="space-y-1.5">
                {riskResult.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setShowFullDossier(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-500 transition-colors flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Complete Clinical Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close Chart
            </button>
          </div>
        </div>
      </div>

      {showFullDossier && (
        <ClinicalReportModal
          patientInfo={patient}
          input={{
            age: patient.age,
            gender: patient.gender,
            bloodType: patient.bloodType,
            insurance: patient.insurance,
            billing: patient.billing,
            admissionType: patient.admissionType,
            medication: patient.medication,
            testResult: patient.testResult
          }}
          result={riskResult}
          onClose={() => setShowFullDossier(false)}
        />
      )}
    </>
  );
};
