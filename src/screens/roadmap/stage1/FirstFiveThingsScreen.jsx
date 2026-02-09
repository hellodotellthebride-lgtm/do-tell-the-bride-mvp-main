import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import { roadmapColors, roadmapRadius } from '../../../components/roadmap/tokens';

const ITEMS = [
  'Celebrate the Moment',
  'Rough Timeline & Season',
  'Choose Your Early Non-Negotiables',
  'Decide Rough Guest Count',
  'Set a Realistic Budget Shape',
];

export default function FirstFiveThingsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="First 5 Things to Do"
      subtitle="Mini checklist, major calm."
    >
      {ITEMS.map((label, index) => (
        <View key={label} style={styles.card}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.cardLabel}>{label}</Text>
        </View>
      ))}
      <Text style={styles.encouragement}>
        None of this needs to happen today. This is your gentle starting line.
      </Text>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: roadmapRadius,
    backgroundColor: roadmapColors.surface,
    marginBottom: 12,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,155,133,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  numberText: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.accent,
  },
  cardLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  encouragement: {
    marginTop: 8,
    fontSize: 14,
    color: roadmapColors.mutedText,
    lineHeight: 22,
  },
});
