import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useLanguage } from '../contexts/LanguageContext';
import { Spacing } from '../constants/theme';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, language === 'en' && styles.activeButton]}
        onPress={() => setLanguage('en')}
      >
        <ThemedText style={[styles.text, language === 'en' && styles.activeText]}>
          EN
        </ThemedText>
      </Pressable>
      <Pressable
        style={[styles.button, language === 'ja' && styles.activeButton]}
        onPress={() => setLanguage('ja')}
      >
        <ThemedText style={[styles.text, language === 'ja' && styles.activeText]}>
          日本語
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    padding: 4,
  },
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    opacity: 0.6,
  },
  activeText: {
    opacity: 1,
  },
});
