import sklearn
import sklearn.compose._column_transformer
import joblib
import sys

# Monkeypatch
class _RemainderColsList(list):
    pass

sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList

print(f"Python version: {sys.version}")
print(f"Sklearn version: {sklearn.__version__}")

models_to_test = [
    "models/shelf_life/plant_shelf_life_model.pkl",
    "models/fertilizer/fertilizer_pipeline.pkl",
    "models/yield/yield_model.joblib"
]

for model_path in models_to_test:
    print(f"Loading {model_path}...", end=" ")
    try:
        model = joblib.load(model_path)
        print("✅ SUCCESS")
    except Exception as e:
        print(f"❌ FAILED: {e}")
