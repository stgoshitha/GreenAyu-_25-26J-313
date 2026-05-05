# Ayurvedha Plant Models & Agricultural Decision Support System

This is a Flask-based backend server that provides a comprehensive suite of AI models for plant identification, health assessment, quality grading, and agricultural predictions (drying time, shelf life, fertilizer recommendation, and yield). It also integrates with MQTT for real-time sensor data monitoring.

## 🚀 Features

### 🖼️ Image Classification Models
*   **Plant vs Other**: Detects if an image contains a plant or something else.
*   **Species Identification**: Classifies the specific species of a leaf/plant.
*   **Health Analysis**: Predicts whether a leaf is healthy or unhealthy.
*   **Disease/Abnormality**: Identifies the cause of issues (disease, nutrient deficiency, or pests).
*   **Quality Grading**: Categorizes plant material into grades (Good, Middle, Bad).
*   **Plant Part ID**: Identifies specific plant parts (e.g., Sudu Handun, Venivelgeta).

### 📊 Tabular Prediction Models
*   **Herb Drying Time**: Predicts drying duration based on method, moisture, and environment.
*   **Shelf Life Prediction**: Estimates storage life in days based on environmental factors.
*   **Fertilizer Recommendation**: Suggests the best fertilizer based on soil NPK and crop type.
*   **Crop Yield Prediction**: Estimates yield (tons/hectare) based on region, soil, and weather.

### 📡 IoT Core
*   **MQTT Integration**: Real-time subscriptions to sensor topics for drying chambers and storage rooms.
*   **Auto-Mocking**: Includes a fallback mocking system for sensor data if live sensors are inactive.

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- **Python 3.10** (Recommended)
- **Virtual Environment** tool (`venv` or `virtualenv`)

### 2. Clone and Prepare Environment
```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configuration
Create a `.env` file in the root directory to configure the MQTT broker and other settings (optional, defaults are used otherwise).

Example `.env`:
```env
MQTT_BROKER_URL=broker.hivemq.com
MQTT_BROKER_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_KEEPALIVE=5
```

### 5. Verify Models
Ensure the `models/` directory contains the necessary weights and pipelines:
- `models/other_and_plant/best_plant_vs_otherl.pth`
- `models/leaf/best_plant_leaves_model.pth`
- `models/leaf/best_leaf_model.pth`
- `models/plant_grading/best_plant_grade_model.pth`
- `models/leaf_disease/best_leaf_disease_model.pth`
- `models/plant_cat/best_plant_cat_model.pth`
- `models/plant_drying/extra_trees_model.pkl`
- `models/shelf_life/plant_shelf_life_model.pkl`
- `models/fertilizer/fertilizer_pipeline.pkl`
- `models/yield/yield_model.joblib`

---

## 🏃 Running the Project

### Start the Server
Run the following command to start the Flask server:
```bash
python app.py
```
The server will start on `http://localhost:8000`.

### API Discovery
You can view all available endpoints by visiting:
`GET http://localhost:8000/routes`

---

## 📡 MQTT Integration
The server subscribes to the following topics by default:
- `herbq/sensordata`: Herb drying chamber NPK/sensor data.
- `drystore/sensordata`: Storage room environmental data.

If no data is received, the system provides mocked data for testing purposes (controlled via `.sensor_mock.json`).

---

## 🧪 Testing
A test script is provided to verify all model paths and loading:
```bash
python test_all_models.py
```
