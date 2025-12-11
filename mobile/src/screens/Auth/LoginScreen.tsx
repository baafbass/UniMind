import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UniMindLogo from '../../components/UniMindLogo';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin: (userData: any) => void;
}

export default function LoginScreen({ onNavigate, onLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    studentId: ''
  });

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    if (isSignUp && (!formData.name || !formData.studentId)) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    await updateProfile(userCredential.user, {
      displayName: formData.name
    });

    const firestorePromise = setDoc(doc(db, 'users', userCredential.user.uid), {
      name: formData.name,
      email: formData.email,
      studentId: formData.studentId,
      createdAt: new Date().toISOString(),
      assessmentHistory: []
    });

    await Promise.race([
      firestorePromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore write timeout')), 15000)
      )
    ]);

    const userData = {
      uid: userCredential.user.uid,
      name: formData.name,
      email: formData.email,
      studentId: formData.studentId
    };

    onLogin(userData);
    Alert.alert('Success', 'Account created successfully!');
    onNavigate('welcome');
  } catch (error: any) {
    console.error('Full error object:', error);
    
    let errorMessage = 'An error occurred during sign up';
    
    if (error.message === 'Firestore write timeout') {
      errorMessage = 'Connection timeout. Please check your internet and try again.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code?.includes('firestore')) {
      errorMessage = 'Database connection failed: ' + error.message;
    }
    
    Alert.alert('Sign Up Error', errorMessage);
  } finally {
    setLoading(false);
  }
};
  
  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userData = {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || 'Student',
        email: userCredential.user.email
      };

      onLogin(userData);
      Alert.alert('Success', 'Logged in successfully!');
      onNavigate('welcome');
    } catch (error: any) {
      let errorMessage = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      Alert.alert('Login Error', errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isSignUp) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  return (
    <LinearGradient
      colors={['#faf5ff', '#eff6ff', '#eef2ff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity
              onPress={() => onNavigate('welcome')}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#4b5563" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <UniMindLogo size="lg" />
              <Text style={styles.subtitle}>
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </Text>
            </View>

            <View style={styles.formCard}>
              {isSignUp && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="John Doe"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholderTextColor="#9ca3af"
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Student ID</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="STU123456"
                      value={formData.studentId}
                      onChangeText={(text) => setFormData({ ...formData, studentId: text })}
                      placeholderTextColor="#9ca3af"
                      editable={!loading}
                    />
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#d1d5db', '#9ca3af'] : ['#9333ea', '#3b82f6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsSignUp(!isSignUp)}
                style={styles.toggleButton}
                disabled={loading}
              >
                <Text style={styles.toggleText}>
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4b5563',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 20,
    color: '#374151',
    marginTop: 12,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    padding: 8,
  },
  toggleText: {
    color: '#6b7280',
    fontSize: 14,
  },
});