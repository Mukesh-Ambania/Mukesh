import React, { useState, useMemo } from 'react';
import { datasetSummary } from '../data/healthcareData';
import { Patient } from '../types';
import { PatientDetailModal } from './PatientDetailModal';
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Heart,
  AlertTriangle,
  Building,
  User,
  ArrowUpDown,
  Download,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export const PatientRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedResult, setSelectedResult] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState('All');
  const [quickFilter, setQuickFilter] = useState<'all' | 'cancer' | 'abnormal' | 'emergency' | 'high_expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'billing_desc' | 'age_desc' | 'name'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const pageSize = 12;

  // Filter patients
  const filteredPatients = useMemo(() => {
    let list = datasetSummary.samplePatients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCondition =
        selectedCondition === 'All' || p.condition === selectedCondition;

      const matchesResult =
        selectedResult === 'All' || p.testResult === selectedResult;

      const matchesAdmission =
        selectedAdmission === 'All' || p.admissionType === selectedAdmission;

      // Quick filter presets
      let matchesQuick = true;
      if (quickFilter === 'cancer') matchesQuick = p.isCancer;
      if (quickFilter === 'abnormal') matchesQuick = p.testResult === 'Abnormal';
      if (quickFilter === 'emergency') matchesQuick = p.admissionType === 'Emergency';
      if (quickFilter === 'high_expense') matchesQuick = p.billing > 35000;

      return matchesSearch && matchesCondition && matchesResult && matchesAdmission && matchesQuick;
    });

    // Sorting
    if (sortBy === 'billing_desc') {
      list = [...list].sort((a, b) => b.billing - a.billing);
    } else if (sortBy === 'age_desc') {
      list = [...list].sort((a, b) => b.age - a.age);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [searchTerm, selectedCondition, selectedResult, selectedAdmission, quickFilter, sortBy]);

  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportPatientCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Gender', 'Blood Type', 'Condition', 'Test Result', 'Admission', 'Doctor', 'Hospital', 'Insurance', 'Billing'];
    const rows = filteredPatients.map((p) => [
      p.id,
      `"${p.name}"`,
      p.age,
      p.gender,
      p.bloodType,
      `"${p.condition}"`,
      p.testResult,
      p.admissionType,
      `"${p.doctor}"`,
      `"${p.hospital}"`,
      `"${p.insurance}"`,
      p.billing
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'filtered_patients_registry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Hospital Encounters
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Inpatient EMR Master Index</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
              <User className="h-5 w-5 text-blue-600" />
              Patient Encounter Registry & Clinical Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect patient demographics, medical conditions, billing charges, and launch algorithmic oncology decision charts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportPatientCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Filtered Cohort ({filteredPatients.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider mr-1">
            Quick Cohort:
          </span>
          <button
            onClick={() => { setQuickFilter('all'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              quickFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Sample Records (1,000)
          </button>
          <button
            onClick={() => { setQuickFilter('cancer'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              quickFilter === 'cancer' ? 'bg-rose-600 text-white font-bold' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Cancer Inpatients Only
          </button>
          <button
            onClick={() => { setQuickFilter('abnormal'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              quickFilter === 'abnormal' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Abnormal Test Findings
          </button>
          <button
            onClick={() => { setQuickFilter('emergency'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              quickFilter === 'emergency' ? 'bg-purple-600 text-white font-bold' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            Emergency Admissions
          </button>
          <button
            onClick={() => { setQuickFilter('high_expense'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              quickFilter === 'high_expense' ? 'bg-emerald-700 text-white font-bold' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            High Billed ({'>'}$35k)
          </button>
        </div>

        {/* Detailed Search & Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-4">
          <div className="relative lg:col-span-2">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, hospital, or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="All">All Conditions</option>
              {Object.keys(datasetSummary.conditions).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedResult}
              onChange={(e) => {
                setSelectedResult(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="All">All Diagnostic Tests</option>
              {Object.keys(datasetSummary.testResults).map((r) => (
                <option key={r} value={r}>
                  {r} Tests
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
            >
              <option value="date">Default Order</option>
              <option value="billing_desc">Sort: Highest Billing</option>
              <option value="age_desc">Sort: Oldest Age</option>
              <option value="name">Sort: Patient Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-3">Age / Sex / Blood</th>
                <th className="py-3 px-3">Admitting Condition</th>
                <th className="py-3 px-3">Admission Acuity</th>
                <th className="py-3 px-3">Diagnostic Lab Result</th>
                <th className="py-3 px-3">Doctor / Facility</th>
                <th className="py-3 px-3 text-right">Billed Amount</th>
                <th className="py-3 px-3 text-center">Chart & Assess</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{patient.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{patient.id}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      {patient.age} yrs • {patient.gender}
                      <span className="block text-[11px] text-slate-400 font-mono">
                        Blood: {patient.bloodType}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          patient.isCancer
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {patient.condition}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-semibold">{patient.admissionType}</span>
                      <span className="block text-[11px] text-slate-400">{patient.dateAdm}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          patient.testResult === 'Abnormal'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : patient.testResult === 'Inconclusive'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {patient.testResult}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <div className="font-medium truncate max-w-[140px]">Dr. {patient.doctor}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {patient.hospital}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      ${patient.billing.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 text-[11px] font-bold transition-all shadow-2xs inline-flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect Chart</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">No patient records match the selected filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search term or filter parameters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{filteredPatients.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-slate-900">
              {Math.min(currentPage * pageSize, filteredPatients.length)}
            </strong>{' '}
            of <strong className="text-slate-900">{filteredPatients.length}</strong> matching records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-800 bg-slate-100 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detailed Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};
