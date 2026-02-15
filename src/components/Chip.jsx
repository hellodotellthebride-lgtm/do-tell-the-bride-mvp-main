import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, hexToRgba } from '../theme';

const Chip = ({ label, done = false, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.chip, done ? styles.chipDone : styles.chipDefault]}
    >
      <Text style={[styles.chipText, done ? styles.chipTextDone : styles.chipTextDefault]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipDefault: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipDone: {
    borderColor: hexToRgba(colors.primary, 0.35),
    backgroundColor: colors.accentChip,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
  },
  chipTextDefault: {
    color: colors.textSecondary,
  },
  chipTextDone: {
    color: colors.primary,
  },
});

export default Chip;
