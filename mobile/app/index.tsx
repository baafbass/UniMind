import { useState } from 'react';
import WelcomeScreen from '../src/screens/WelcomeScreen';
import ProfileScreen from '../src/screens/ProfileScreen';
import ResultsScreen from '../src/screens/ResultsScreen';
import SurveyScreen from '../src/screens/SurveyScreen';
import LoginScreen from '../src/screens/Auth/LoginScreen';

// Main App Component
export default function UniMindApp() {
  
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSurveyComplete = async (formData: any) => {
  try {
    const response = await fetch('http://192.168.1.115:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Extracurricular_Hours_Per_Day: formData.extracurricular_hours,
        Social_Hours_Per_Day: formData.social_hours,
        Physical_Activity_Hours_Per_Day: formData.physical_activity_hours,
        sleep_hours: formData.sleep_hours,
        study_hours: formData.study_hours,
        Academic_Pressure: formData.academic_pressure,
        Financial_Stress: formData.financial_stress,
        Stress_Level: formData.stress_level,
        GPA:formData.gpa
      })
    });
    
    const result = await response.json();
    setAssessmentResult(result);
    setCurrentScreen('results');
  } catch (error) {
    console.error('API Error:', error);
    // Handle error appropriately
  }
};

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onNavigate={setCurrentScreen} user={user} />
      )}
      {currentScreen === 'login' && (
        <LoginScreen onNavigate={setCurrentScreen} onLogin={handleLogin} />
      )}
      {currentScreen === 'survey' && (
        <SurveyScreen onNavigate={setCurrentScreen} onComplete={handleSurveyComplete} />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen onNavigate={setCurrentScreen} result={assessmentResult} />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen onNavigate={setCurrentScreen} user={user} onLogout={handleLogout} />
      )}
    </>
  );
}