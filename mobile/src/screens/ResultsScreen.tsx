import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Home, AlertCircle, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UniMindLogo from '../components/UniMindLogo';

interface ResultsScreenProps {
  onNavigate: (screen: string) => void;
  result: any;
}

export default function ResultsScreen({ onNavigate, result }: ResultsScreenProps) {
  const isDepressed = result?.prediction === 'Depressed';

  const recommendations = isDepressed ? [
    { title: 'Speak with a counselor', description: 'Professional support can make a significant difference' },
    { title: 'Maintain sleep schedule', description: 'Aim for 7-9 hours of quality sleep' },
    { title: 'Stay physically active', description: 'Regular exercise helps improve mood' },
    { title: 'Connect with others', description: 'Social support is crucial for mental health' }
  ] : [
    { title: 'Keep up healthy habits', description: 'Continue your current wellness practices' },
    { title: 'Stay balanced', description: 'Maintain work-life balance in your routine' },
    { title: 'Check in regularly', description: 'Monitor your mental health periodically' },
    { title: 'Support others', description: 'Help friends who might be struggling' }
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
            <TouchableOpacity
              onPress={() => onNavigate('welcome')}
              style={styles.homeButton}
            >
              <Home size={20} color="#374151" />
            </TouchableOpacity>
            <UniMindLogo size="sm" />
          </View>

          {/* Result Card */}
          <LinearGradient
            colors={isDepressed ? ['#fff7ed', '#fef2f2'] : ['#f0fdf4', '#ecfdf5']}
            style={styles.resultCard}
          >
            <View style={styles.resultHeader}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isDepressed ? '#fed7aa' : '#bbf7d0' }
                ]}
              >
                {isDepressed ? (
                  <AlertCircle size={40} color="#ea580c" />
                ) : (
                  <CheckCircle size={40} color="#16a34a" />
                )}
              </View>
              <Text style={styles.resultTitle}>Assessment Complete</Text>
              <Text
                style={[
                  styles.resultSubtitle,
                  { color: isDepressed ? '#c2410c' : '#15803d' }
                ]}
              >
                {isDepressed ? 'Signs of Depression Detected' : 'No Depression Indicators'}
              </Text>
            </View>

            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {isDepressed
                  ? 'Based on your responses, you may be experiencing symptoms of depression. This is a common challenge many students face, and support is available.'
                  : 'Based on your responses, you appear to be managing well. Continue maintaining healthy habits and stay mindful of your mental health.'}
              </Text>
            </View>

            {isDepressed && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  <Text style={styles.warningBold}>Important:</Text> This assessment is not a diagnosis. Please consult with a mental health professional for proper evaluation and support.
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* Recommendations */}
          <View style={styles.recommendationsCard}>
            <Text style={styles.recommendationsTitle}>Recommendations for You</Text>
            <View style={styles.recommendationsList}>
              {recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recommendationItem}>
                  <View style={styles.recommendationNumber}>
                    <Text style={styles.recommendationNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationItemTitle}>{rec.title}</Text>
                    <Text style={styles.recommendationItemDescription}>{rec.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => onNavigate('survey')}
              style={styles.primaryButton}
            >
              <LinearGradient
                colors={['#9333ea', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.primaryButtonText}>Take Assessment Again</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigate('welcome')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Return Home</Text>
            </TouchableOpacity>
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
    marginBottom: 32,
  },
  homeButton: {
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
  resultCard: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  warningBox: {
    backgroundColor: '#fed7aa',
    borderWidth: 2,
    borderColor: '#fdba74',
    borderRadius: 16,
    padding: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#7c2d12',
  },
  warningBold: {
    fontWeight: '600',
  },
  recommendationsCard: {
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
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  recommendationsList: {
    gap: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    gap: 16,
  },
  recommendationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  recommendationItemDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
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
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
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