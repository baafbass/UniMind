import axios from 'axios';
import { auth } from './firebase';


const API_BASE = __DEV__ 
  ? 'http://192.168.1.104:5000'
  : 'https://unimind.com';

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
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Failed to send request: ' + error.message);
    }
  }
}

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