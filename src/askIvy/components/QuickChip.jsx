import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Card from '../../components/ui/Card';
import AppText from '../../components/AppText';
import { colors, gapMd, radius } from '../../theme';

export default function QuickChip({ label, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.chipPressed,
        style,
      ]}
    >
      <Card elevated={false} padding={gapMd} style={styles.chip}>
        <AppText variant="bodySmall" style={styles.label}>
          {label}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.card,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(255,155,133,0.45)',
    borderRadius: radius.card,
  },
  chipPressed: {
    opacity: 0.9,
  },
  label: {
    color: colors.text,
    lineHeight: 20,
  },
});
