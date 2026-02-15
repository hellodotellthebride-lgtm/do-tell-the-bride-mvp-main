import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressBar from './ProgressBar';
import { colors } from '../../theme';

export default function RoadmapPaceCard({
  title = 'Your Roadmap Pace',
  statusLabel = 'In progress',
  progressPercent = 0,
  stageLine = '',
}) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{statusLabel}</Text>
        </View>
      </View>

      <ProgressBar
        percent={progressPercent}
        height={7}
        trackColor={colors.muted}
        fillColor={colors.primary}
        style={styles.progress}
      />

      {stageLine ? <Text style={styles.stageLine}>{stageLine}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.accentChip,
  },
  pillText: {
    fontSize: 12,
    letterSpacing: 0.2,
    color: colors.primary,
    fontFamily: 'Outfit_600SemiBold',
  },
  progress: {
    marginBottom: 14,
  },
  stageLine: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    fontFamily: 'Outfit_400Regular',
  },
});
