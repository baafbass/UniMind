import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UniMindLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function UniMindLogo({ size = 'md' }: UniMindLogoProps) {
  const sizes = {
    sm: { icon: 24, text: 20, container: 40 },
    md: { icon: 32, text: 24, container: 48 },
    lg: { icon: 48, text: 32, container: 64 }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: sizes[size].container, height: sizes[size].container }]}>
        <LinearGradient
          colors={['#9333ea', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Brain size={sizes[size].icon} color="white" />
        </LinearGradient>
      </View>
      <Text style={[styles.text, { fontSize: sizes[size].text }]}>UniMind</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: '#9333ea',
  },
});