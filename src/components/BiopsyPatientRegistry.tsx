import React, { useState, useMemo } from 'react';
import { wisconsinBenchmarkBiopsies } from '../data/wisconsinBreastCancerData';
import { WisconsinFnaSample } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Dna,
  ArrowUpDown
} from 'lucide-react';

interface BiopsyPatientRegistryProps {
  onSelectBiopsy?: (sample: WisconsinFnaSample) => void;
}

export const BiopsyPatientRegistry: React.FC<BiopsyPatientRegistryProps> = ({ onSelectBiopsy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<'All' | 'M' | 'B'>('All');
  const [sortField, setSortField] = useState<keyof WisconsinFnaSample>('radius_mean');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredBiopsies = useMemo(() => {
    return wisconsinBenchmarkBiopsies
      .filter((b) => {
        const matchesSearch =
          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.patientId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDiag =
          selectedDiagnosis === 'All' || b.diagnosis === selectedDiagnosis;
        return matchesSearch && matchesDiag;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [searchTerm, selectedDiagnosis, sortField, sortAsc]);

  const handleSort = (field: keyof WisconsinFnaSample) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      'Biopsy ID',
      'Patient Code',
      'Diagnosis',
      'Radius Mean',
      'Texture Mean',
      'Perimeter Mean',
      'Area Mean',
      'Concavity Mean',
      'Concave Points',
      'PC1',
      'PC2'
    ];
    const rows = filteredBiopsies.map((b) => [
      b.id,
      b.patientId,
      b.diagnosis === 'M' ? 'Malignant' : 'Benign',
      b.radius_mean.toString(),
      b.texture_mean.toString(),
      b.perimeter_mean.toString(),
      b.area_mean.toString(),
      b.concavity_mean.toString(),
      b.concave_points_mean.toString(),
      b.pc1.toString(),
      b.pc2.toString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'wisconsin_biopsy_registry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
              Biopsy Registry
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">UCI WDBC Reference Cohort</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2 tracking-tight">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            Wisconsin Fine Needle Aspirate (FNA) Biopsy Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pathological database of digitized breast cell nuclei measurements with confirmed diagnoses
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Biopsy Cohort (.csv)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search specimen code or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">Diagnosis:</span>
          <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
            {(['All', 'M', 'B'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiagnosis(d)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  selectedDiagnosis === d
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === 'All' ? 'All (40)' : d === 'M' ? 'Malignant (20)' : 'Benign (20)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Specimen ID</th>
              <th className="py-3 px-3">Diagnosis</th>
              <th
                onClick={() => handleSort('radius_mean')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  Radius Mean <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('texture_mean')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  Texture <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('perimeter_mean')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  Perimeter <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('area_mean')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  Area Mean <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('concavity_mean')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  Concavity <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3">PCA (PC1, PC2)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBiopsies.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onSelectBiopsy && onSelectBiopsy(b)}
              >
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {b.id}
                  <span className="text-[10px] text-slate-400 block font-sans font-normal">
                    {b.patientId}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.diagnosis === 'M'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {b.diagnosis === 'M' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {b.diagnosis === 'M' ? 'Malignant' : 'Benign'}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-medium text-slate-900">
                  {b.radius_mean} μm
                </td>
                <td className="py-3 px-3 font-mono text-slate-700">{b.texture_mean}</td>
                <td className="py-3 px-3 font-mono text-slate-700">{b.perimeter_mean} μm</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.area_mean} μm²</td>
                <td className="py-3 px-3 font-mono text-slate-700">{b.concavity_mean}</td>
                <td className="py-3 px-3 font-mono text-xs text-indigo-700">
                  ({b.pc1}, {b.pc2})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-right text-[11px] text-slate-400">
        Showing {filteredBiopsies.length} biopsy records • Sourced from Wisconsin Diagnostic Breast Cancer (WDBC) Database
      </p>
    </div>
  );
};
