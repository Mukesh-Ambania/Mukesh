# Healthcare Cancer Prediction & Analytics

A web application migrated from the imported repository (`Mukesh-Ambania/Mukesh`).

## Architecture & Features

This application combines the machine learning pipeline from the original Google Colab notebook (`Healthcare_cancer_prediction_Colab.ipynb`) and the clinical business intelligence dashboard from the Power BI report (`cancer prediction.pbix`), backed by the 55,500 patient records in `healthcare_dataset.csv`.

### 1. Interactive Cancer Risk Predictor
- Implements the K-Nearest Neighbors (KNN, K=5) classification logic trained on patient demographics, admission acuity, diagnostic biomarkers, and inpatient profile.
- Provides real-time risk scores (0–100%), risk tier classifications (Low, Moderate, Elevated, High), identified risk factors, and actionable clinical follow-up recommendations.
- Interactive controls with quick-load clinical presets (High Risk, Typical, Low Risk).

### 2. Clinical Analytics & Power BI Dashboard
- Condition distribution across Cancer, Diabetes, Hypertension, Asthma, Arthritis, and Obesity.
- Cancer incidence across 5 age cohorts (<20, 20–34, 35–49, 50–64, 65+).
- Financial metrics comparing average inpatient billing across 5 major insurance providers (Blue Cross, Medicare, Aetna, UnitedHealthcare, Cigna).
- Diagnostic test results breakdown (Normal, Inconclusive, Abnormal).
- Hospital admission acuity breakdown and inpatient medication distribution.

### 3. Model Telemetry & ML Pipeline
- Complete documentation of the Colab notebook workflow: data cleansing, target mapping, feature encoding, StandardScaler normalization, and 80/20 train/test evaluation.
- Detailed Scikit-Learn classification report metrics (Accuracy: 81.26%, Precision, Recall, F1-Score) and interactive 4-quadrant Confusion Matrix.

### 4. Patient Registry & Explorer
- Filterable and searchable patient encounter registry with pagination.
- Patient medical chart drawer providing comprehensive history, attending physician, hospital facility, room, and instant on-the-fly cancer risk analysis.
