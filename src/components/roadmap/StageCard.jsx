import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProgressBar from './ProgressBar';
import TagPill from './TagPill';
import { colors } from '../../theme';
import { hexToRgba } from '../../theme/colors';

const getStatus = (percent) => {
  if (percent >= 100) return 'complete';
  if (percent > 0) return 'inProgress';
  return 'notStarted';
};

export default function StageCard({ stage, onPress, onTagPress }) {
  const status = getStatus(stage?.progress ?? 0);

  const pill = useMemo(() => {
    if (status === 'complete') return { label: 'Completed', style: styles.statusComplete, text: styles.statusTextComplete };
    if (status === 'inProgress') return { label: 'In progress', style: styles.statusInProgress, text: styles.statusTextInProgress };
    return { label: 'Not started', style: styles.statusNotStarted, text: styles.statusTextNotStarted };
  }, [status]);

  const pills = useMemo(() => {
    const chips = Array.isArray(stage?.chips) ? stage.chips : [];
    if (chips.length <= 3) return chips.map((chip) => ({ type: 'chip', chip }));
    return [
      { type: 'chip', chip: chips[0] },
      { type: 'chip', chip: chips[1] },
      { type: 'more', label: `+${chips.length - 2} more` },
    ];
  }, [stage?.chips]);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.topRow}>
        <Text style={styles.microLabel}>{`STAGE ${stage.stageNumber}`}</Text>
        <View style={styles.rightRow}>
          <View style={[styles.statusPill, pill.style]}>
            <Text style={[styles.statusText, pill.text]}>{pill.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </View>

      <Text style={styles.title}>{stage.title}</Text>
      <Text style={styles.description}>{stage.description}</Text>

      {typeof stage?.total === 'number' && stage.total > 0 ? (
        <View style={styles.progressRow}>
          <ProgressBar
            percent={stage.progress}
            height={5}
            trackColor={colors.muted}
            fillColor={colors.primary}
            style={styles.progress}
          />
          <Text style={styles.progressCount}>
            {stage.complete} of {stage.total}
          </Text>
        </View>
      ) : null}

      <View style={styles.pillsWrap}>
        {pills.map((pillItem) => {
          if (pillItem.type === 'more') {
            return (
              <TagPill
                key="more"
                label={pillItem.label}
                onPress={onPress}
              />
            );
          }
          const chip = pillItem.chip;
          return (
            <TagPill
              key={chip.id}
              label={chip.label}
              selected={!!chip.done}
              onPress={() => onTagPress?.(chip)}
            />
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  microLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textSecondary,
    fontFamily: 'Outfit_600SemiBold',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    letterSpacing: 0.2,
    fontFamily: 'Outfit_600SemiBold',
  },
  statusInProgress: {
    backgroundColor: colors.primary,
  },
  statusTextInProgress: {
    color: '#FFFFFF',
  },
  statusNotStarted: {
    backgroundColor: hexToRgba(colors.muted, 0.9),
  },
  statusTextNotStarted: {
    color: colors.textSecondary,
  },
  statusComplete: {
    backgroundColor: hexToRgba(colors.success, 0.16),
  },
  statusTextComplete: {
    color: colors.success,
  },
  title: {
    fontSize: 22,
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    fontFamily: 'Outfit_400Regular',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progress: {
    flex: 1,
  },
  progressCount: {
    marginLeft: 12,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Outfit_500Medium',
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
});
