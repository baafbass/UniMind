# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import firebase_admin
from firebase_admin import credentials, auth as fb_auth
import os
from dotenv import load_dotenv

load_dotenv()
SERVICE_ACCOUNT = os.getenv("SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")
MODEL_PATH = os.getenv("MODEL_PATH", "model/model.joblib")

cred = credentials.Certificate(SERVICE_ACCOUNT)
firebase_admin.initialize_app(cred)

model = joblib.load(MODEL_PATH)  # scikit-learn tarzı model

app = Flask(__name__)
CORS(app)

def verify_token_from_header(headers):
    auth_header = headers.get('Authorization', None)
    if not auth_header:
        return None
    if not auth_header.startswith("Bearer "):
        return None
    id_token = auth_header.split("Bearer ")[1]
    try:
        decoded = fb_auth.verify_id_token(id_token)
        return decoded  # contains uid, email, etc.
    except Exception as e:
        print("Token verify failed:", e)
        return None

@app.route("/api/predict", methods=["POST"])
def predict():
    user = verify_token_from_header(request.headers)
    if user is None:
        return jsonify({"error": "Unauthenticated"}), 401

    data = request.get_json()
    # örnek varsayılan feature sırasi: [sleep_hours, study_hours, gpa, stress_level, physical_activity]
    try:
        features = [
            data.get("sleep_hours", 0),
            data.get("study_hours", 0),
            data.get("gpa", 0),
            data.get("stress_level", 0),
            data.get("physical_activity", 0)
        ]
        arr = np.array(features).reshape(1, -1)
        proba = model.predict_proba(arr)[0]  # [prob_neg, prob_pos] örnek
        pred = int(model.predict(arr)[0])
        return jsonify({
            "prediction": pred,
            "probability_positive": float(proba[1]),
            "probability_negative": float(proba[0]),
            "uid": user.get("uid")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
