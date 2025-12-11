import axios from 'axios';
import { auth } from './firebase';

// Update this with your actual backend URL
const API_BASE = __DEV__ 
  ? 'http://10.7.85.208:5000' // Development
  : 'https://your-production-url.com'; // Production

// Helper: Get Firebase ID token
async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

// Send survey data and get prediction
export async function sendSurveyAndPredict(features:any) {
  try {
    const token = await getIdToken();
    
    const response = await axios.post(
      `${API_BASE}/api/predict`,
      {
        Extracurricular_Hours_Per_Day: features.extracurricular_hours,
        Social_Hours_Per_Day: features.social_hours,
        Physical_Activity_Hours_Per_Day: features.physical_activity_hours,
        sleep_hours: features.sleep_hours,
        study_hours: features.study_hours,
        GPA: features.gpa,
        Academic_Pressure: features.academic_pressure,
        Financial_Stress: features.financial_stress,
        Stress_Level: features.stress_level
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Other errors
      throw new Error('Failed to send request: ' + error.message);
    }
  }
}

// Save assessment result to backend
export async function saveAssessmentResult(userId: string, assessmentData: any) {
  try {
    const token = await getIdToken();
    
    const response = await axios.post(
      `${API_BASE}/api/save-assessment`,
      {
        userId,
        ...assessmentData,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
}

// Get user's assessment history
export async function getAssessmentHistory(userId: string) {
  try {
    const token = await getIdToken();
    
    const response = await axios.get(
      `${API_BASE}/api/assessments/${userId}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    throw error;
  }
}

// Health check
export async function checkAPIHealth() {
  try {
    const response = await axios.get(`${API_BASE}/health`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'error' };
  }
}