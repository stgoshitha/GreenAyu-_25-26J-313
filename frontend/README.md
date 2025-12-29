# GreenAyu-_25-26J-313
Our final-year research project focuses on developing an AI-powered system designed to accurately identify Sri Lankan medicinal plants and support the preservation, analysis, and advancement of traditional herbal knowledge through modern technological approaches.


---

## 🔹 Component : Fertilizer Type Prediction (IoT-Integrated)

### 🎯 Purpose
Predict the **most suitable fertilizer type** using real-time **IoT sensor data** and environmental conditions, enabling **automated, accurate, and scalable fertilizer recommendations**.

---

### 🧠 Model Details

| Aspect | Description |
|------|------------|
| Algorithm | `XGBoost Classifier` |
| Learning Type | Supervised Classification |
| Model Type | Gradient Boosted Decision Trees |
| Data Source | IoT Sensors + Agricultural Dataset |

---

### 📥 Input Features

- Region *(encoded)*
- Soil Type *(encoded)*
- Crop Type *(encoded)*
- Rainfall (mm)
- Temperature (°C)
- **Nitrogen (N)** — IoT sensor
- **Phosphorus (P)** — IoT sensor
- **Potassium (K)** — IoT sensor

> **Note:** NPK values are captured using soil nutrient IoT sensors, enabling real-time soil health assessment.

---

### 📤 Output

- **Predicted Fertilizer Type** *(categorical class)*

---

### ⚙️ Data Preprocessing

- Label encoding for categorical features:
  - Region  
  - Soil Type  
  - Crop Type  
  - Fertilizer Type *(target)*
- Numerical features retained in raw form
- No feature scaling required due to tree-based learning

---

### 🚀 Key Innovations

- Real-time **IoT-based NPK sensing**
- Learns non-linear relationships between:
  - Soil nutrients × Crop type  
  - Climate × Nutrient availability
- Robust to noisy sensor data
- Captures complex interactions:
  - Crop × Soil Type  
  - Rainfall × Temperature  
  - NPK × Crop nutrient demand

---

### 📊 Model Training & Persistence

- Train/Test split for validation
- Model trained using **XGBoost gradient boosting**
- Model saved using `joblib`
- Reloadable for:
  - Real-time IoT predictions  
  - API or edge-device deployment

---

### ✅ What Problem It Solves

❌ Manual fertilizer selection is slow and inconsistent  
❌ Rule-based systems ignore real-time soil nutrients  
❌ Fertilizer misuse degrades soil quality  

✅ Automated fertilizer recommendations using live NPK data  
✅ Precision agriculture with minimal human intervention  
✅ Scalable across regions and crop varieties  

---

## 🔹Sub component : Crop Yield Prediction

### 🎯 Purpose
Estimate **expected crop yield before harvesting** using environmental, soil, and farming practice data to reduce uncertainty and financial risk.

---

### 🧠 Model Architecture

**Models Used**
- `Linear Regression` *(baseline)*
- `XGBoost Random Forest Regressor` *(final model)*

---

### 📥 Input Features

- Region *(encoded)*
- Soil Type *(encoded)*
- Crop Type *(encoded)*
- Rainfall (mm)
- Temperature (°C)
- Fertilizer Used *(Yes / No)*
- Irrigation Used *(Yes / No)*
- Weather Condition *(encoded)*

---

### 📤 Output

- **Predicted Crop Yield** *(continuous value)*

---

### 🧪 Baseline Model: Linear Regression

**Purpose**
- Establish performance benchmark  
- Analyze linear trends  

**Limitation**
- Cannot capture complex agricultural relationships

---

### 🚀 Final Model: XGBoost Random Forest Regressor

**Why XGBoost RF?**
- Captures non-linear feature interactions
- Reduces variance through ensemble learning
- Performs well on mixed feature types

---

### 🔬 Key Innovations

- Comparative modeling *(baseline vs ensemble)*
- Learns compound effects:
  - Fertilizer + Irrigation synergy  
  - Weather × Rainfall × Crop interactions
- Robust to real-world data noise

---



