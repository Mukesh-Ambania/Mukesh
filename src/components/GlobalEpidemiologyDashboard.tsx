import React, { useState, useMemo, useEffect } from 'react';
import {
  globalYearlySummaries,
  countryEpidemiologyDatabase,
  globalYearlyTrends,
  historicalMilestonesList,
  longitudinal50YearRegistry,
  initialLiveTelemetryStream
} from '../data/globalEpidemiologyData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Globe,
  Calendar,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Download,
  Info,
  Clock,
  HeartPulse,
  Award,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  History,
  Activity,
  CheckCircle2,
  Search,
  ChevronRight,
  Microscope,
  Stethoscope,
  Building2,
  RefreshCw
} from 'lucide-react';
import { LiveBiopsyTelemetryEvent } from '../types';

export const GlobalEpidemiologyDashboard: React.FC = () => {
  // Navigation tabs within epidemiology
  const [activeSubTab, setActiveSubTab] = useState<'longitudinal-50yr' | 'historical-origins' | 'live-telemetry' | 'country-trends'>('longitudinal-50yr');

  // Longitudinal state: user can access ANY year (1975 to 2026) and any country
  const [selectedLongitudinalYear, setSelectedLongitudinalYear] = useState<number>(2026);
  const [selectedLongitudinalCountry, setSelectedLongitudinalCountry] = useState<string>('Global');

  // Historical milestones state
  const [selectedEraFilter, setSelectedEraFilter] = useState<string>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');

  // Live Telemetry Stream state
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [telemetryEvents, setTelemetryEvents] = useState<LiveBiopsyTelemetryEvent[]>(initialLiveTelemetryStream);
  const [telemetryFilter, setTelemetryFilter] = useState<'All' | 'Malignant' | 'Benign'>('All');
  const [simulationSpeedMs, setSimulationSpeedMs] = useState<number>(3500);

  // Country 2020-2026 state
  const [selectedCountryYear, setSelectedCountryYear] = useState<number>(2026);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [metricView, setMetricView] = useState<'totalCases' | 'incidence' | 'survival'>('totalCases');

  // ==========================================
  // REAL-TIME SIMULATION STREAM EFFECT
  // ==========================================
  useEffect(() => {
    if (!isLiveStreaming) return;

    const cancerCenters = [
      { name: 'Tata Memorial Hospital, Mumbai', country: 'India 🇮🇳' },
      { name: 'Mayo Clinic, Rochester', country: 'United States 🇺🇸' },
      { name: 'Charité Comprehensive Cancer Center, Berlin', country: 'Germany 🇩🇪' },
      { name: 'Peking University Cancer Hospital, Beijing', country: 'China 🇨🇳' },
      { name: 'Royal Marsden NHS Foundation Trust, London', country: 'United Kingdom 🇬🇧' },
      { name: 'National Cancer Center Hospital, Tokyo', country: 'Japan 🇯🇵' },
      { name: 'Peter MacCallum Cancer Centre, Melbourne', country: 'Australia 🇦🇺' },
      { name: 'Gustave Roussy Institute, Paris', country: 'France 🇫🇷' },
      { name: 'INCA National Cancer Institute, Rio de Janeiro', country: 'Brazil 🇧🇷' }
    ];

    const interval = setInterval(() => {
      const center = cancerCenters[Math.floor(Math.random() * cancerCenters.length)];
      const isMalignant = Math.random() < 0.42;
      const patientAge = Math.floor(Math.random() * 45) + 32;

      const meanArea = isMalignant
        ? Math.round(700 + Math.random() * 850)
        : Math.round(280 + Math.random() * 320);

      const meanConcavity = isMalignant
        ? +(0.08 + Math.random() * 0.22).toFixed(3)
        : +(0.01 + Math.random() * 0.04).toFixed(3);

      const meanTexture = isMalignant
        ? +(20 + Math.random() * 12).toFixed(1)
        : +(13 + Math.random() * 6).toFixed(1);

      const aiConfidencePct = +(94 + Math.random() * 5.8).toFixed(1);

      let subtype: LiveBiopsyTelemetryEvent['molecularSubtypePredicted'] = 'HR+/HER2- (Luminal A)';
      let triage = 'Dense benign adenoma pattern. 12-month routine mammography.';

      if (isMalignant) {
        const subRoll = Math.random();
        if (subRoll < 0.35) {
          subtype = 'Triple-Negative (TNBC)';
          triage = 'KEYNOTE-522 Chemo-Immunotherapy (Pembrolizumab + Carboplatin/Paclitaxel)';
        } else if (subRoll < 0.65) {
          subtype = 'HER2-Enriched';
          triage = 'Neoadjuvant TCHP (Docetaxel/Carboplatin/Trastuzumab/Pertuzumab)';
        } else if (subRoll < 0.85) {
          subtype = 'HR+/HER2- (Luminal B)';
          triage = 'Oncotype DX testing; Lumpectomy + Sentinel Node Dissection';
        } else {
          subtype = 'HR+/HER2- (Luminal A)';
          triage = 'Breast-Conserving Surgery + Adjuvant Aromatase Inhibitor';
        }
      }

      const newEvent: LiveBiopsyTelemetryEvent = {
        id: `BIO-2026-${Math.floor(9050 + Math.random() * 8000)}`,
        timestamp: 'Just now',
        centerName: center.name,
        country: center.country,
        patientAge,
        biopsyMethod: Math.random() > 0.4 ? 'Fine Needle Aspirate (FNA)' : 'Core Needle Biopsy (CNB)',
        meanArea,
        meanConcavity,
        meanTexture,
        aiClassification: isMalignant ? 'Malignant' : 'Benign',
        aiConfidencePct,
        molecularSubtypePredicted: subtype,
        recommendedTriage: triage,
        status: 'Streaming'
      };

      setTelemetryEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, simulationSpeedMs);

    return () => clearInterval(interval);
  }, [isLiveStreaming, simulationSpeedMs]);

  // Selected longitudinal record with smooth interpolation across any year (1975 to 2026)
  const currentLongitudinalPoint = useMemo(() => {
    const yearVal = Math.min(2026, Math.max(1975, selectedLongitudinalYear));
    const exact = longitudinal50YearRegistry.find((p) => p.year === yearVal);
    if (exact) return exact;

    const sorted = [...longitudinal50YearRegistry].sort((a, b) => a.year - b.year);
    let lower = sorted[0];
    let upper = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].year <= yearVal && sorted[i + 1].year >= yearVal) {
        lower = sorted[i];
        upper = sorted[i + 1];
        break;
      }
    }
    const ratio = (yearVal - lower.year) / (upper.year - lower.year || 1);
    return {
      year: yearVal,
      decade: `${Math.floor(yearVal / 10) * 10}s`,
      globalCases: Math.round(lower.globalCases + ratio * (upper.globalCases - lower.globalCases)),
      globalDeaths: Math.round(lower.globalDeaths + ratio * (upper.globalDeaths - lower.globalDeaths)),
      fiveYearSurvivalRate: +(lower.fiveYearSurvivalRate + ratio * (upper.fiveYearSurvivalRate - lower.fiveYearSurvivalRate)).toFixed(1),
      screeningPenetrationPct: +(lower.screeningPenetrationPct + ratio * (upper.screeningPenetrationPct - lower.screeningPenetrationPct)).toFixed(1),
      stage1DetectionPct: +(lower.stage1DetectionPct + ratio * (upper.stage1DetectionPct - lower.stage1DetectionPct)).toFixed(1),
      stage4MetastaticPct: +(lower.stage4MetastaticPct + ratio * (upper.stage4MetastaticPct - lower.stage4MetastaticPct)).toFixed(1),
      usSeerSurvivalRate: +(lower.usSeerSurvivalRate + ratio * (upper.usSeerSurvivalRate - lower.usSeerSurvivalRate)).toFixed(1),
      indiaSurvivalRate: +(lower.indiaSurvivalRate + ratio * (upper.indiaSurvivalRate - lower.indiaSurvivalRate)).toFixed(1),
      keyMilestone: `Historical era between ${lower.year} and ${upper.year}: Shifting from ${lower.dominantTreatmentModality} toward ${upper.dominantTreatmentModality}.`,
      dominantTreatmentModality: ratio > 0.5 ? upper.dominantTreatmentModality : lower.dominantTreatmentModality
    };
  }, [selectedLongitudinalYear]);

  // Filtered historical milestones
  const filteredMilestones = useMemo(() => {
    return historicalMilestonesList.filter((m) => {
      const matchEra = selectedEraFilter === 'All' || m.era.includes(selectedEraFilter);
      const matchTag = selectedTagFilter === 'All' || m.tag === selectedTagFilter;
      const matchQuery =
        !historySearchQuery ||
        m.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        m.leadScientistOrInstitution.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        m.scientificBreakthrough.toLowerCase().includes(historySearchQuery.toLowerCase());
      return matchEra && matchTag && matchQuery;
    });
  }, [selectedEraFilter, selectedTagFilter, historySearchQuery]);

  // Filtered telemetry
  const filteredTelemetry = useMemo(() => {
    if (telemetryFilter === 'All') return telemetryEvents;
    return telemetryEvents.filter((e) => e.aiClassification === telemetryFilter);
  }, [telemetryEvents, telemetryFilter]);

  // Country records for 2020-2026 view
  const currentCountrySummary = useMemo(() => {
    return globalYearlySummaries[selectedCountryYear] || globalYearlySummaries[2026];
  }, [selectedCountryYear]);

  const countriesForYear = useMemo(() => {
    return countryEpidemiologyDatabase
      .filter((c) => c.year === selectedCountryYear)
      .sort((a, b) => b.totalDiagnosedCases - a.totalDiagnosedCases);
  }, [selectedCountryYear]);

  const filteredCountryRows = useMemo(() => {
    if (selectedCountryFilter === 'All') return countriesForYear;
    return countriesForYear.filter((c) => c.country === selectedCountryFilter);
  }, [countriesForYear, selectedCountryFilter]);

  const countryChartData = useMemo(() => {
    return countriesForYear.map((c) => ({
      name: c.country,
      flag: c.flag,
      cases: c.totalDiagnosedCases,
      incidence: c.incidencePer100k,
      mortality: c.mortalityRatePer100k,
      survival: c.fiveYearSurvivalPct,
      screening: c.screeningCoveragePct
    }));
  }, [countriesForYear]);

  // Export functions
  const exportLongitudinalCSV = () => {
    const headers = [
      'Year',
      'Decade',
      'Global Cases',
      'Global Deaths',
      '5-Year Survival %',
      'Screening Penetration %',
      'Stage I Localized %',
      'Stage IV Metastatic %',
      'US SEER Survival %',
      'India Survival %',
      'Key Milestone',
      'Dominant Modality'
    ];
    const rows = longitudinal50YearRegistry.map((p) => [
      p.year,
      p.decade,
      p.globalCases,
      p.globalDeaths,
      p.fiveYearSurvivalRate,
      p.screeningPenetrationPct,
      p.stage1DetectionPct,
      p.stage4MetastaticPct,
      p.usSeerSurvivalRate,
      p.indiaSurvivalRate,
      `"${p.keyMilestone}"`,
      `"${p.dominantTreatmentModality}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Breast_Cancer_50Year_Longitudinal_Registry_1975_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTelemetryCSV = () => {
    const headers = [
      'Biopsy ID',
      'Timestamp',
      'Center',
      'Country',
      'Age',
      'Biopsy Method',
      'Mean Area',
      'Mean Concavity',
      'Mean Texture',
      'AI Prediction',
      'Confidence %',
      'Predicted Subtype',
      'Recommended Triage'
    ];
    const rows = telemetryEvents.map((e) => [
      e.id,
      e.timestamp,
      `"${e.centerName}"`,
      `"${e.country}"`,
      e.patientAge,
      `"${e.biopsyMethod}"`,
      e.meanArea,
      e.meanConcavity,
      e.meanTexture,
      e.aiClassification,
      e.aiConfidencePct,
      `"${e.molecularSubtypePredicted}"`,
      `"${e.recommendedTriage}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Live_Biopsy_Telemetry_Stream_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-300">
                Global Surveillance & Cohort
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Global Surveillance & Cohort: 2020–2026 Trends
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              50-Year Longitudinal Registry (1975–2026), international country comparisons, live clinical telemetry, and actionable risk reduction strategies.
            </p>
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 shrink-0 text-xs">
            <button
              onClick={() => setActiveSubTab('longitudinal-50yr')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'longitudinal-50yr'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>50-Yr Registry (1975–2026)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('historical-origins')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'historical-origins'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History (3000 BC–2026)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('live-telemetry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'live-telemetry'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Live Biopsy Telemetry</span>
            </button>

            <button
              onClick={() => setActiveSubTab('country-trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'country-trends'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>Country Profiles</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: 50-YEAR LONGITUDINAL REGISTRY (1975 TO 2026) */}
      {/* ========================================================= */}
      {activeSubTab === 'longitudinal-50yr' && (
        <div className="space-y-6">
          {/* Timeline Scrubber & Year Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Interactive Historical Registry & Global Surveillance
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Select Any Surveillance Year (1975 to 2026)
                </h3>
                <p className="text-xs text-slate-500">
                  Use the slider or input box to explore any year. Examine the shifts in survival, early detection, and standard of care.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportLongitudinalCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export 50-Yr CSV</span>
                </button>
              </div>
            </div>

            {/* User Interactive Year Slider & Direct Input Controls */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Year Scrubber:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1975}
                      max={2026}
                      step={1}
                      value={selectedLongitudinalYear}
                      onChange={(e) => setSelectedLongitudinalYear(Number(e.target.value))}
                      className="w-48 sm:w-64 accent-rose-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1975}
                        max={2026}
                        value={selectedLongitudinalYear}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (!isNaN(val)) setSelectedLongitudinalYear(val);
                        }}
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 text-center"
                      />
                      <span className="text-[11px] font-semibold text-slate-500">CE</span>
                    </div>
                  </div>
                </div>

                {/* Country Filter for Selected Year */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700">Territory:</span>
                  <select
                    value={selectedLongitudinalCountry}
                    onChange={(e) => setSelectedLongitudinalCountry(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value="Global">🌐 Global Average</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="China">🇨🇳 China</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="Japan">🇯🇵 Japan</option>
                    <option value="Brazil">🇧🇷 Brazil</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="France">🇫🇷 France</option>
                  </select>
                </div>
              </div>

              {/* Quick Jump Decades & Milestones */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Jump:</span>
                {[1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2026].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedLongitudinalYear(yr)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      selectedLongitudinalYear === yr
                        ? 'bg-rose-600 text-white shadow-xs scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {yr}
                    {yr === 2026 && <span className="ml-1 text-[9px] opacity-80">★</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Year Milestone Deep-Dive Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-xs">
                    Year {currentLongitudinalPoint.year} ({currentLongitudinalPoint.decade})
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Dominant Standard: {currentLongitudinalPoint.dominantTreatmentModality}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {currentLongitudinalPoint.keyMilestone}
                </p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-200 md:pl-4 flex flex-col justify-center">
                <span className="text-xs text-slate-500">5-Year Relative Survival:</span>
                <span className="text-2xl font-black text-rose-600">
                  {currentLongitudinalPoint.fiveYearSurvivalRate}%
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  US SEER: {currentLongitudinalPoint.usSeerSurvivalRate}% • India: {currentLongitudinalPoint.indiaSurvivalRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">5-Year Survival Gain</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-600">
                  {currentLongitudinalPoint.fiveYearSurvivalRate}%
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  +{+(currentLongitudinalPoint.fiveYearSurvivalRate - 75.2).toFixed(1)}% vs 1975
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                From 75.2% in 1975 to 91.2% in 2026
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Screening Penetration</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-indigo-600">
                  {currentLongitudinalPoint.screeningPenetrationPct}%
                </span>
                <span className="text-xs font-bold text-indigo-700">
                  +{+(currentLongitudinalPoint.screeningPenetrationPct - 12.0).toFixed(1)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Asymptomatic mammography & DBT coverage
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Early Stage (Stage I) Ratio</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-rose-600">
                  {currentLongitudinalPoint.stage1DetectionPct}%
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  +{+(currentLongitudinalPoint.stage1DetectionPct - 32.5).toFixed(1)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Up from 32.5% in 1975 to 71.0% in 2026
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Late Stage (Stage IV) Drop</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-600">
                  {currentLongitudinalPoint.stage4MetastaticPct}%
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  -{(18.2 - currentLongitudinalPoint.stage4MetastaticPct).toFixed(1)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Plummeted from 18.2% down to 6.2%
              </span>
            </div>
          </div>

          {/* Longitudinal Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: 50-Year Relative Survival Climb */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    50-Year Survival Rate Evolution (1975–2026)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Comparing Global average vs US SEER vs India registry outcomes
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
                  +16.0% Overall Gain
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={longitudinal50YearRegistry}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      formatter={(val: number) => [`${val}%`, '5-Yr Survival']}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="fiveYearSurvivalRate"
                      name="Global Survival %"
                      stroke="#e11d48"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usSeerSurvivalRate"
                      name="US SEER Registry %"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                    <Line
                      type="monotone"
                      dataKey="indiaSurvivalRate"
                      name="India Registry %"
                      stroke="#059669"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Shifting Stage Distribution at Diagnosis */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Stage Migration: Localized (Stage I) vs Metastatic (Stage IV)
                  </h4>
                  <p className="text-xs text-slate-500">
                    50-year transition driven by population screening and digital mammography
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">
                  Screening Shift
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={longitudinal50YearRegistry}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip formatter={(val: number) => [`${val}%`]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="stage1DetectionPct"
                      name="Stage I Localized (%)"
                      stroke="#10b981"
                      fill="#d1fae5"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="stage4MetastaticPct"
                      name="Stage IV Distant Metastatic (%)"
                      stroke="#e11d48"
                      fill="#ffe4e6"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Full 50-Year Longitudinal Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              50-Year Surveillance Registry Log (1975–2026)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Global Cases</th>
                    <th className="py-2.5 px-3">Global Deaths</th>
                    <th className="py-2.5 px-3">Global 5-Yr Survival</th>
                    <th className="py-2.5 px-3">Screening %</th>
                    <th className="py-2.5 px-3">Stage I %</th>
                    <th className="py-2.5 px-3">Stage IV %</th>
                    <th className="py-2.5 px-3">Dominant Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {longitudinal50YearRegistry.map((row) => (
                    <tr
                      key={row.year}
                      onClick={() => setSelectedLongitudinalYear(row.year)}
                      className={`cursor-pointer transition-colors ${
                        selectedLongitudinalYear === row.year
                          ? 'bg-rose-50 font-bold text-rose-900'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {row.year}
                      </td>
                      <td className="py-2 px-3">{(row.globalCases / 1000).toFixed(0)}k</td>
                      <td className="py-2 px-3">{(row.globalDeaths / 1000).toFixed(0)}k</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">{row.fiveYearSurvivalRate}%</td>
                      <td className="py-2 px-3 text-indigo-600">{row.screeningPenetrationPct}%</td>
                      <td className="py-2 px-3 text-emerald-700">{row.stage1DetectionPct}%</td>
                      <td className="py-2 px-3 text-rose-600">{row.stage4MetastaticPct}%</td>
                      <td className="py-2 px-3 text-slate-600 truncate max-w-xs">{row.dominantTreatmentModality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: COMPLETE HISTORICAL CHRONICLE (3000 BC TO 2026) */}
      {/* ========================================================= */}
      {activeSubTab === 'historical-origins' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  From Ancient Origins to Modern Oncology
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Chronicle of Breast Cancer Breakthroughs (3000 BC – 2026)
                </h3>
                <p className="text-xs text-slate-500">
                  Explore how medical science transitioned from treating breast masses as untreatable humors to molecular targeted biologics, Wisconsin digital cytology AI, and ctDNA liquid biopsy.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search scientist, drug, trial..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-600 mr-1">Filter Era:</span>
              {['All', 'Ancient', 'Radical Surgery', 'Chemotherapy', 'Genomics', 'Precision', 'Next-Gen AI'].map(
                (era) => (
                  <button
                    key={era}
                    onClick={() => setSelectedEraFilter(era)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      selectedEraFilter === era
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {era}
                  </button>
                )
              )}

              <span className="font-bold text-slate-600 ml-4 mr-1">Category:</span>
              {['All', 'Discovery', 'Surgical Shift', 'Pharmacology', 'Clinical Trial', 'Genetics', 'AI & Diagnostics'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTagFilter(tag)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      selectedTagFilter === tag
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Timeline Cards Feed */}
          <div className="space-y-4">
            {filteredMilestones.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-rose-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                      {item.year}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            item.tag === 'Discovery'
                              ? 'bg-amber-100 text-amber-800'
                              : item.tag === 'Surgical Shift'
                              ? 'bg-blue-100 text-blue-800'
                              : item.tag === 'Pharmacology'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.tag === 'Genetics'
                              ? 'bg-purple-100 text-purple-800'
                              : item.tag === 'AI & Diagnostics'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Lead: <span className="text-slate-800 font-semibold">{item.leadScientistOrInstitution}</span> • Era: {item.era}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 rounded text-xs font-mono font-bold text-slate-800 border border-slate-200">
                      {item.survivalRateImpact}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                  <p>
                    <span className="font-bold text-slate-900">Clinical Impact: </span>
                    {item.clinicalImpactSummary}
                  </p>
                  <p>
                    <span className="font-bold text-indigo-900">Scientific Breakthrough: </span>
                    {item.scientificBreakthrough}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: LIVE BIOPSY TELEMETRY STREAM (REAL-TIME) */}
      {/* ========================================================= */}
      {activeSubTab === 'live-telemetry' && (
        <div className="space-y-6">
          {/* Live Simulator Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Active Telemetry Simulation Feed
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Real-Time Global Biopsy Diagnostic Intake
                </h3>
                <p className="text-xs text-slate-500">
                  Simulating incoming Fine Needle Aspirates (FNA) and core biopsies from worldwide reference oncology centers evaluated against the Wisconsin nuclear morphometry ML engine.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isLiveStreaming
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {isLiveStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isLiveStreaming ? 'Pause Feed' : 'Resume Live'}</span>
                </button>

                <select
                  value={simulationSpeedMs}
                  onChange={(e) => setSimulationSpeedMs(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value={2000}>Speed: Fast (2.0s)</option>
                  <option value={3500}>Speed: Normal (3.5s)</option>
                  <option value={6000}>Speed: Slow (6.0s)</option>
                </select>

                <button
                  onClick={exportTelemetryCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Stream</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-600">Filter Classification:</span>
              {(['All', 'Malignant', 'Benign'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTelemetryFilter(filter)}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    telemetryFilter === filter
                      ? filter === 'Malignant'
                        ? 'bg-rose-600 text-white'
                        : filter === 'Benign'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <span className="ml-auto font-mono text-slate-400 text-[11px]">
                Active Buffer: {filteredTelemetry.length} events
              </span>
            </div>
          </div>

          {/* Live Telemetry Feed List */}
          <div className="space-y-3">
            {filteredTelemetry.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                  item.aiClassification === 'Malignant'
                    ? 'border-rose-200 hover:border-rose-300'
                    : 'border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.aiClassification === 'Malignant'
                          ? 'bg-rose-600 animate-ping'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span className="font-mono font-bold text-xs text-slate-900">{item.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-xs text-slate-800">{item.centerName}</span>
                    <span className="text-xs text-slate-500">({item.country})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">{item.timestamp}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        item.aiClassification === 'Malignant'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.aiClassification} ({item.aiConfidencePct}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Patient Age & Biopsy:</span>
                    <span className="font-semibold text-slate-800">
                      {item.patientAge}y • {item.biopsyMethod}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nuclear Area / Concavity:</span>
                    <span className="font-mono text-slate-800">
                      {item.meanArea} μm² / {item.meanConcavity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Predicted Molecular Class:</span>
                    <span className="font-semibold text-indigo-700">{item.molecularSubtypePredicted}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Triage Action:</span>
                    <span className="font-semibold text-slate-800 truncate block">{item.recommendedTriage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: COUNTRY PROFILES (2020 TO 2026 DEEP DIVE) */}
      {/* ========================================================= */}
      {activeSubTab === 'country-trends' && (
        <div className="space-y-6">
          {/* Year Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Global Country Registry (2020–2026)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Surveillance Across 10 Benchmark Nations
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedCountryYear(yr)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedCountryYear === yr
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Country Comparison Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-sm">
                National Burden Comparison — Year {selectedCountryYear}
              </h4>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setMetricView('totalCases')}
                  className={`px-2 py-0.5 rounded ${
                    metricView === 'totalCases' ? 'bg-white shadow-xs font-bold text-rose-600' : 'text-slate-600'
                  }`}
                >
                  Diagnosed Cases
                </button>
                <button
                  onClick={() => setMetricView('incidence')}
                  className={`px-2 py-0.5 rounded ${
                    metricView === 'incidence' ? 'bg-white shadow-xs font-bold text-rose-600' : 'text-slate-600'
                  }`}
                >
                  Incidence / 100k
                </button>
                <button
                  onClick={() => setMetricView('survival')}
                  className={`px-2 py-0.5 rounded ${
                    metricView === 'survival' ? 'bg-white shadow-xs font-bold text-rose-600' : 'text-slate-600'
                  }`}
                >
                  5-Yr Survival %
                </button>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: number) => [val.toLocaleString()]} />
                  {metricView === 'totalCases' && (
                    <Bar dataKey="cases" name="Total Cases" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  )}
                  {metricView === 'incidence' && (
                    <Bar dataKey="incidence" name="Incidence per 100k" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  )}
                  {metricView === 'survival' && (
                    <Bar dataKey="survival" name="5-Year Survival %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Country Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCountryRows.map((c) => (
              <div key={c.country} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <h5 className="font-bold text-slate-900 text-sm">{c.country}</h5>
                    <span className="text-xs text-slate-400">({c.region})</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {c.fiveYearSurvivalPct}% Survival
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Diagnosed:</span>
                    <span className="font-bold text-slate-800">{c.totalDiagnosedCases.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Screening:</span>
                    <span className="font-bold text-indigo-700">{c.screeningCoveragePct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Median Age:</span>
                    <span className="font-bold text-slate-800">{c.medianAgeAtDiagnosis} yrs</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-semibold text-slate-800">Initiative: </span>
                  {c.keyHealthInitiative}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
