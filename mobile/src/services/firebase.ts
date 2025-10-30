import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence // <-- Add this
} from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
//api keys
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

// Firestore helper functions

// Save user profile
export const saveUserProfile = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Save assessment result
export const saveAssessment = async (userId: string, assessmentData: any) => {
  try {
    // Add to assessments collection
    const assessmentRef = await addDoc(collection(db, 'assessments'), {
      userId,
      ...assessmentData,
      timestamp: new Date().toISOString()
    });

    // Update user's assessment history
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentHistory = userDoc.data().assessmentHistory || [];
      await updateDoc(userRef, {
        assessmentHistory: [
          ...currentHistory,
          {
            id: assessmentRef.id,
            timestamp: new Date().toISOString(),
            prediction: assessmentData.prediction,
            riskLevel: assessmentData.riskLevel
          }
        ],
        lastAssessment: new Date().toISOString()
      });
    }

    return assessmentRef.id;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
};

// Get user's assessment history
export const getAssessmentHistory = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'assessments'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const assessments: any[] = [];
    
    querySnapshot.forEach((doc) => {
      assessments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return assessments;
  } catch (error) {
    console.error('Error getting assessment history:', error);
    throw error;
  }
};

// Get specific assessment
export const getAssessment = async (assessmentId: string) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting assessment:', error);
    throw error;
  }
};