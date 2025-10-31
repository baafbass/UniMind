import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import WelcomeScreen from '../src/screens/WelcomeScreen';
import ProfileScreen from '../src/screens/ProfileScreen';
import ResultsScreen from '../src/screens/ResultsScreen';
import SurveyScreen from '../src/screens/SurveyScreen';
import LoginScreen from '../src/screens/Auth/LoginScreen';
import { auth } from '../src/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { sendSurveyAndPredict } from '../src/services/api';
import { saveAssessment, getUserProfile } from '../src/services/firebase';
import { Alert } from 'react-native';

// Main App Component
export default function UniMindApp() {
  
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [user, setUser] = useState<any>(null);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await getUserProfile(firebaseUser.uid);

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userProfile?.name || 'Student',
            studentId: userProfile?.studentId || '',
            ...userProfile
          };
          setUser(userData);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Still set basic user data even if profile fetch fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Student',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    console.log('user data',userData)
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setCurrentScreen('welcome');
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const calculateRiskLevel = (probability: number): string => {
    if (probability < 0.3) return 'Low';
    if (probability < 0.5) return 'Moderate';
    if (probability < 0.7) return 'High';
    return 'Very High';
  };

  const handleSurveyComplete = async (formData: any) => {
  if (!user) {
    Alert.alert('Error', 'You must be logged in to take the assessment');
    setCurrentScreen('login');
    return;
  }

  setPredictionLoading(true);
  try {
    // 1) Get prediction from ML API
    const result = await sendSurveyAndPredict(formData);
    console.log('result', result);

    // 2) Calculate risk level
    const riskLevel = calculateRiskLevel(result.probability_positive);

    // 3) Prepare assessment data
    const assessmentData = {
      prediction: result.prediction,
      probabilityPositive: result.probability_positive,
      probabilityNegative: result.probability_negative,
      riskLevel,
      formData,
      timestamp: new Date().toISOString()
    };

    // 4) set result and navigate immediately (prevent stuck UI)
    setAssessmentResult(assessmentData);
    setCurrentScreen('results');

    // 5) Turn off the spinner now — UI already updated
    setPredictionLoading(false);

    // 6) Save to Firestore in background (still awaited so you can see errors, but spinner is off)
    try {
      await saveAssessment(user.uid, assessmentData);
      console.log('Saved assessment to Firestore');
    } catch (firestoreError) {
      console.error('Firestore save error:', firestoreError);
      // If you want, show user-friendly info but don't block them:
      // Alert.alert('Warning', 'Failed to save assessment to cloud. It will be retried later.');
    }

  } catch (error: any) {
    console.error('Prediction error:', error);
    // Ensure spinner disabled on error
    setPredictionLoading(false);

    Alert.alert(
      'Error',
      error.message || 'Failed to get prediction. Please check your connection and try again.',
      [
        { text: 'Retry', onPress: () => handleSurveyComplete(formData) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }
};


  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf5ff' }}>
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  // Show prediction loading overlay
  if (predictionLoading) {
    const { Text: RNText } = require('react-native');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf5ff' }}>
        <ActivityIndicator size="large" color="#9333ea" />
        <View style={{ marginTop: 20 }}>
          <RNText style={{ fontSize: 18, color: '#374151', textAlign: 'center' }}>
            Analyzing your responses...
          </RNText>
        </View>
      </View>
    );
  }

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