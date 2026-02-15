import React from 'react';
import { StyleSheet, View } from 'react-native';
import { roadmapColors } from './tokens';

export default function DotsIndicator({ count = 0, index = 0, style }) {
  const safeCount = Math.max(0, Number(count) || 0);
  const safeIndex = Math.max(0, Math.min(safeCount - 1, Number(index) || 0));

  if (safeCount <= 1) return null;

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: safeCount }).map((_, i) => (
        <View key={String(i)} style={[styles.dot, i === safeIndex && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(43,43,43,0.16)',
  },
  dotActive: {
    width: 18,
    borderRadius: 8,
    backgroundColor: roadmapColors.accent,
  },
});

