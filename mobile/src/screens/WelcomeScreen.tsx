import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Brain, Activity, BookOpen, Users, User, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UniMindLogo from '../components/UniMindLogo';

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
  user: any;
}

export default function WelcomeScreen({ onNavigate, user }: WelcomeScreenProps) {
  const features = [
    { icon: Activity, text: 'Science-based assessment', color: '#9333ea' },
    { icon: BookOpen, text: 'Personalized insights', color: '#3b82f6' },
    { icon: Users, text: 'Confidential & secure', color: '#6366f1' }
  ];

  return (
    <LinearGradient
      colors={['#faf5ff', '#eff6ff', '#eef2ff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <UniMindLogo size="md" />
            {user && (
              <TouchableOpacity
                onPress={() => onNavigate('profile')}
                style={styles.profileButton}
              >
                <User size={20} color="#374151" />
              </TouchableOpacity>
            )}
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconWrapper}>
              <Brain size={80} color="#9333ea" />
            </View>
            <Text style={styles.title}>Welcome to UniMind</Text>
            <Text style={styles.subtitle}>
              Your personal mental wellness companion. Take the first step towards understanding your mental health.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, idx) => (
              <View key={idx} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            {user ? (
              <TouchableOpacity
                onPress={() => onNavigate('survey')}
                style={styles.button}
              >
                <LinearGradient
                  colors={['#9333ea', '#3b82f6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Start Assessment</Text>
                  <ArrowRight size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => onNavigate('login')}
                  style={styles.button}
                >
                  <LinearGradient
                    colors={['#9333ea', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.buttonText}>Get Started</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onNavigate('login')}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 48,
  },
  profileButton: {
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    marginBottom: 48,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  ctaContainer: {
    gap: 16,
  },
  button: {
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
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});