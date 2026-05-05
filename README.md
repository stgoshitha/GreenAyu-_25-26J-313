# 🌿 AI-Powered Medicinal Plant Identification & Smart Agriculture System

## 📌 Project Overview

This project presents a **fully integrated AI and IoT-based intelligent system** developed to support the **identification, quality assessment, cultivation, and post-harvest management of Sri Lankan medicinal plants**.

The system is designed as a **multi-component research platform** combining:

* Artificial Intelligence (AI)
* Machine Learning (ML)
* Deep Learning (DL)
* Internet of Things (IoT)

The primary goal is to bridge the gap between **traditional Ayurvedic knowledge** and **modern intelligent technologies**, enabling farmers, practitioners, and researchers to make **data-driven decisions**.

---

## 🎯 Research Motivation

Sri Lanka has a rich Ayurvedic heritage with thousands of medicinal plant species. However, several critical challenges exist:

* ❌ Incorrect plant identification
* ❌ Lack of quality assessment methods
* ❌ Improper fertilizer usage
* ❌ High post-harvest losses
* ❌ Absence of real-time decision support

According to the research findings, post-harvest mismanagement alone can reduce medicinal quality by **30–60%** 

👉 This system is developed to **solve these real-world problems using AI + IoT integration**.

---

## 🧩 System Architecture Overview

The system follows an **end-to-end intelligent pipeline**:

```
User Input → IoT Sensors / Image Upload → Data Preprocessing → 
AI/ML Models → Decision Engine → Web Interface Output
```

### 🔹 Main Layers:

1. **Sensor Layer (IoT Devices)**
2. **Data Processing Layer**
3. **Machine Learning Layer**
4. **Decision Support Engine**
5. **Frontend Web Application**

---

## 🧠 Core System Components

The project consists of **4 major integrated components**:

---

# 🔹 1. Medicinal Plant Identification & Quality Assessment

### 📌 Description

This component uses **deep learning and computer vision** to:

* Identify medicinal plant species
* Detect plant parts (leaf, root, bark, etc.)
* Assess plant quality (health condition)

### ⚙️ Technologies

* EfficientNet CNN
* U-Net / Mask R-CNN
* Transfer Learning

### 📊 Performance

* Identification Accuracy: ~96% 
* Quality Detection F1 Score: ~0.94 

### 💡 Key Features

* Image segmentation + classification
* Quality grading (0–100 scale)
* Disease / damage detection

---

# 🔹 2. Fertilizer Recommendation System (IoT-Based)

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

# 🔹 4. Post-Harvest Drying & Storage Advisor (IoT + ML)

### 📌 Description

This module focuses on **post-harvest management**, which is often ignored but critical.

### ⚙️ Technologies

* ESP32 IoT Device
* DHT11 Sensors
* LightGBM + XGBoost Models

### 📊 Performance

* Drying Time MAE: 1.84 hours
* Shelf Life MAE: 0.88 days 

### 💡 Features

* Real-time environmental monitoring
* Drying recommendations
* Shelf-life prediction
* Spoilage alerts

---

## 🔗 System Integration

All components are integrated into a **single intelligent platform**:

* 🌐 Frontend → React / Web UI
* ⚙️ Backend → Node.js / Flask APIs
* 🤖 AI Models → Python (ML/DL)
* 📡 IoT → ESP32 Sensors

👉 Data flows seamlessly between modules to provide **complete decision support**.

---

## 🖥️ User Workflow

1. User uploads plant image OR sensor data
2. System processes input
3. AI models analyze data
4. Results generated:

   * Plant identification
   * Quality score
   * Fertilizer recommendation
   * Yield prediction
   * Drying & storage advice

---

## 🛠️ Technologies Used

### 🔹 Frontend

* HTML, CSS, JavaScript
* React

### 🔹 Backend

* Node.js
* Flask (AI integration)

### 🔹 Machine Learning

* XGBoost
* LightGBM
* CNN (EfficientNet)
* U-Net / Mask R-CNN

### 🔹 IoT

* ESP32
* DHT11 Sensors
* MQTT Protocol

---

## 📊 Key Contributions

* ✅ Integration of **AI + IoT in agriculture**
* ✅ Localized dataset for Sri Lankan medicinal plants
* ✅ Real-time decision support system
* ✅ Multi-module intelligent platform
* ✅ Scalable architecture

---

## 🎯 Target Users

* Farmers
* Ayurvedic practitioners
* Researchers
* Students
* Agricultural experts

---

## 📈 Future Improvements

* More plant species support
* Mobile app version
* Higher model accuracy
* Cloud-based IoT scaling
* Multilingual voice support

---

## 👥 Team Members

* IT22196538 – Post-Harvest System
* IT22274120 – Fertilizer Recommendation
* IT22296450 – Plant Identification (Segmentation)
* IT22580108 – Plant Identification & Quality

---

## 📜 Conclusion

This project demonstrates how **modern AI technologies can transform traditional agriculture and Ayurveda**.

By combining **machine learning, IoT, and intelligent systems**, it provides a **powerful, scalable, and practical solution** to real-world agricultural problems in Sri Lanka.

---

## 📄 License

This project is developed for **academic and research purposes only**.

---
