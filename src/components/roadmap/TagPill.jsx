import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

export default function TagPill({ label, selected = false, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.pill,
        selected ? styles.pillSelected : styles.pillDefault,
        pressed && onPress ? styles.pillPressed : null,
        style,
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  pillDefault: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.accentChip,
  },
  pillPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontSize: 12,
    letterSpacing: 0.2,
    fontFamily: 'Outfit_500Medium',
  },
  textDefault: {
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.primary,
  },
});
