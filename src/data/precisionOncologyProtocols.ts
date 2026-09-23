import {
  PatientCaseParameters,
  PrecisionPrescriptionResult,
  PredefinedArchetypeCase
} from '../types';

/**
 * Calculates Clinical TNM Stage based on AJCC 8th Edition
 */
export function calculateClinicalStage(
  tumorSizeMm: number,
  lymphNodes: number,
  metastasis: boolean
): PrecisionPrescriptionResult['clinicalStage'] {
  if (metastasis) return 'Stage IV (Metastatic)';

  if (tumorSizeMm === 0 && lymphNodes === 0) return 'Stage 0 (DCIS)';

  // T categories
  // T1: <= 20mm
  // T2: >20mm to <=50mm
  // T3: > 50mm
  // T4: chest wall/skin involvement

  // N categories
  // N0: 0 nodes
  // N1: 1-3 nodes
  // N2: 4-9 nodes
  // N3: >=10 nodes

  if (tumorSizeMm <= 20 && lymphNodes === 0) return 'Stage IA';
  if (tumorSizeMm <= 20 && lymphNodes >= 1 && lymphNodes <= 3) return 'Stage IIA';
  if (tumorSizeMm > 20 && tumorSizeMm <= 50 && lymphNodes === 0) return 'Stage IIA';
  if (tumorSizeMm > 20 && tumorSizeMm <= 50 && lymphNodes >= 1 && lymphNodes <= 3) return 'Stage IIB';
  if (tumorSizeMm > 50 && lymphNodes === 0) return 'Stage IIB';
  if (tumorSizeMm > 50 && lymphNodes >= 1 && lymphNodes <= 3) return 'Stage IIIA';
  if (lymphNodes >= 4 && lymphNodes <= 9) return 'Stage IIIA';
  if (lymphNodes >= 10) return 'Stage IIIC';
  if (tumorSizeMm > 50 && lymphNodes >= 4) return 'Stage IIIC';

  return 'Stage IIA';
}

/**
 * Derives St. Gallen / PAM50 Molecular Subtype
 */
export function deriveMolecularSubtype(
  erStatus: PatientCaseParameters['erStatus'],
  prStatus: PatientCaseParameters['prStatus'],
  her2Status: PatientCaseParameters['her2Status'],
  ki67Index: number
): PrecisionPrescriptionResult['molecularSubtype'] {
  const isErPos = erStatus.includes('Positive');
  const isPrPos = prStatus === 'Positive';
  const isHer2Pos = her2Status.includes('Positive');

  if (isHer2Pos && !isErPos && !isPrPos) {
    return 'HER2-Enriched (HR- / HER2+)';
  }

  if (isHer2Pos && (isErPos || isPrPos)) {
    return 'Triple-Positive (HR+ / HER2+)';
  }

  if (!isErPos && !isPrPos && !isHer2Pos) {
    return 'Triple-Negative (TNBC)';
  }

  // HR+/HER2-
  if (ki67Index < 20 && isPrPos) {
    return 'HR+/HER2- (Luminal A)';
  } else {
    return 'HR+/HER2- (Luminal B)';
  }
}

/**
 * Precision Oncology Prescription Engine
 * Generates tailored NCCN / ESMO evidence-based therapy protocols.
 */
export function generatePrecisionPrescription(
  params: PatientCaseParameters
): PrecisionPrescriptionResult {
  const clinicalStage = calculateClinicalStage(
    params.tumorSizeMm,
    params.lymphNodeInvolved,
    params.metastasisPresent
  );

  const molecularSubtype = deriveMolecularSubtype(
    params.erStatus,
    params.prStatus,
    params.her2Status,
    params.ki67Index
  );

  let systemicCategory = 'Adjuvant Endocrine Monotherapy';
  let firstLineRegimen = '';
  let regimenCycleDetails = '';
  let targetedTherapy = undefined;
  let immunotherapy = undefined;
  let endocrineTherapy = undefined;
  let endocrineDurationYears = undefined;
  let surgicalProtocol = '';
  let radiationProtocol = '';
  let chemoBenefitBenefitScore = 'Low / Omit Chemo';
  let projected5YearSurvival = 92;
  let projected10YearRecurrence = 12;
  let rationale = '';
  let nccnRef = 'NCCN Breast Cancer Guidelines v2.2024';

  const isPre = params.menopausalStatus === 'Premenopausal';
  const isBrcaCarrier = params.brcaMutation !== 'None / Wild-Type';

  // 1. Stage IV Metastatic
  if (clinicalStage === 'Stage IV (Metastatic)') {
    projected5YearSurvival = 36;
    projected10YearRecurrence = 70;
    chemoBenefitBenefitScore = 'Palliative Disease Control';
    surgicalProtocol = 'Primary surgery usually omitted; reserved for palliative local symptom/bleeding control.';
    radiationProtocol = 'Stereotactic body radiotherapy (SBRT) or focal palliative radiation to symptomatic bone/visceral metastases.';

    if (molecularSubtype === 'HR+/HER2- (Luminal A)' || molecularSubtype === 'HR+/HER2- (Luminal B)') {
      systemicCategory = 'Targeted CDK4/6 Inhibitor + Endocrine Backbone';
      firstLineRegimen = 'Ribociclib (600mg daily 3wks on/1wk off) OR Palbociclib (125mg) + Letrozole (2.5mg) or Fulvestrant (500mg IM)';
      regimenCycleDetails = 'Continuous 28-day cycles until disease progression or unacceptable toxicity. Add Zoledronic Acid (4mg IV q3m) or Denosumab for bone metastases.';
      endocrineTherapy = isPre ? 'Fulvestrant + Goserelin (LHRH agonist)' : 'Letrozole (Aromatase Inhibitor) or Fulvestrant';
      targetedTherapy = 'CDK4/6 Inhibitor (Ribociclib / Palbociclib / Abemaciclib)';
      rationale = 'MONALEESA & PALOMA trials demonstrated significant progression-free survival extension (>28 months) over endocrine monotherapy alone with lower toxicity than chemotherapy.';
    } else if (molecularSubtype.includes('HER2')) {
      systemicCategory = 'First-Line Dual Anti-HER2 Blockade';
      firstLineRegimen = 'CLEOPATRA Regimen: Trastuzumab (Herceptin) + Pertuzumab (Perjeta) + Docetaxel (Taxotere)';
      regimenCycleDetails = 'Docetaxel 75mg/m² IV q3w x 6 cycles; Trastuzumab 6mg/kg + Pertuzumab 420mg IV q3w continued indefinitely.';
      targetedTherapy = 'Dual Anti-HER2 (Trastuzumab + Pertuzumab) -> Second line Trastuzumab Deruxtecan (Enhertu / T-DXd)';
      rationale = 'CLEOPATRA study established median overall survival of nearly 5 years for metastatic HER2-positive breast cancer under dual antibody blockade.';
    } else {
      // TNBC Metastatic
      systemicCategory = 'Immunotherapy + Platinum Doublet';
      firstLineRegimen = 'Pembrolizumab (Keytruda 200mg IV q3w) + Nab-Paclitaxel (Abraxane 100mg/m² D1,8,15 q28d)';
      regimenCycleDetails = 'Chemo continued for 6-8 cycles; Pembrolizumab continued for up to 2 years or until progression.';
      immunotherapy = 'Pembrolizumab (anti-PD-1) for CPS ≥ 10';
      if (isBrcaCarrier) targetedTherapy = 'PARP Inhibitor: Olaparib (300mg BID) or Talazoparib (1mg daily)';
      rationale = 'KEYNOTE-355 demonstrated statistically significant overall survival benefit for pembrolizumab combination in PD-L1 positive advanced TNBC.';
    }

    return {
      molecularSubtype,
      clinicalStage,
      systemicTherapyCategory: systemicCategory,
      firstLineRegimen,
      regimenCycleDetails,
      targetedTherapy,
      immunotherapy,
      endocrineTherapy,
      endocrineDurationYears,
      surgicalProtocol,
      radiationProtocol,
      chemoBenefitBenefitScore,
      projected5YearSurvivalRate: projected5YearSurvival,
      projected10YearRecurrenceRisk: projected10YearRecurrence,
      postTreatmentSurveillance: [
        'CT Chest/Abdomen/Pelvis restaging every 3–4 months',
        'Bone scan or PET-CT every 6 months to assess skeletal response',
        'Circulating tumor ctDNA / CA 15-3 serial monitoring',
        'Brain MRI surveillance if neurological signs emerge (especially for HER2+)'
      ],
      clinicalRationaleSummary: rationale,
      nccnGuidelineRef: `${nccnRef} - Metastatic Breast Cancer Protocol`
    };
  }

  // 2. Stage 0 (DCIS)
  if (clinicalStage === 'Stage 0 (DCIS)') {
    surgicalProtocol = 'Breast Conserving Surgery (Lumpectomy with ≥2mm clear margins) OR Total Mastectomy without routine axillary dissection.';
    radiationProtocol = 'Whole Breast Radiotherapy (WBRT 40.05 Gy in 15 fractions) following breast conserving surgery.';
    chemoBenefitBenefitScore = 'Zero Benefit (Systemic Chemotherapy Contraindicated)';
    projected5YearSurvival = 99.8;
    projected10YearRecurrence = 4.2;

    if (params.erStatus.includes('Positive')) {
      endocrineTherapy = isPre ? 'Tamoxifen (20mg daily or "baby Tamoxifen" 5mg daily)' : 'Anastrozole (1mg daily) or Tamoxifen (20mg)';
      endocrineDurationYears = 5;
      rationale = 'NSABP B-24 showed 5 years of tamoxifen reduces ipsilateral and contralateral breast recurrence by 37% after DCIS resection.';
    }

    return {
      molecularSubtype,
      clinicalStage,
      systemicTherapyCategory: 'Local Surgical Resection + Adjuvant Radiation +/- Endocrine Prevention',
      firstLineRegimen: 'No systemic chemotherapy indicated for non-invasive in-situ carcinoma.',
      regimenCycleDetails: 'Surgical excision with clear margins followed by hypofractionated radiation therapy.',
      endocrineTherapy,
      endocrineDurationYears,
      surgicalProtocol,
      radiationProtocol,
      chemoBenefitBenefitScore,
      projected5YearSurvivalRate: projected5YearSurvival,
      projected10YearRecurrenceRisk: projected10YearRecurrence,
      postTreatmentSurveillance: [
        'Annual diagnostic mammogram of conserved breast and contralateral breast',
        'Clinical breast examination every 6–12 months for 5 years',
        'No routine systemic blood markers or CT imaging indicated'
      ],
      clinicalRationaleSummary: rationale || 'Pure DCIS has negligible metastatic potential; goal is preventing invasive in-breast recurrence.',
      nccnGuidelineRef: `${nccnRef} - Ductal Carcinoma In Situ Panel`
    };
  }

  // 3. Early & Locally Advanced Invasive Breast Cancer (Stages I, II, III)
  const isLargeOrNodal = params.tumorSizeMm > 20 || params.lymphNodeInvolved > 0;

  // Surgery & Radiation Defaults
  if (params.tumorSizeMm <= 30 && params.lymphNodeInvolved <= 2 && !isBrcaCarrier) {
    surgicalProtocol = 'Breast Conserving Surgery (Lumpectomy) with Sentinel Lymph Node Biopsy (SLNB) using dual tracer (Tc-99m + Patent Blue / Indocyanine Green).';
    radiationProtocol = 'Hypofractionated Whole Breast Irradiation (40 Gy in 15 fractions) + Tumor Bed Electron Boost (10 Gy in 5 fractions).';
  } else {
    surgicalProtocol = isBrcaCarrier
      ? 'Bilateral Nipple-Sparing Mastectomy (NSM) with immediate prepectoral implant or autologous DIEP flap reconstruction + SLNB.'
      : 'Modified Radical Mastectomy (MRM) or Neoadjuvant Downstaging followed by Breast Conserving Surgery + Axillary Lymph Node Dissection (ALND if >2 positive sentinel nodes).';
    radiationProtocol = params.lymphNodeInvolved > 0
      ? 'Post-Mastectomy Radiation Therapy (PMRT 50 Gy) including chest wall and Regional Nodal Irradiation (supraclavicular and internal mammary lymph nodes).'
      : 'Whole Breast Irradiation with Regional Nodal Irradiation (RNI).';
  }

  // Subtype-specific Systemic Decision
  if (molecularSubtype === 'Triple-Negative (TNBC)') {
    // TNBC Protocol
    systemicCategory = 'Neoadjuvant Chemo-Immunotherapy (KEYNOTE-522 Protocol)';
    firstLineRegimen = 'KEYNOTE-522 Regimen: Pembrolizumab (200mg q3w) + Carboplatin (AUC 5) + Paclitaxel (80mg/m² weekly x 12), followed by Pembrolizumab + Doxorubicin (60mg/m²) + Cyclophosphamide (600mg/m² q3w x 4 cycles).';
    regimenCycleDetails = 'Total 24 weeks neoadjuvant therapy -> Definitive surgery -> Adjuvant Pembrolizumab completed for 9 cycles (approx 27 weeks).';
    immunotherapy = 'Pembrolizumab (Keytruda 200mg IV q3w)';
    chemoBenefitBenefitScore = 'Extremely High (Pathologic Complete Response pCR rate ~64.8%)';
    projected5YearSurvival = params.lymphNodeInvolved > 0 ? 77 : 88;
    projected10YearRecurrence = params.lymphNodeInvolved > 0 ? 24 : 14;

    if (isBrcaCarrier) {
      targetedTherapy = 'Adjuvant PARP Inhibitor: Olaparib (Lynparza 300mg BID oral x 1 year if residual disease post-neoadjuvant / OlympiA trial)';
    }

    rationale = 'KEYNOTE-522 established that adding pembrolizumab to platinum-taxane-anthracycline neoadjuvant chemotherapy significantly increases event-free survival (84.5% vs 76.8% at 3 years) and prevents metastatic recurrence.';
  } else if (molecularSubtype.includes('HER2')) {
    // HER2-Positive Protocol
    systemicCategory = 'Neoadjuvant Dual Anti-HER2 + Non-Anthracycline Chemo (TCHP)';
    firstLineRegimen = 'TCHP Regimen: Docetaxel (75mg/m²) + Carboplatin (AUC 6) + Trastuzumab (8mg/kg load, then 6mg/kg) + Pertuzumab (840mg load, then 420mg) IV q3w x 6 cycles.';
    regimenCycleDetails = '6 cycles neoadjuvant TCHP -> Surgery -> Pathologic evaluation. If pCR: complete 1 full year of Trastuzumab + Pertuzumab. If residual disease (non-pCR): switch to Ado-Trastuzumab Emtansine (T-DM1 / Kadcyla 3.6mg/kg q3w x 14 cycles per KATHERINE trial).';
    targetedTherapy = 'Dual Anti-HER2: Trastuzumab (Herceptin) + Pertuzumab (Perjeta) -> T-DM1 for residual disease';
    chemoBenefitBenefitScore = 'Critical (pCR reached in >60% of patients with dual blockade)';
    projected5YearSurvival = params.lymphNodeInvolved > 0 ? 86 : 94;
    projected10YearRecurrence = params.lymphNodeInvolved > 0 ? 15 : 8;

    if (params.erStatus.includes('Positive')) {
      // Triple Positive
      endocrineTherapy = isPre
        ? 'Tamoxifen (20mg daily) + Ovarian Function Suppression (Goserelin 3.6mg subQ monthly)'
        : 'Letrozole (2.5mg daily) or Anastrozole (1mg daily)';
      endocrineDurationYears = 5;
    }

    rationale = 'Dual anti-HER2 blockade with Trastuzumab and Pertuzumab combined with chemotherapy achieves superior pathological complete response and slashes recurrence risk by over 50% compared to chemotherapy alone.';
  } else if (molecularSubtype === 'HR+/HER2- (Luminal A)') {
    // Luminal A
    const lowRiskOncotype = params.oncotypeDxRecurrenceScore !== undefined && params.oncotypeDxRecurrenceScore < 25;
    const isNodeNegative = params.lymphNodeInvolved === 0;

    if (isNodeNegative && (lowRiskOncotype || params.tumorSizeMm <= 20)) {
      systemicCategory = 'Endocrine Monotherapy (Chemo Sparing / TAILORx Protocol)';
      firstLineRegimen = 'No Cytotoxic Chemotherapy Indicated (TAILORx & RxPONDER verified no survival benefit from adjuvant chemotherapy).';
      regimenCycleDetails = 'Omit adjuvant cytotoxic chemotherapy. Proceed directly from surgery/radiation to 5 years of daily oral endocrine therapy.';
      chemoBenefitBenefitScore = 'Zero Significant Benefit (Spares alopecia, neutropenia, cardiotoxicity)';
      projected5YearSurvival = 97;
      projected10YearRecurrence = 6.5;

      endocrineTherapy = isPre
        ? 'Tamoxifen (20mg oral daily)'
        : 'Anastrozole (1mg oral daily) or Letrozole (2.5mg daily)';
      endocrineDurationYears = 5;
      rationale = 'The landmark TAILORx trial proved that women with HR+/HER2-, node-negative breast cancer and low-to-intermediate genomic recurrence scores derive zero survival benefit from adding chemotherapy to endocrine therapy.';
    } else {
      systemicCategory = 'Adjuvant Dose-Dense TC or AC-T Chemotherapy + Endocrine Backbone';
      firstLineRegimen = 'Dose-Dense AC-T: Doxorubicin (60mg/m²) + Cyclophosphamide (600mg/m²) q2w x 4 cycles with G-CSF support, followed by Paclitaxel (175mg/m² q2w x 4 cycles).';
      regimenCycleDetails = '16 weeks of cytotoxic chemo -> Radiation -> 5 to 10 years of endocrine therapy.';
      chemoBenefitBenefitScore = 'Moderate Benefit (~4-7% absolute reduction in recurrence)';
      projected5YearSurvival = 91;
      projected10YearRecurrence = 12;

      endocrineTherapy = isPre
        ? 'Tamoxifen (20mg) + Ovarian Function Suppression (LHRH agonist) for 5–10 years'
        : 'Aromatase Inhibitor (Letrozole 2.5mg or Exemestane 25mg) for 5–10 years';
      endocrineDurationYears = 10;
      rationale = 'RxPONDER trial demonstrated premenopausal women with 1-3 positive nodes derive a 5.4% invasive disease-free survival benefit from chemotherapy combined with ovarian suppression.';
    }
  } else {
    // Luminal B (HR+/HER2-, high Ki-67, aggressive grade)
    systemicCategory = 'Adjuvant Dose-Dense Chemo + Targeted CDK4/6 Inhibitor + Endocrine Therapy';
    firstLineRegimen = 'Dose-Dense AC-T: Doxorubicin + Cyclophosphamide x 4 cycles -> Paclitaxel x 4 cycles, followed by Abemaciclib (Verzenio 150mg BID) + Aromatase Inhibitor.';
    regimenCycleDetails = 'Chemotherapy -> Radiation -> Abemaciclib 150mg BID oral continuous for 2 years (monarchE protocol) concurrently with daily endocrine therapy for 10 years.';
    targetedTherapy = 'CDK4/6 Inhibitor: Abemaciclib (Verzenio 150mg BID x 2 years)';
    chemoBenefitBenefitScore = 'High Benefit (Combats rapid Ki-67 proliferative index)';
    projected5YearSurvival = params.lymphNodeInvolved >= 4 ? 82 : 89;
    projected10YearRecurrence = params.lymphNodeInvolved >= 4 ? 20 : 13;

    endocrineTherapy = isPre
      ? 'Aromatase Inhibitor (Letrozole 2.5mg daily) + Ovarian Suppression (Goserelin 3.6mg monthly) for 10 years'
      : 'Aromatase Inhibitor (Letrozole 2.5mg or Anastrozole 1mg daily) for 10 years';
    endocrineDurationYears = 10;
    rationale = 'The monarchE trial confirmed that adding abemaciclib for 2 years to standard endocrine therapy substantially reduces distant recurrence and invasive disease in patients with high-risk Luminal B breast cancer.';
  }

  return {
    molecularSubtype,
    clinicalStage,
    systemicTherapyCategory: systemicCategory,
    firstLineRegimen,
    regimenCycleDetails,
    targetedTherapy,
    immunotherapy,
    endocrineTherapy,
    endocrineDurationYears,
    surgicalProtocol,
    radiationProtocol,
    chemoBenefitBenefitScore,
    projected5YearSurvivalRate: projected5YearSurvival,
    projected10YearRecurrenceRisk: projected10YearRecurrence,
    postTreatmentSurveillance: [
      'Diagnostic bilateral mammogram every 12 months (or contrast MRI if high genetic density)',
      'Clinical oncology examination every 3–6 months for years 1–3, then every 6–12 months for years 4–5',
      'Dual-energy X-ray absorptiometry (DEXA) bone density scan every 2 years for patients on Aromatase Inhibitors',
      'Regular pelvic ultrasound monitoring for premenopausal patients on Tamoxifen with abnormal vaginal bleeding'
    ],
    clinicalRationaleSummary: rationale,
    nccnGuidelineRef: `${nccnRef} - Invasive Breast Carcinoma Algorithm`
  };
}

/**
 * Predefined Clinical Archetype Cases (Ready for instant comparison)
 */
export const predefinedArchetypeCases: PredefinedArchetypeCase[] = [
  {
    id: 'case-luminal-a-early',
    caseName: 'Case 1: Early-Stage Luminal A (Chemo-Sparing)',
    shortDescription: 'Postmenopausal 58yo, 16mm T1cN0 tumor, ER 95%, PR 90%, HER2-, Ki-67 8%, Oncotype DX 11.',
    patientAge: 58,
    stage: 'Stage IA',
    subtype: 'HR+/HER2- (Luminal A)',
    defaultInput: {
      age: 58,
      menopausalStatus: 'Postmenopausal',
      tumorSizeMm: 16,
      lymphNodeInvolved: 0,
      metastasisPresent: false,
      erStatus: 'Positive (>10%)',
      prStatus: 'Positive',
      her2Status: 'Negative (IHC 0/1+)',
      ki67Index: 8,
      histologicalGrade: 'Grade 1 (Well-Differentiated)',
      brcaMutation: 'None / Wild-Type',
      oncotypeDxRecurrenceScore: 11
    }
  },
  {
    id: 'case-tnbc-keynote522',
    caseName: 'Case 2: High-Risk Triple-Negative (KEYNOTE-522)',
    shortDescription: 'Premenopausal 39yo, 32mm T2N1 tumor, ER 0%, PR 0%, HER2 0, Ki-67 78%, Grade 3.',
    patientAge: 39,
    stage: 'Stage IIB',
    subtype: 'Triple-Negative (TNBC)',
    defaultInput: {
      age: 39,
      menopausalStatus: 'Premenopausal',
      tumorSizeMm: 32,
      lymphNodeInvolved: 2,
      metastasisPresent: false,
      erStatus: 'Negative (<1%)',
      prStatus: 'Negative',
      her2Status: 'Negative (IHC 0/1+)',
      ki67Index: 78,
      histologicalGrade: 'Grade 3 (Poorly Differentiated)',
      brcaMutation: 'None / Wild-Type'
    }
  },
  {
    id: 'case-her2-dual-blockade',
    caseName: 'Case 3: Locally Advanced HER2-Enriched',
    shortDescription: 'Postmenopausal 52yo, 42mm T2N1 tumor, ER-, PR-, HER2+ 3+, Ki-67 48%.',
    patientAge: 52,
    stage: 'Stage IIB',
    subtype: 'HER2-Enriched (HR- / HER2+)',
    defaultInput: {
      age: 52,
      menopausalStatus: 'Postmenopausal',
      tumorSizeMm: 42,
      lymphNodeInvolved: 2,
      metastasisPresent: false,
      erStatus: 'Negative (<1%)',
      prStatus: 'Negative',
      her2Status: 'Positive (IHC 3+ / FISH Amplified)',
      ki67Index: 48,
      histologicalGrade: 'Grade 3 (Poorly Differentiated)',
      brcaMutation: 'None / Wild-Type'
    }
  },
  {
    id: 'case-luminal-b-node-positive',
    caseName: 'Case 4: High-Risk Luminal B (monarchE Protocol)',
    shortDescription: 'Premenopausal 44yo, 28mm T2N2 tumor, ER 85%, PR 15%, HER2-, Ki-67 36%, 5 positive nodes.',
    patientAge: 44,
    stage: 'Stage IIIA',
    subtype: 'HR+/HER2- (Luminal B)',
    defaultInput: {
      age: 44,
      menopausalStatus: 'Premenopausal',
      tumorSizeMm: 28,
      lymphNodeInvolved: 5,
      metastasisPresent: false,
      erStatus: 'Positive (>10%)',
      prStatus: 'Positive',
      her2Status: 'Negative (IHC 0/1+)',
      ki67Index: 36,
      histologicalGrade: 'Grade 3 (Poorly Differentiated)',
      brcaMutation: 'None / Wild-Type',
      oncotypeDxRecurrenceScore: 34
    }
  },
  {
    id: 'case-brca1-carrier',
    caseName: 'Case 5: Young BRCA1 Mutation Carrier',
    shortDescription: 'Premenopausal 34yo, 22mm T2N0 tumor, BRCA1 Pathogenic, TNBC, Family history.',
    patientAge: 34,
    stage: 'Stage IIA',
    subtype: 'Triple-Negative (TNBC)',
    defaultInput: {
      age: 34,
      menopausalStatus: 'Premenopausal',
      tumorSizeMm: 22,
      lymphNodeInvolved: 0,
      metastasisPresent: false,
      erStatus: 'Negative (<1%)',
      prStatus: 'Negative',
      her2Status: 'Negative (IHC 0/1+)',
      ki67Index: 65,
      histologicalGrade: 'Grade 3 (Poorly Differentiated)',
      brcaMutation: 'BRCA1 Pathogenic'
    }
  },
  {
    id: 'case-metastatic-oligomet',
    caseName: 'Case 6: De Novo Metastatic Stage IV (CDK4/6)',
    shortDescription: 'Postmenopausal 61yo, primary breast mass with confirmed L2-L3 bone and solitary liver metastases.',
    patientAge: 61,
    stage: 'Stage IV (Metastatic)',
    subtype: 'HR+/HER2- (Luminal A)',
    defaultInput: {
      age: 61,
      menopausalStatus: 'Postmenopausal',
      tumorSizeMm: 45,
      lymphNodeInvolved: 3,
      metastasisPresent: true,
      erStatus: 'Positive (>10%)',
      prStatus: 'Positive',
      her2Status: 'Negative (IHC 0/1+)',
      ki67Index: 18,
      histologicalGrade: 'Grade 2 (Intermediate)',
      brcaMutation: 'None / Wild-Type'
    }
  }
];
