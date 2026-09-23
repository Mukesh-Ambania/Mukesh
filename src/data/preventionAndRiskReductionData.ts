import { PreventionStrategyItem } from '../types';

/**
 * Evidence-Based Strategies to Decrease Breast Cancer Incidence & Mortality
 * Grounded in WHO Global Breast Cancer Initiative (GBCI), American Cancer Society (ACS),
 * NCCN Prevention Guidelines, and Lancet Oncology Commissions.
 */

export const preventionStrategyList: PreventionStrategyItem[] = [
  {
    id: 'early-mammography',
    category: 'Secondary Screening (Early Detection)',
    title: 'Biennial Digital Breast Tomosynthesis (3D Mammography)',
    impactScorePct: 35,
    evidenceLevel: 'Level 1A (Meta-Analysis)',
    implementationTimeline: 'Immediate / Scheduled every 1–2 years',
    clinicalDescription:
      '3D Tomosynthesis reconstructs thin 1mm slices through the breast, cutting false-positive recall rates by 22% while boosting invasive breast cancer detection by 41% compared to conventional 2D mammography.',
    actionableDirectives: [
      'Begin routine screening from age 40 (or 10 years earlier than youngest affected first-degree relative)',
      'Ensure high-resolution 3D Tomosynthesis is selected over older film/2D digital systems',
      'Maintain continuous mammographic archives to track subtle microcalcification clusters over time'
    ],
    targetDemographic: 'All asymptomatic women aged 40–74 years at average-to-moderate risk',
    goldStandardRecommendation: 'USPSTF 2024 & NCCN: Biennial screening starting at age 40 reduces breast cancer mortality by 28–35%.'
  },
  {
    id: 'dense-breast-adjunct',
    category: 'Secondary Screening (Early Detection)',
    title: 'Supplemental Ultrasound (ABUS) & Contrast MRI for Dense Breasts',
    impactScorePct: 28,
    evidenceLevel: 'Level 1A (Meta-Analysis)',
    implementationTimeline: 'Annual adjunct for BI-RADS Density C & D',
    clinicalDescription:
      'Mammographic sensitivity drops from 88% in fatty breasts down to 50% in extremely dense fibroglandular tissue (dense tissue and tumors both appear white on X-ray, causing "masking"). Automated Breast Ultrasound (ABUS) or Contrast-Enhanced MRI finds an additional 3–5 occult cancers per 1,000 screened women.',
    actionableDirectives: [
      'Review your formal BI-RADS breast density rating (A = Fatty, B = Scattered, C = Heterogeneous, D = Extremely Dense)',
      'If Category C or D, request supplemental handheld high-frequency or Automated Breast Ultrasound (ABUS)',
      'Consider Contrast-Enhanced Spectral Mammography (CESM) where MRI access or cost is prohibitive'
    ],
    targetDemographic: 'Women with dense fibroglandular breast parenchyma (approx 43% of women aged 40+)',
    goldStandardRecommendation: 'ACR & FDA Dense Breast Notification Rule: Supplemental screening reveals cancers hidden behind dense glandular tissue.'
  },
  {
    id: 'genetic-brca-surveillance',
    category: 'Genetic High-Risk Surveillance',
    title: 'Multigene Germline Panel Testing (BRCA1, BRCA2, PALB2, TP53)',
    impactScorePct: 65,
    evidenceLevel: 'Level 1B (RCT)',
    implementationTimeline: 'One-time saliva/blood genetic test with pre/post-counseling',
    clinicalDescription:
      'Women carrying pathogenic BRCA1 or BRCA2 mutations face a 55–72% lifetime risk of developing breast cancer and up to 44% risk of ovarian cancer. Early genetic identification triggers personalized high-intensity surveillance, cutting mortality by over 60%.',
    actionableDirectives: [
      'Annual Contrast-Enhanced Breast MRI starting at age 25, alternated every 6 months with Mammography at age 30',
      'Discuss risk-reducing bilateral salpingo-oophorectomy (RRSO) between ages 35–40 upon completing childbearing (slashes ovarian cancer by 90%)',
      'Evaluate optional nipple-sparing prophylactic bilateral mastectomy (reduces breast cancer risk by 95%)',
      'Consider PARP inhibitor clinical eligibility and specialized genetic counseling'
    ],
    targetDemographic: 'Women with family history of breast/ovarian cancer, Ashkenazi heritage, or personal early-onset cancer',
    goldStandardRecommendation: 'NCCN Genetic/Familial Risk Assessment v2.2024: Annual breast MRI from age 25 provides superior detection of rapidly growing interval tumors.'
  },
  {
    id: 'lifestyle-weight-exercise',
    category: 'Primary Prevention (Lifestyle)',
    title: 'Aerobic Exercise (150+ min/wk) & Postmenopausal Adiposity Control',
    impactScorePct: 22,
    evidenceLevel: 'Level 1A (Meta-Analysis)',
    implementationTimeline: 'Continuous lifelong behavioral intervention',
    clinicalDescription:
      'In postmenopausal women, adipose fat tissue is the primary site of estrogen synthesis via peripheral aromatization of androstenedione. Maintaining a normal BMI (18.5–24.9) and regular physical activity reduces circulating bioavailable estrogen, IGF-1, insulin resistance, and chronic systemic inflammation by 30%.',
    actionableDirectives: [
      'Engage in at least 150 minutes of moderate aerobic activity (brisk walking, cycling) or 75 minutes of vigorous exercise weekly',
      'Incorporate resistance muscle-strengthening exercises at least 2 days per week',
      'Target waist-to-hip ratio < 0.80 to prevent visceral abdominal adiposity',
      'Reduces postmenopausal breast cancer risk by 20–25% and recurrence by up to 35% in cancer survivors'
    ],
    targetDemographic: 'All women across life stages, with highest protective impact post-menopause',
    goldStandardRecommendation: 'WHO Physical Activity Guidelines & WCRF/AICR Diet and Cancer Report: Convincing evidence linking regular exercise to reduced breast cancer risk.'
  },
  {
    id: 'alcohol-diet-nutrition',
    category: 'Primary Prevention (Lifestyle)',
    title: 'Alcohol Limitation (<1 drink/wk) & Mediterranean Plant-Rich Diet',
    impactScorePct: 18,
    evidenceLevel: 'Level 1A (Meta-Analysis)',
    implementationTimeline: 'Immediate behavioral adoption',
    clinicalDescription:
      'Alcohol is an established IARC Group 1 human carcinogen. Ethanol metabolism produces acetaldehyde, disrupts DNA repair, elevates serum estradiol concentrations, and causes oxidative stress. Limiting alcohol and consuming a polyphenol-rich Mediterranean diet with extra virgin olive oil provides clear chemoprotection.',
    actionableDirectives: [
      'Limit or eliminate alcoholic beverages (even 1 drink per day elevates relative risk by 7–10%)',
      'Adopt a Mediterranean nutritional pattern: high cruciferous vegetables (broccoli, cabbage), legumes, nuts, extra virgin olive oil, and oily fish rich in Omega-3',
      'Minimize ultra-processed foods, high-temperature charbroiled red meats, and refined sugars linked to hyperinsulinemia'
    ],
    targetDemographic: 'General population and women with elevated baseline estrogenic risk',
    goldStandardRecommendation: 'American Cancer Society: For cancer prevention, it is best not to drink alcohol. Mediterranean diet demonstrated 68% relative risk reduction in PREDIMED trial.'
  },
  {
    id: 'chemoprevention-high-risk',
    category: 'Genetic High-Risk Surveillance',
    title: 'Pharmacological Chemoprevention (Tamoxifen, Raloxifene, Anastrozole)',
    impactScorePct: 50,
    evidenceLevel: 'Level 1B (RCT)',
    implementationTimeline: '5-year daily oral course under oncological supervision',
    clinicalDescription:
      'Selective Estrogen Receptor Modulators (SERMs like Tamoxifen or Raloxifene) or Aromatase Inhibitors (Anastrozole/Exemestane) block estrogen binding in mammary epithelium, preventing ER+ atypical ductal hyperplasia and invasive carcinoma.',
    actionableDirectives: [
      'Calculate 5-year Gail Model or Tyrer-Cuzick lifetime breast cancer risk score',
      'If 5-year risk exceeds 1.67% or personal history of LCIS/ADH, discuss 5-year preventive SERM therapy',
      'Premenopausal candidates: Tamoxifen 20mg daily (or "baby Tamoxifen" 5mg daily for low-dose prevention with fewer hot flashes)',
      'Postmenopausal candidates: Raloxifene 60mg daily or Anastrozole 1mg daily'
    ],
    targetDemographic: 'Women aged 35+ with high estimated 5-year risk (≥1.67%) or atypical lobular/ductal hyperplasia',
    goldStandardRecommendation: 'ASCO Clinical Practice Guideline: SERMs and AIs reduce the incidence of invasive ER-positive breast cancer by 40–50% over 10 years of follow-up.'
  },
  {
    id: 'health-system-navigation',
    category: 'Clinical & Policy System',
    title: 'Rapid Patient Navigation & 14-Day Diagnostic-to-Treatment Window',
    impactScorePct: 40,
    evidenceLevel: 'Level 1A (Meta-Analysis)',
    implementationTimeline: 'Hospital infrastructure and health ministry reform',
    clinicalDescription:
      'Studies prove that a diagnosis-to-treatment delay exceeding 90 days increases 5-year mortality by 12% for each additional month of delay due to stage migration and micrometastatic seeding. Implementing rapid-access biopsy clinics and multidisciplinary tumor boards fundamentally reverses late-stage mortality.',
    actionableDirectives: [
      'Guarantee free or subsidized Core Needle Biopsy (CNB) with IHC within 7 business days of an abnormal BI-RADS 4/5 imaging report',
      'Establish Multidisciplinary Tumor Board (MDT) review uniting Surgical Oncologists, Medical Oncologists, Radiologists, and Pathologists before treatment begins',
      'Deploy nurse patient navigators to ensure 0% patient drop-off between surgical consult, neoadjuvant therapy, and follow-up radiation'
    ],
    targetDemographic: 'Public health systems, low-to-middle income populations, and underserved health districts',
    goldStandardRecommendation: 'WHO Global Breast Cancer Initiative Pillar 2: Diagnosis within 60 days of first presentation reduces global breast cancer deaths by 2.5 million by 2040.'
  }
];

/**
 * Interactive Public Health Policy Simulation Scenarios
 * Demonstrating how increasing screening coverage, early stage shift, and rapid treatment save lives.
 */
export const policySimulationMetrics = {
  baselineMortalityPer100k: 18.5,
  baselineEarlyStagePct: 45,
  baselineAverageDelayDays: 78,
  scenarios: [
    {
      name: 'Status Quo (Fragmented Screening)',
      screeningCoveragePct: 35,
      earlyStagePct: 42,
      averageDelayDays: 85,
      fiveYearSurvivalPct: 71.0,
      annualDeathsPerMillionWomen: 185,
      healthcareCostIndex: 100
    },
    {
      name: 'Mobile Ultrasound + Community Clinical Exams',
      screeningCoveragePct: 55,
      earlyStagePct: 58,
      averageDelayDays: 52,
      fiveYearSurvivalPct: 81.5,
      annualDeathsPerMillionWomen: 132,
      healthcareCostIndex: 82
    },
    {
      name: 'Nationwide Digital 3D Screening + Subsidized Biopsy',
      screeningCoveragePct: 75,
      earlyStagePct: 72,
      averageDelayDays: 28,
      fiveYearSurvivalPct: 89.2,
      annualDeathsPerMillionWomen: 94,
      healthcareCostIndex: 68
    },
    {
      name: 'Optimized Precision Early Detection (AI + Liquid Biopsy + Fast-Track)',
      screeningCoveragePct: 90,
      earlyStagePct: 86,
      averageDelayDays: 14,
      fiveYearSurvivalPct: 95.8,
      annualDeathsPerMillionWomen: 52,
      healthcareCostIndex: 54
    }
  ]
};
