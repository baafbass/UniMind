import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Calendar, LogOut, ArrowLeft, TrendingUp, Clock } from 'lucide-react-native';
import { getAssessmentHistory } from '../services/firebase';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  user: {
    uid: string;
    name: string;
    email: string;
    studentId?: string;
  } | null;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, user, onLogout }: ProfileScreenProps) {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const history = await getAssessmentHistory(user.uid);
      setAssessments(history);
    } catch (error) {
      console.error('Error loading assessments:', error);
      Alert.alert('Error', 'Failed to load assessment history');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout, style: 'destructive' }
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      case 'Very High': return '#dc2626';
      default: return '#6b7280';
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view profile</Text>
      </View>
    );
  }

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

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#9333ea', '#3b82f6']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>

            <Text style={styles.name}>{user.name}</Text>
            
            <View style={styles.infoRow}>
              <Mail size={16} color="#6b7280" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>

            {user.studentId && (
              <View style={styles.infoRow}>
                <User size={16} color="#6b7280" />
                <Text style={styles.infoText}>ID: {user.studentId}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleLogoutPress}
              style={styles.logoutButton}
            >
              <LogOut size={18} color="#dc2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Assessment History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={24} color="#9333ea" />
              <Text style={styles.sectionTitle}>Assessment History</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9333ea" />
              </View>
            ) : assessments.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={48} color="#d1d5db" />
                <Text style={styles.emptyText}>No assessments yet</Text>
                <Text style={styles.emptySubtext}>
                  Take your first assessment to track your mental wellness
                </Text>
                <TouchableOpacity
                  onPress={() => onNavigate('survey')}
                  style={styles.emptyButton}
                >
                  <LinearGradient
                    colors={['#9333ea', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.buttonText}>Start Assessment</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.historyList}>
                {assessments.map((assessment, index) => (
                  <View key={assessment.id || index} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyLeft}>
                        <View
                          style={[
                            styles.riskIndicator,
                            { backgroundColor: getRiskColor(assessment.riskLevel) }
                          ]}
                        />
                        <View>
                          <Text style={styles.historyRisk}>{assessment.riskLevel} Risk</Text>
                          <View style={styles.historyDate}>
                            <Clock size={12} color="#9ca3af" />
                            <Text style={styles.historyDateText}>
                              {formatDate(assessment.timestamp)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.historyScore,
                          { color: getRiskColor(assessment.riskLevel) }
                        ]}
                      >
                        {(assessment.probabilityPositive * 100).toFixed(0)}%
                      </Text>
                    </View>

                    {/* Key Factors */}
                    {assessment.formData && (
                      <View style={styles.factorsContainer}>
                        <Text style={styles.factorsTitle}>Key Metrics:</Text>
                        <View style={styles.factorsGrid}>
                          <View style={styles.factorItem}>
                            <Text style={styles.factorLabel}>Sleep</Text>
                            <Text style={styles.factorValue}>
                              {assessment.formData.sleep_hours}h
                            </Text>
                          </View>
                          <View style={styles.factorItem}>
                            <Text style={styles.factorLabel}>Study</Text>
                            <Text style={styles.factorValue}>
                              {assessment.formData.study_hours}h
                            </Text>
                          </View>
                          <View style={styles.factorItem}>
                            <Text style={styles.factorLabel}>Stress</Text>
                            <Text style={styles.factorValue}>
                              {assessment.formData.stress_level}/5
                            </Text>
                          </View>
                          <View style={styles.factorItem}>
                            <Text style={styles.factorLabel}>GPA</Text>
                            <Text style={styles.factorValue}>
                              {assessment.formData.gpa.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Stats Summary */}
          {assessments.length > 0 && (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Summary</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{assessments.length}</Text>
                  <Text style={styles.statLabel}>Total Assessments</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {assessments[0]?.riskLevel || 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Latest Status</Text>
                </View>
              </View>
            </View>
          )}
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
  profileCard: {
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
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
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
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  historyRisk: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  historyDateText: {
    fontSize: 13,
    color: '#9ca3af',
    marginLeft: 4,
  },
  historyScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  factorsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  factorsTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  factorItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 6,
  },
  factorLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  factorValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333ea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});