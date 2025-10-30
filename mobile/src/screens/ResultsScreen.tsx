import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, CheckCircle, TrendingUp, Heart, Phone, MessageCircle, ArrowLeft } from 'lucide-react-native';

interface ResultsScreenProps {
  onNavigate: (screen: string) => void;
  result: {
    prediction: number;
    probabilityPositive: number;
    probabilityNegative: number;
    riskLevel: string;
    formData?: any;
  } | null;
}

export default function ResultsScreen({ onNavigate, result }: ResultsScreenProps) {
  if (!result) {
    return (
      <View style={styles.container}>
        <Text>No results available</Text>
      </View>
    );
  }

  const { riskLevel, probabilityPositive } = result;
  const percentage = (probabilityPositive * 100).toFixed(1);

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Low': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      case 'Very High': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getRiskIcon = () => {
    if (riskLevel === 'Low') {
      return <CheckCircle size={48} color="#10b981" />;
    }
    return <AlertCircle size={48} color={getRiskColor()} />;
  };

  const getRecommendations = () => {
    if (riskLevel === 'Low') {
      return [
        'Continue maintaining your healthy habits',
        'Keep up with regular sleep schedule',
        'Stay connected with friends and family',
        'Continue physical activities',
      ];
    } else if (riskLevel === 'Moderate') {
      return [
        'Consider speaking with a counselor',
        'Practice stress management techniques',
        'Maintain regular sleep schedule (7-9 hours)',
        'Engage in regular physical activity',
        'Connect with supportive friends',
      ];
    } else {
      return [
        'Please reach out to a mental health professional',
        'Contact your university counseling center',
        'Talk to someone you trust about how you\'re feeling',
        'Consider crisis support resources',
        'Practice self-care and prioritize rest',
      ];
    }
  };

  const getCrisisResources = () => {
    return [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        description: '24/7 crisis support',
        icon: Phone
      },
      {
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        description: 'Free 24/7 text support',
        icon: MessageCircle
      },
      {
        name: 'University Counseling Center',
        phone: 'Contact your university',
        description: 'Free counseling for students',
        icon: Heart
      }
    ];
  };

  const percentageNumber = Math.max(0, Math.min(100, Number((probabilityPositive * 100).toFixed(1))));
  const percentageText = `${percentageNumber.toFixed(1)}%`;

  return (
    <LinearGradient
      colors={['#faf5ff', '#eff6ff', '#eef2ff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => onNavigate('welcome')}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#374151" />
              <Text style={styles.backText}>Home</Text>
            </TouchableOpacity>
          </View>

          {/* Results Card */}
          <View style={styles.resultCard}>
            <View style={styles.iconContainer}>
              {getRiskIcon()}
            </View>

            <Text style={styles.title}>Assessment Results</Text>
            
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor() }]}>
              <Text style={styles.riskText}>{riskLevel} Risk</Text>
            </View>

            <View style={styles.percentageContainer}>
              <Text style={styles.percentageLabel}>Depression Risk Score</Text>
              <Text style={[styles.percentage, { color: getRiskColor() }]}>
                {percentage}%
              </Text>
            </View>

            {/*<View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: getRiskColor()
                  }
                ]}
              />
            </View>*/}
          </View>

          {/* Interpretation */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What This Means</Text>
            <Text style={styles.cardText}>
              {riskLevel === 'Low' && 
                'Your responses suggest a low risk of depression. Continue maintaining your healthy lifestyle and positive habits.'
              }
              {riskLevel === 'Moderate' && 
                'Your responses indicate moderate risk factors. Consider implementing stress management strategies and reaching out for support if needed.'
              }
              {(riskLevel === 'High' || riskLevel === 'Very High') && 
                'Your responses suggest significant risk factors that warrant attention. Please consider reaching out to a mental health professional for support.'
              }
            </Text>
          </View>

          {/* Recommendations */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color="#9333ea" />
              <Text style={styles.cardTitle}>Recommendations</Text>
            </View>
            {getRecommendations().map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.bullet} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Crisis Resources (if high risk) */}
          {(riskLevel === 'High' || riskLevel === 'Very High') && (
            <View style={[styles.card, styles.crisisCard]}>
              <Text style={styles.crisisTitle}>Immediate Support Available</Text>
              <Text style={styles.crisisSubtitle}>
                If you're in crisis or need immediate help, these resources are available 24/7:
              </Text>
              
              {getCrisisResources().map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <View key={index} style={styles.resourceItem}>
                    <Icon size={20} color="#dc2626" />
                    <View style={styles.resourceInfo}>
                      <Text style={styles.resourceName}>{resource.name}</Text>
                      <Text style={styles.resourcePhone}>{resource.phone}</Text>
                      <Text style={styles.resourceDesc}>{resource.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <AlertCircle size={16} color="#6b7280" />
            <Text style={styles.disclaimerText}>
              This assessment is not a diagnostic tool. Please consult with a qualified mental health professional for proper evaluation and treatment.
            </Text>
          </View>

          {/* Action Buttons */}
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
              <Text style={styles.buttonText}>Take Another Assessment</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('profile')}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  riskText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  percentageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  percentageLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9333ea',
    marginRight: 12,
    marginTop: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  crisisCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  crisisSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    marginBottom: 12,
  },
  resourceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  resourcePhone: {
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '500',
    marginBottom: 2,
  },
  resourceDesc: {
    fontSize: 13,
    color: '#6b7280',
  },
  disclaimer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  button: {
    marginBottom: 12,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 40,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});