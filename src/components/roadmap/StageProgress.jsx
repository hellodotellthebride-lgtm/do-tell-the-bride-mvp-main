import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { roadmapColors, roadmapRadius } from './tokens';

export default function StageProgress({ complete = 0, total = 0, style }) {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;
  const safeComplete =
    Number.isFinite(complete) && complete > 0 ? Math.min(complete, safeTotal) : 0;
  const ratio = safeTotal > 0 ? safeComplete / safeTotal : 0;
  const percent = safeTotal > 0 ? Math.round(ratio * 100) : 0;

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        <Text style={styles.label}>Stage progress</Text>
        <Text style={styles.value}>
          {safeComplete} / {safeTotal} ({percent}%)
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 12,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
  },
  track: {
    height: 6,
    borderRadius: roadmapRadius,
    backgroundColor: 'rgba(43,43,43,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: roadmapColors.accent,
    borderRadius: roadmapRadius,
  },
});

