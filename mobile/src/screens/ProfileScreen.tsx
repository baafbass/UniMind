import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ArrowLeft, User, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  user: any;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, user, onLogout }: ProfileScreenProps) {
  return (
    <LinearGradient
      colors={['#faf5ff', '#eff6ff', '#eef2ff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => onNavigate('welcome')}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#4b5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#9333ea', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <User size={48} color="white" />
            </LinearGradient>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'student@university.edu'}</Text>
          </View>

          {/* Settings Card */}
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Account Settings</Text>
            <View style={styles.settingsList}>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Assessment History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Privacy Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Help & Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={() => {
              onLogout();
              onNavigate('welcome');
            }}
            style={styles.logoutButton}
          >
            <View style={styles.logoutButtonContent}>
              <LogOut size={20} color="white" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </View>
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
  scrollContent: {
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  backText: {
    fontSize: 16,
    color: '#4b5563',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#4b5563',
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});