# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import firebase_admin
from firebase_admin import credentials, auth as fb_auth, firestore
import os
from dotenv import load_dotenv
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
SERVICE_ACCOUNT = os.getenv("SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")
MODEL_PATH = os.getenv("MODEL_PATH", "model/student_depression_model.joblib")

# Initialize Firebase Admin
try:
    cred = credentials.Certificate(SERVICE_ACCOUNT)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logger.info("Firebase initialized successfully")
except Exception as e:
    logger.error(f"Firebase initialization error: {e}")
    raise

# Load ML Model
try:
    model = joblib.load(MODEL_PATH)
    logger.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Model loading error: {e}")
    raise

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def verify_token_from_header(headers):
    """Verify Firebase ID token from Authorization header"""
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
        logger.error(f"Token verification failed: {e}")
        return None

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    """Make prediction based on user input"""
    # Verify authentication
    user = verify_token_from_header(request.headers)
    if user is None:
        return jsonify({"error": "Unauthenticated"}), 401
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract features in correct order
        # Order should match your model training data
        features = [
            float(data.get("Extracurricular_Hours_Per_Day", 0)),
            float(data.get("Social_Hours_Per_Day", 0)),
            float(data.get("Physical_Activity_Hours_Per_Day", 0)),
            float(data.get("sleep_hours", 0)),
            float(data.get("study_hours", 0)),
            float(data.get("GPA", 0)),
            float(data.get("Academic_Pressure", 0)),
            float(data.get("Financial_Stress", 0)),
            float(data.get("Stress_Level", 0))
        ]
        
        # Validate features
        if any(f < 0 for f in features):
            return jsonify({"error": "Invalid feature values"}), 400
        
        # Make prediction
        arr = np.array(features).reshape(1, -1)
        proba = model.predict_proba(arr)[0]  # [prob_negative, prob_positive]
        pred = int(model.predict(arr)[0])
        
        # Calculate risk level
        risk_level = "Low"
        if proba[1] >= 0.7:
            risk_level = "Very High"
        elif proba[1] >= 0.5:
            risk_level = "High"
        elif proba[1] >= 0.3:
            risk_level = "Moderate"
        
        result = {
            "prediction": pred,
            "probability_positive": float(proba[1]),
            "probability_negative": float(proba[0]),
            "risk_level": risk_level,
            "uid": user.get("uid"),
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Prediction made for user {user.get('uid')}: {result}")
        return jsonify(result)
        
    except ValueError as e:
        logger.error(f"Value error in prediction: {e}")
        return jsonify({"error": "Invalid data format"}), 400
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/save-assessment", methods=["POST"])
def save_assessment():
    """Save assessment result to Firestore"""
    # Verify authentication
    user = verify_token_from_header(request.headers)
    if user is None:
        return jsonify({"error": "Unauthenticated"}), 401
    
    try:
        data = request.get_json()
        user_id = data.get("userId")
        
        if not user_id or user_id != user.get("uid"):
            return jsonify({"error": "Unauthorized"}), 403
        
        # Save to Firestore
        assessment_ref = db.collection('assessments').add({
            "userId": user_id,
            "prediction": data.get("prediction"),
            "probabilityPositive": data.get("probability_positive"),
            "probabilityNegative": data.get("probability_negative"),
            "riskLevel": data.get("risk_level"),
            "formData": data.get("formData", {}),
            "timestamp": datetime.now().isoformat()
        })
        
        logger.info(f"Assessment saved for user {user_id}")
        return jsonify({
            "success": True,
            "assessment_id": assessment_ref[1].id
        })
        
    except Exception as e:
        logger.error(f"Error saving assessment: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/assessments/<user_id>", methods=["GET"])
def get_assessments(user_id):
    """Get user's assessment history"""
    # Verify authentication
    user = verify_token_from_header(request.headers)
    if user is None:
        return jsonify({"error": "Unauthenticated"}), 401
    
    if user_id != user.get("uid"):
        return jsonify({"error": "Unauthorized"}), 403
    
    try:
        # Query Firestore
        assessments_ref = db.collection('assessments')
        query = assessments_ref.where('userId', '==', user_id).order_by('timestamp', direction=firestore.Query.DESCENDING)
        
        assessments = []
        for doc in query.stream():
            assessment_data = doc.to_dict()
            assessment_data['id'] = doc.id
            assessments.append(assessment_data)
        
        return jsonify({
            "success": True,
            "assessments": assessments
        })
        
    except Exception as e:
        logger.error(f"Error fetching assessments: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/<user_id>", methods=["GET"])
def get_user_profile(user_id):
    """Get user profile"""
    # Verify authentication
    user = verify_token_from_header(request.headers)
    if user is None:
        return jsonify({"error": "Unauthenticated"}), 401
    
    if user_id != user.get("uid"):
        return jsonify({"error": "Unauthorized"}), 403
    
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            return jsonify({
                "success": True,
                "user": user_doc.to_dict()
            })
        else:
            return jsonify({"error": "User not found"}), 404
            
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
