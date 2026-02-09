import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Chip from './Chip';
import ProgressPill from './ProgressPill';

const RoadmapStageCard = ({
  stage,
  showProgress = false,
  onPress,
  onChipPress,
}) => {
  const hasProgress = showProgress && stage.progress > 0;
  const isComplete = stage.progress >= 100;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.card, isComplete && styles.cardComplete]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.stageLabel}>{`STAGE ${stage.stageNumber}`}</Text>
          <Text style={styles.stageTitle}>{stage.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#B7A7A0" />
      </View>
      <Text style={styles.stageDescription}>{stage.description}</Text>

      {hasProgress ? (
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${stage.progress}%` }]} />
          </View>
          <ProgressPill label={`${stage.progress}% complete`} />
        </View>
      ) : (
        <ProgressPill label="0% complete" />
      )}

      <View style={styles.chipWrap}>
        {stage.chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            done={showProgress ? chip.done : false}
            onPress={() => onChipPress?.(chip)}
          />
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    backgroundColor: '#FFF9F5',
    padding: 20,
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  cardComplete: {
    backgroundColor: '#FFF5F1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#B49A8E',
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 6,
  },
  stageTitle: {
    fontSize: 18,
    color: '#2F2925',
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  stageDescription: {
    marginTop: 6,
    marginBottom: 14,
    color: '#8C7A72',
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#F28F79',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
});

export default RoadmapStageCard;
