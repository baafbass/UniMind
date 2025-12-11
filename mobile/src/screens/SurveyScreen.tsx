import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, ArrowRight, Users, Activity, Moon, BookOpen, TrendingUp, DollarSign, AlertCircle,GraduationCap,LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

interface SurveyScreenProps {
  onNavigate: (screen: string) => void;
  onComplete: (formData: FormDataState) => void;
}

type FormDataState = {
  extracurricular_hours: number;
  social_hours: number;
  physical_activity_hours: number;
  sleep_hours: number;
  study_hours: number;
  gpa: number;
  academic_pressure: number;
  financial_stress: number;
  stress_level: number;
};

interface Question {
  id: keyof FormDataState; 
  title: string;
  description: string;
  icon: LucideIcon;
  min: number;
  max: number;
  unit: string;
  labels?: string[];
}

export default function SurveyScreen({ onNavigate, onComplete }: SurveyScreenProps) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    extracurricular_hours: 2,
    social_hours: 3,
    physical_activity_hours: 1,
    sleep_hours: 7,
    study_hours: 4,
    gpa: 3.11,
    academic_pressure: 3,
    financial_stress: 2,
    stress_level: 3
  });

  const questions: Question[] = [
    {
      id: 'extracurricular_hours',
      title: 'Extracurricular Activities',
      description: 'Hours per day spent on clubs, sports, or other activities',
      icon: Users,
      min: 0,
      max: 8,
      unit: 'hours/day'
    },
    {
      id: 'social_hours',
      title: 'Social Interaction',
      description: 'Hours per day spent with friends and social activities',
      icon: Users,
      min: 0,
      max: 12,
      unit: 'hours/day'
    },
    {
      id: 'physical_activity_hours',
      title: 'Physical Activity',
      description: 'Hours per day of exercise or physical movement',
      icon: Activity,
      min: 0,
      max: 6,
      unit: 'hours/day'
    },
    {
      id: 'sleep_hours',
      title: 'Sleep Duration',
      description: 'Average hours of sleep per night',
      icon: Moon,
      min: 3,
      max: 12,
      unit: 'hours/night'
    },
    {
      id: 'study_hours',
      title: 'Study Time',
      description: 'Hours per day dedicated to studying',
      icon: BookOpen,
      min: 0,
      max: 14,
      unit: 'hours/day'
    },
    {
      id: 'academic_pressure',
      title: 'Academic Pressure',
      description: 'How much pressure do you feel from academic demands?',
      icon: TrendingUp,
      min: 1,
      max: 5,
      unit: '',
      labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    {
      id: 'financial_stress',
      title: 'Financial Stress',
      description: 'How stressed are you about financial matters?',
      icon: DollarSign,
      min: 1,
      max: 5,
      unit: '',
      labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
      {
      id: 'gpa',
      title: 'Grade Point Average',
      description: 'the sum of all your course grades throughout your high school career divided by the total number of credits',
      icon: GraduationCap,
      min: 0,
      max: 4,
      unit: ''
    },
    {
      id: 'stress_level',
      title: 'Overall Stress Level',
      description: 'Your general stress level in daily life',
      icon: AlertCircle,
      min: 1,
      max: 5,
      unit: '',
      labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    }
  ];

  const currentQuestion = questions[step];
  const Icon = currentQuestion.icon;

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onNavigate('welcome');
    }
  };

  const progress = ((step + 1) / questions.length) * 100;

  const value = formData[currentQuestion.id];
  let displayText: string | number;

  if (currentQuestion.id === 'gpa') {
    displayText = value.toFixed(2);
  } else if (currentQuestion.labels) {
    displayText = currentQuestion.labels[value - currentQuestion.min] || value;
  } else {
    displayText = value;
  }

  return (
    <LinearGradient
      colors={['#faf5ff', '#eff6ff', '#eef2ff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.stepText}>
              {step + 1} of {questions.length}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#9333ea', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.questionCard}>
              <View style={styles.iconContainer}>
                <Icon size={32} color="#9333ea" />
              </View>

              <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
              <Text style={styles.questionDescription}>{currentQuestion.description}</Text>

              <View style={styles.valueContainer}>
                <Text style={styles.value}>{currentQuestion.id === 'gpa'? displayText = value.toFixed(2):formData[currentQuestion.id]}</Text>
                {currentQuestion.unit && (
                  <Text style={styles.unit}>{currentQuestion.unit}</Text>
                )}
              </View>

              <Slider
                style={styles.slider}
                minimumValue={currentQuestion.min}
                maximumValue={currentQuestion.max}
                step={currentQuestion.id === 'gpa' ? 0.01 : 1}
                value={formData[currentQuestion.id]}
                onValueChange={(value) =>
                  setFormData({ ...formData, [currentQuestion.id]: value })
                }
                minimumTrackTintColor="#9333ea"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#9333ea"
              />

              {currentQuestion.labels && (
                <View style={styles.labelsContainer}>
                  {currentQuestion.labels.map((label, idx) => (
                    <Text key={idx} style={styles.label}>
                      {label}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>


          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButton}
          >
            <LinearGradient
              colors={['#9333ea', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {step < questions.length - 1 ? 'Next' : 'Complete Assessment'}
              </Text>
              <ArrowRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  progressBarContainer: {
    marginBottom: 32,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  questionDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 32,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  unit: {
    fontSize: 16,
    color: '#6b7280',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    flex: 1,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});