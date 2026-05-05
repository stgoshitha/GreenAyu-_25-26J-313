from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import joblib
import pandas as pd
from PIL import Image

import sklearn.compose._column_transformer

class _RemainderColsList(list):
    pass

if not hasattr(sklearn.compose._column_transformer, "_RemainderColsList"):
    sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList

from torchvision import transforms
from efficientnet_pytorch import EfficientNet

from MQTT import create_mqtt_app, get_latest
from Configurations import MQTT_TOPIC, MQTT_TOPIC2

# ==================== APP SETUP ====================
app = Flask(__name__)
mqtt = create_mqtt_app(app)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]}})

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_grad_enabled(False)

# ==================== SHARED TRANSFORMS ====================
IMAGE_SIZE = 240

standard_tfms = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.CenterCrop(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])


# ==================== HELPER ====================
def load_image(file_stream):
    return Image.open(file_stream).convert("RGB")


def image_to_tensor(image):
    return standard_tfms(image).unsqueeze(0).to(DEVICE)



# =====================================================================
#  MODEL 1 — OTHER AND PLANT
#  Route : POST /plant/detect
#  Input : multipart/form-data  { file: <image> }
# =====================================================================

class PlantVsOtherModel(nn.Module):
    """EfficientNet-B1 with Dropout(0.3) + Linear head for binary classification."""
    def __init__(self, num_classes=2):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        in_features = self.backbone._fc.in_features
        self.backbone._fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)
    
    
PLANT_VS_OTHER_CLASSES = ["other", "plant"]

plant_vs_other_model = None
try:
    plant_vs_other_model = PlantVsOtherModel(num_classes=2).to(DEVICE)
    plant_vs_other_model.load_state_dict(
        torch.load(
            "models/other_and_plant/best_plant_vs_otherl.pth",
            map_location=DEVICE,
        )
    )
    plant_vs_other_model.eval()
    print("✅ Plant-vs-Other model loaded.")
except Exception as e:
    print(f"⚠️  Plant-vs-Other model failed to load: {e}")


@app.route("/plant/detect", methods=["POST"])
def detect_plant():
    if plant_vs_other_model is None:
        return jsonify({"error": "plant-vs-other model not loaded on server"}), 500
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        probs = torch.softmax(plant_vs_other_model(x), dim=1)
        idx = torch.argmax(probs, dim=1).item()

    predicted_class = PLANT_VS_OTHER_CLASSES[idx]

    return jsonify({
        "is_plant":          predicted_class == "plant",
        "predicted_class":   predicted_class,
        "confidence":        round(float(probs[0][idx]), 4),
        "all_probabilities": {
            cls: round(float(probs[0][i]), 4)
            for i, cls in enumerate(PLANT_VS_OTHER_CLASSES)
        },
})

# =====================================================================
#  MODEL 1 — PLANT LEAF CATEGORY
#  Route : POST /leaf/category
#  Input : multipart/form-data  { file: <image> }
#  Output: { leaves_class, confidence }
# =====================================================================
PLANT_LEAF_CLASSES = ['Iramusu_plant', 'Pawatta_plant', 'Ruk_aguna_plant', 'SuduHandun_plant']


class PlantLeafCategoryModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(
            self.backbone._fc.in_features, len(PLANT_LEAF_CLASSES)
        )

    def forward(self, x):
        return self.backbone(x)


plant_leaf_model = PlantLeafCategoryModel().to(DEVICE)
plant_leaf_model.load_state_dict(
    torch.load("models/leaf/best_plant_leaves_model.pth", map_location=DEVICE)
)
plant_leaf_model.eval()


@app.route("/leaf/category", methods=["POST"])
def predict_leaf_category():
    """Classify which plant species the leaf belongs to."""
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        probs = torch.softmax(plant_leaf_model(x), dim=1)
        idx = torch.argmax(probs, dim=1).item()

    return jsonify({
        "leaves_class": PLANT_LEAF_CLASSES[idx],
        "confidence": round(float(probs[0][idx]), 4),
    })


# =====================================================================
#  MODEL 2 — LEAF HEALTH
#  Route : POST /leaf/health
#  Input : multipart/form-data  { file: <image> }
#  Output: { class, confidence }
# =====================================================================
LEAF_HEALTH_CLASSES = ["healthy", "unhealthy"]


class LeafHealthModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(
            self.backbone._fc.in_features, len(LEAF_HEALTH_CLASSES)
        )

    def forward(self, x):
        return self.backbone(x)


leaf_health_model = LeafHealthModel().to(DEVICE)
leaf_health_model.load_state_dict(
    torch.load("models/leaf/best_leaf_model.pth", map_location=DEVICE)
)
leaf_health_model.eval()


@app.route("/leaf/health", methods=["POST"])
def predict_leaf_health():
    """Predict whether a leaf is healthy or unhealthy."""
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        probs = torch.softmax(leaf_health_model(x), dim=1)
        idx = torch.argmax(probs, dim=1).item()

    return jsonify({
        "class": LEAF_HEALTH_CLASSES[idx],
        "confidence": round(float(probs[0][idx]), 4),
    })


# =====================================================================
#  MODEL 3 — PLANT GRADE CLASSIFICATION
#  Route : POST /plant/quality
#  Input : multipart/form-data  { file: <image> }
#  Output: { plant, grade, combined_class, confidence, all_probabilities }
#  Classes: 12 combined  e.g. Aralu_Good, Thippili_Bad, Valmee_Middle …
# =====================================================================
_PLANT_NAMES = ["Aralu", "Thippili", "Valmee", "Venivalgata"]
_GRADES      = ["Good", "Middle", "Bad"]

# Class list must match the order ImageFolder used during training
# (alphabetical by combined name, which is what ImageFolder produces)
PLANT_GRADE_CLASSES = sorted([f"{p}_{g}" for p in _PLANT_NAMES for g in _GRADES])


class PlantGradeModel(nn.Module):
    """
    EfficientNet-B1 with a Dropout + Linear head for 12 plant-grade classes.
    Architecture matches the notebook exactly.
    """
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        in_features = self.backbone._fc.in_features
        self.backbone._fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, len(PLANT_GRADE_CLASSES))
        )

    def forward(self, x):
        return self.backbone(x)


plant_grade_model = None
try:
    plant_grade_model = PlantGradeModel().to(DEVICE)
    plant_grade_model.load_state_dict(
        torch.load("models/plant_grading/best_plant_grade_model.pth", map_location=DEVICE)
    )
    plant_grade_model.eval()
    print("✅ Plant grade model loaded.")
except Exception as e:
    print(f"⚠️  Plant grade model failed to load: {e}")


@app.route("/plant/quality", methods=["POST"])
def predict_plant_quality():
    """
    Classify plant species and grade in a single call.
    Returns the plant name (e.g. Aralu), the grade (Good / Middle / Bad),
    the combined class label, confidence, and probabilities for all 12 classes.
    """
    if plant_grade_model is None:
        return jsonify({"error": "plant grade model not loaded on server"}), 500
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        probs = torch.softmax(plant_grade_model(x), dim=1)
        idx   = torch.argmax(probs, dim=1).item()

    combined_class = PLANT_GRADE_CLASSES[idx]          # e.g. "Aralu_Good"
    plant, grade   = combined_class.split("_", 1)      # "Aralu", "Good"

    return jsonify({
        "plant":          plant,
        "grade":          grade,
        "combined_class": combined_class,
        "confidence":     round(float(probs[0][idx]), 4),
        "all_probabilities": {
            cls: round(float(probs[0][i]), 4)
            for i, cls in enumerate(PLANT_GRADE_CLASSES)
        },
    })


# =====================================================================
#  MODEL 4 — LEAF DISEASE CLASSIFICATION
#  Route : POST /leaf/disease
#  Input : multipart/form-data  { file: <image> }
#  Output: { leaf_condition, confidence, all_probabilities }
#  Classes: disease | nutrient | pest
# =====================================================================
LEAF_DISEASE_CLASSES = ["disease", "nutrient", "pest"]


class LeafDiseaseModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(
            self.backbone._fc.in_features, len(LEAF_DISEASE_CLASSES)
        )

    def forward(self, x):
        return self.backbone(x)


leaf_disease_model = None
try:
    leaf_disease_model = LeafDiseaseModel().to(DEVICE)
    leaf_disease_model.load_state_dict(
        torch.load("models/leaf_disease/best_leaf_disease_model.pth", map_location=DEVICE)
    )
    leaf_disease_model.eval()
    print("✅ Leaf disease model loaded.")
except Exception as e:
    print(f"⚠️  Leaf disease model failed to load: {e}")


@app.route("/leaf/disease", methods=["POST"])
def predict_leaf_disease():
    """Classify the cause of leaf abnormality: disease, nutrient deficiency, or pest."""
    if leaf_disease_model is None:
        return jsonify({"error": "leaf disease model not loaded on server"}), 500
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        probs = torch.softmax(leaf_disease_model(x), dim=1)
        idx = torch.argmax(probs, dim=1).item()

    return jsonify({
        "leaf_condition": LEAF_DISEASE_CLASSES[idx],
        "confidence": round(float(probs[0][idx]), 4),
        "all_probabilities": {
            cls: round(float(probs[0][i]), 4)
            for i, cls in enumerate(LEAF_DISEASE_CLASSES)
        },
    })


# =====================================================================
#  MODEL 5 — PLANT PART / SPECIES CLASSIFICATION
#  Route : POST /plant-part
#  Input : multipart/form-data  { file: <image> }
#  Output: { plant_part, confidence }
# =====================================================================
PLANT_PART_CLASSES = [
    "Aralu", "Edaru", "Iramusu", "Lunuvarana Pothu",
    "Nika", "Other", "Sudu Handun", "Thippili",
    "Valmee", "Venivelgeta",
]


class PlantPartModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(
            self.backbone._fc.in_features, len(PLANT_PART_CLASSES)
        )

    def forward(self, x):
        return self.backbone(x)


plant_part_model = PlantPartModel().to(DEVICE)
plant_part_model.load_state_dict(
    torch.load("models/plant_cat/best_plant_cat_model.pth", map_location=DEVICE)
)
plant_part_model.eval()
print("✅ Plant part model loaded.")


@app.route("/plant-part", methods=["POST"])
def predict_plant_part():
    """Identify the plant species / part from an image."""
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        probs = torch.softmax(plant_part_model(x), dim=1)
        idx = torch.argmax(probs, dim=1).item()

    return jsonify({
        "plant_part": PLANT_PART_CLASSES[idx],
        "confidence": round(float(probs[0][idx]), 4),
    })


# =====================================================================
#  COMBINED — PLANT ANALYZE (category + health in one call)
#  Route : POST /plant/analyze
#  Input : multipart/form-data  { file: <image> }
#  Output: { plant_category: {...}, plant_health: {...} }
# =====================================================================
@app.route("/plant/analyze", methods=["POST"])
def analyze_plant():
    """Run both category and health classification on one image."""
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400

    x = image_to_tensor(load_image(request.files["file"].stream))

    with torch.inference_mode():
        cat_probs = torch.softmax(plant_leaf_model(x), dim=1)
        cat_idx = torch.argmax(cat_probs, dim=1).item()

        health_probs = torch.softmax(leaf_health_model(x), dim=1)
        health_idx = torch.argmax(health_probs, dim=1).item()

    return jsonify({
        "plant_category": {
            "class": PLANT_LEAF_CLASSES[cat_idx],
            "confidence": round(float(cat_probs[0][cat_idx]), 4),
        },
        "plant_health": {
            "class": LEAF_HEALTH_CLASSES[health_idx],
            "confidence": round(float(health_probs[0][health_idx]), 4),
        },
    })


# =====================================================================
#  MODEL 6 — HERB DRYING TIME PREDICTION
#  Route : POST /herb/drying-time
#  Input : JSON body (see HERB_DRYING_FEATURES below)
#  Output: { drying_time_hours }
# =====================================================================
HERB_DRYING_FEATURES = [
    "plant_type",           # str  — Ruk_Aguna | Pawatta | Sudu_Handun | Iramusu
    "initial_moisture_pct", # float
    "temperature_C",        # float
    "humidity_pct",         # float
    "airflow_ms",           # float
    "layer_thickness_cm",   # float
    "drying_method",        # str  — Air Drying | Oven | Dehydrator | Freeze Drying
    "preparation",          # str  — Whole | Chopped | Stem-on
]

herb_drying_model = None
herb_drying_encoders = None
try:
    herb_drying_model = joblib.load("models/plant_drying/extra_trees_model.pkl")
    herb_drying_encoders = joblib.load("models/plant_drying/label_encoders.pkl")
    print("✅ Herb drying model loaded.")
except Exception as e:
    print(f"⚠️  Herb drying model failed to load: {e}")


@app.route("/herb/drying-time", methods=["POST"])
def predict_herb_drying_time():
    """
    Predict how many hours it will take to dry a herb batch.

    Required JSON fields:
        plant_type, initial_moisture_pct, temperature_C, humidity_pct,
        airflow_ms, layer_thickness_cm, drying_method, preparation
    """
    if herb_drying_model is None or herb_drying_encoders is None:
        return jsonify({"error": "herb drying model not loaded on server"}), 500

    data = request.get_json(force=True)

    missing = [f for f in HERB_DRYING_FEATURES if f not in data]
    if missing:
        return jsonify({"error": "Missing required fields", "fields": missing}), 400

    try:
        enc = herb_drying_encoders
        input_df = pd.DataFrame([{
            "plant_type":           enc["plant_type"].transform([data["plant_type"]])[0],
            "initial_moisture_pct": float(data["initial_moisture_pct"]),
            "temperature_C":        float(data["temperature_C"]),
            "humidity_pct":         float(data["humidity_pct"]),
            "airflow_ms":           float(data["airflow_ms"]),
            "layer_thickness_cm":   float(data["layer_thickness_cm"]),
            "drying_method":        enc["drying_method"].transform([data["drying_method"]])[0],
            "preparation":          enc["preparation"].transform([data["preparation"]])[0],
        }])
    except Exception as e:
        return jsonify({"error": "Failed to preprocess input", "detail": str(e)}), 400

    pred_hours = round(float(herb_drying_model.predict(input_df)[0]), 2)
    return jsonify({"drying_time_hours": pred_hours})


# =====================================================================
#  MODEL 7 — SHELF LIFE PREDICTION
#  Route : POST /shelf-life
#  Input : JSON body
#  Output: { shelf_life_days }
# =====================================================================
shelf_life_pipeline = joblib.load("models/shelf_life/plant_shelf_life_model.pkl")
shelf_life_pipeline.named_steps["model"].set_params(device="cpu")
print("✅ Shelf life model loaded.")

SHELF_LIFE_FIELDS = [
    "plant_type", "storage_type", "temperature_c", "humidity_percent",
    "respiration_rate", "ethylene_sensitivity", "water_content",
    "damage_level", "microbial_risk",
]


@app.route("/shelf-life", methods=["POST"])
def predict_shelf_life():
    """
    Predict shelf life in days for stored plant material.

    Required JSON fields:
        plant_type, storage_type, temperature_c, humidity_percent,
        respiration_rate, ethylene_sensitivity, water_content,
        damage_level, microbial_risk
    """
    data = request.get_json(force=True)

    missing = [f for f in SHELF_LIFE_FIELDS if f not in data]
    if missing:
        return jsonify({"error": "Missing required fields", "fields": missing}), 400

    df = pd.DataFrame([{f: data[f] for f in SHELF_LIFE_FIELDS}])
    pred = shelf_life_pipeline.predict(df)[0]
    return jsonify({"shelf_life_days": round(float(pred), 1)})


# =====================================================================
#  MODEL 8 — FERTILIZER RECOMMENDATION
#  Route : POST /fertilizer
#  Input : JSON body
#  Output: { recommended_fertilizer }
# =====================================================================
fertilizer_model = joblib.load("models/fertilizer/fertilizer_pipeline.pkl")
fertilizer_encoder = joblib.load("models/fertilizer/label_encoder.pkl")
fertilizer_model.named_steps["model"].set_params(device="cpu")
print("✅ Fertilizer model loaded.")

FERTILIZER_FIELDS = [
    "Temparature", "Humidity", "Moisture",
    "Nitrogen", "Phosphorous", "Potassium",
    "Soil_Type", "Crop_Type",
]


@app.route("/fertilizer", methods=["POST"])
def predict_fertilizer():
    """
    Recommend a fertilizer based on soil and crop conditions.

    Required JSON fields:
        Temparature, Humidity, Moisture, Nitrogen, Phosphorous,
        Potassium, Soil_Type, Crop_Type
    """
    data = request.get_json(force=True)

    missing = [f for f in FERTILIZER_FIELDS if f not in data]
    if missing:
        return jsonify({"error": "Missing required fields", "fields": missing}), 400

    null_fields = [
        f for f in FERTILIZER_FIELDS
        if data[f] is None or (isinstance(data[f], str) and data[f].strip() == "")
    ]
    if null_fields:
        return jsonify({"error": "Null or empty values detected", "fields": null_fields}), 400

    df = pd.DataFrame([data])
    pred = fertilizer_model.predict(df)
    fertilizer = fertilizer_encoder.inverse_transform(pred)[0]
    return jsonify({"recommended_fertilizer": fertilizer})


# =====================================================================
#  MODEL 9 — CROP YIELD PREDICTION
#  Route : POST /yield
#  Input : JSON body
#  Output: { yield_tons_per_hectare }
# =====================================================================
yield_model = joblib.load("models/yield/yield_model.joblib")
print("✅ Yield model loaded.")

REGION_MAP  = {"North": 0, "West": 1, "South": 2, "East": 3}
CROP_MAP    = {"Ruk_Aguna": 0, "Pawatta": 1, "SuduHandun": 2, "Iramusu": 3}
SOIL_MAP    = {"Sandy": 0, "Loam": 1, "Chalky": 2, "Silt": 3, "Clay": 4, "Peaty": 5}
WEATHER_MAP = {"Sunny": 0, "Rainy": 1, "Cloudy": 2}


@app.route("/yield", methods=["POST"])
def predict_yield():
    """
    Predict crop yield in tons per hectare.

    Required JSON fields:
        Region (North|West|South|East),
        Soil_Type (Sandy|Loam|Chalky|Silt|Clay|Peaty),
        Crop (Ruk_Aguna|Pawatta|SuduHandun|Iramusu),
        Rainfall_mm, Temperature_Celsius,
        Fertilizer_Used (0/1), Irrigation_Used (0/1),
        Weather_Condition (Sunny|Rainy|Cloudy),
        Days_to_Harvest
    """
    data = request.get_json(force=True)

    try:
        df = pd.DataFrame([{
            "Region":              REGION_MAP[data["Region"]],
            "Soil_Type":           SOIL_MAP[data["Soil_Type"]],
            "Crop":                CROP_MAP[data["Crop"]],
            "Rainfall_mm":         data["Rainfall_mm"],
            "Temperature_Celsius": data["Temperature_Celsius"],
            "Fertilizer_Used":     int(data["Fertilizer_Used"]),
            "Irrigation_Used":     int(data["Irrigation_Used"]),
            "Weather_Condition":   WEATHER_MAP[data["Weather_Condition"]],
            "Days_to_Harvest":     data["Days_to_Harvest"],
        }])
    except KeyError as e:
        return jsonify({"error": f"Invalid or missing field: {e}"}), 400

    pred = yield_model.predict(df)[0]
    return jsonify({"yield_tons_per_hectare": round(float(pred), 2)})


# =====================================================================
#  SENSOR DATA — MQTT TOPICS
#  Route : GET /herbq/sensordata
#  Route : GET /drystore/sensordata
# =====================================================================
@app.route("/herbq/sensordata")
def herbq_sensordata():
    """Latest sensor readings from the herb-drying chamber (MQTT)."""
    latest = get_latest(MQTT_TOPIC)
    if not latest:
        return jsonify({"ok": False, "message": "No data received yet", "topic": MQTT_TOPIC}), 404
    return jsonify({"ok": True, **latest})


@app.route("/drystore/sensordata")
def drystore_sensordata():
    """Latest sensor readings from the dry-storage room (MQTT)."""
    latest = get_latest(MQTT_TOPIC2)
    if not latest:
        return jsonify({"ok": False, "message": "No data received yet", "topic": MQTT_TOPIC2}), 404
    return jsonify({"ok": True, **latest})



# =====================================================================
#  DISCOVERY — list all available API routes
#  Route : GET /routes
# =====================================================================
@app.route("/routes", methods=["GET"])
def list_routes():
    """Return a summary of all available API endpoints."""
    return jsonify({
        "image_endpoints": {
            "POST /plant/detect":   "Binary gate — is this image a plant or not? (other | plant)",
            "POST /leaf/category":  "Classify plant species from a leaf image",
            "POST /leaf/health":    "Predict healthy / unhealthy leaf",
            "POST /leaf/disease":   "Classify leaf condition: disease | nutrient | pest",
            "POST /plant/quality":  "Grade plant material: bad | mid | good",
            "POST /plant-part":     "Identify plant species / part from image",
            "POST /plant/analyze":  "Leaf category + health in a single call",
        },
        "tabular_endpoints": {
            "POST /herb/drying-time": "Predict herb drying time (hours)",
            "POST /shelf-life":       "Predict shelf life (days)",
            "POST /fertilizer":       "Recommend fertilizer for crop/soil",
            "POST /yield":            "Predict crop yield (tons/hectare)",
        },
        "sensor_endpoints": {
            "GET /herbq/sensordata":   "Latest MQTT readings from herb chamber",
            "GET /drystore/sensordata": "Latest MQTT readings from dry-storage room",
        },
    })


# =====================================================================
#  RUN
# =====================================================================
if __name__ == "__main__":
    print("Server starting on http://0.0.0.0:8000 ...")
    app.run(host="0.0.0.0", port=8000, debug=False)