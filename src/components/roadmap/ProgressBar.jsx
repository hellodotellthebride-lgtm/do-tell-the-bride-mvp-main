import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ProgressBar({
  percent = 0,
  height = 6,
  trackColor = colors.muted,
  fillColor = colors.primary,
  style,
}) {
  const clamped = clamp(percent, 0, 100);

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
