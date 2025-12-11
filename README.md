# UniMind

An AI-powered mobile application that predicts whether a student is depressed or not based on survey inputs.
Built with **React Native**, powered by a **Flask ML API**, authenticated with **Firebase**, and supported by a custom Machine Learning model trained from scratch.

## Features

### Core Functionality

- Predicts **Depressed / Not Depressed** using a trained ML model

- User inputs collected through an interactive survey

- **Secure Authentication** with Firebase (Email/Password)

- User data stored safely in Firebase Firestore

- Real-time API communication with Flask backend

- ML model trained from scratch in Jupyter Notebook

### App Features

- Modern & clean UI with React Native

- Login, Signup, Logout, Profile, Home

- View prediction history

- Error handling & smooth UX

## Machine Learning Model

### Model Overview

- Trained from scratch using Python + Jupyter Notebook

- Preprocessing includes:

   - Handling missing values

   - Normalizing data

   - Encoding categorical features

- Techniques used:

   - Random Forest, SVM and KNN

- Evaluation metrics (Random Forest - Best Model):

   - Accuracy: 76%

   - Precision: 75%

   - Recall: 88%

   - F1-score: 81%

## Model File

 - ### Exported as:
       ```
        model/model.pkl
       ```
 - ### Loaded inside the Flask API for real-time predictions.

## System Architecture

```scss
┌────────────────────────┐        ┌─────────────────────────────┐
│   React Native App     │ -----> │   Flask API (Prediction)    │
│ (User Interface Layer) │        │  Loads ML Model & Predicts  │
└────────────────────────┘        └─────────────────────────────┘
             │                                   │
             ▼                                   ▼
     Firebase Auth                        Jupyter-trained ML Model
  (Signup / Login / Logout)               (.pkl format loaded)
             │
             ▼
      Firebase Firestore
 (Stores user data & logs)

```

# Tech Stack

### Mobile App

- React Native

- Expo

- Firebase Authentication

- Firebase Firestore

### Backend

- Python

- Flask

- Scikit-Learn

- Jupyter Notebook

## Project Structure

```bash
docs/
    ├── UNIMIND-BMC.docx
    └── UNIMIND-PRE.docx
ML/
    ├── .ipynb_checkpoints/
        └── UniMind-checkpoint.ipynb
    ├── datasets/
        ├── Merged_Student_Lifestyle_MentalHealth.csv
        ├── student_depression_dataset.csv
        └── student_lifestyle_dataset.csv
    ├── models/
        ├── student_depression_model.joblib
        └── student_depression_model.pkl
    ├── learning_curve_random_forest.png
    └── UniMind.ipynb
mobile/
    ├── app/
        ├── _layout.tsx
        └── index.tsx
    ├── src/
        ├── components/
            └── UniMindLogo.tsx
        ├── screens/
            ├── Auth/
                └── LoginScreen.tsx
            ├── ProfileScreen.tsx
            ├── ResultsScreen.tsx
            ├── SurveyScreen.tsx
            └── WelcomeScreen.tsx
        └── services/
            ├── api.ts
            └── firebase.ts
    ├── .gitignore
    ├── app.json
    ├── eslint.config.js
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── tsconfig.json
server/
    ├── __pycache__/
        ├── app.cpython-312.pyc
        └── app.cpython-313.pyc
    ├── model/
        └── student_depression_model.joblib
    ├── app.py
    └── requirements.txt
.gitignore
```

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/baafbass/UniMind.git
cd UniMind
```

### React Native App Setup (Frontend)

```bash
cd mobile
npm install
```

## Add your Firebase credentials

### Inside mobile/config/firebase.js:

```
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_SENDER",
  appId: "YOUR_APP_ID",
};
```

## Start the app

```bash
npm start
```

## Open it on:

- Android Emulator

- iOS Simulator

- or Expo Go on phone

## Flask API Setup (Backend)

```bash
cd server
pip install -r requirements.txt
python app.py
```

## Your API will run at:

```bash
http://127.0.0.1:5000/predict
```

## API Endpoint

### POST /predict

### Request Body

```json
{
  "age": 21,
  "sleep_hours": 6,
  "stress_level": 7,
  "social_support": 3
}
```

### Response

```json
{
  "prediction": "Depressed",
  "confidence": 0.87
}
```

-- images

## How to Use the Application

### 1. Sign Up

Create an account using email & password (Firebase)

### 2. Login

Access the dashboard

### 3. Fill the Depression Survey

Provide your (hours/day):

  - Extracurrilar activities

  - Social interaction

  - Physical activities

  - Sleep duration

  - Study time

  - Academic pressure

  - Financial stress

  - GPA

  - Overall stress level

#### 4. Get Prediction

The app:

  - Sends data → Flask API

  - API → runs model

  - Returns prediction + confidence

  - App displays result

## Future Improvements

- Add more mental health metrics

- Improve dataset and model accuracy

- Deploy backend on cloud

- Multi-language support
