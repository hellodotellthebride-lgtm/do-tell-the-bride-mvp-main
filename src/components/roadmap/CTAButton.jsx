import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { roadmapColors, roadmapRadius } from './tokens';

export default function CTAButton({ label, onPress, variant = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && styles.pressed,
        style,
      ]}
      hitSlop={8}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: roadmapRadius,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  primary: {
    backgroundColor: roadmapColors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: roadmapColors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#FFFFFF',
  },
  labelSecondary: {
    color: roadmapColors.textDark,
  },
});
