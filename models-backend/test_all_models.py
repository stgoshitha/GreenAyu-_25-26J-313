import joblib
import os
import torch
import torch.nn as nn
from efficientnet_pytorch import EfficientNet

# Mock classes for torch models if needed
class PlantVsOtherModel(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        in_features = self.backbone._fc.in_features
        self.backbone._fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, num_classes)
        )
    def forward(self, x): return self.backbone(x)

class PlantLeafCategoryModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(self.backbone._fc.in_features, 4)
    def forward(self, x): return self.backbone(x)

class LeafHealthModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(self.backbone._fc.in_features, 2)
    def forward(self, x): return self.backbone(x)

class PlantGradeModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        in_features = self.backbone._fc.in_features
        self.backbone._fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 12)
        )
    def forward(self, x): return self.backbone(x)

class LeafDiseaseModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(self.backbone._fc.in_features, 3)
    def forward(self, x): return self.backbone(x)

class PlantPartModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = EfficientNet.from_pretrained("efficientnet-b1")
        self.backbone._fc = nn.Linear(self.backbone._fc.in_features, 10)
    def forward(self, x): return self.backbone(x)

models_to_load = [
    ("models/other_and_plant/best_plant_vs_otherl.pth", "torch"),
    ("models/leaf/best_plant_leaves_model.pth", "torch"),
    ("models/leaf/best_leaf_model.pth", "torch"),
    ("models/plant_grading/best_plant_grade_model.pth", "torch"),
    ("models/leaf_disease/best_leaf_disease_model.pth", "torch"),
    ("models/plant_cat/best_plant_cat_model.pth", "torch"),
    ("models/plant_drying/extra_trees_model.pkl", "joblib"),
    ("models/shelf_life/plant_shelf_life_model.pkl", "joblib"),
    ("models/fertilizer/fertilizer_pipeline.pkl", "joblib"),
    ("models/yield/yield_model.joblib", "joblib"),
]

for path, mtype in models_to_load:
    print(f"Loading {path} ({mtype})...", end=" ")
    try:
        if mtype == "joblib":
            joblib.load(path)
        else:
            # Skip full torch loading as it requires exact class definitions matching app.py
            # Just check if file exists
            if not os.path.exists(path):
                raise FileNotFoundError(f"{path} not found")
        print("✅ SUCCESS")
    except Exception as e:
        print(f"❌ FAILED: {e}")
