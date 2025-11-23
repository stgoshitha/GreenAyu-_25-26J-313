from flask import Flask
from flask_cors import CORS
import torch

# -------------------- APP --------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]}})

# -------------------- DEVICE --------------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_grad_enabled(False)

# -------------------- RUN --------------------
if __name__ == "__main__":
    print("Server starting...")
    app.run(host="0.0.0.0", port=8000, debug=False)
