import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import { roadmapColors, roadmapRadius } from '../../../components/roadmap/tokens';

const ITEMS = [
  { title: 'Celebrate the Moment' },
  { title: 'Choose a Target Date or Season' },
  { title: 'Define Your Top 3 Non-Negotiables' },
  {
    title: 'Set a Guest Range',
    subtitle: 'Even a range (e.g., 80–100) shapes venue and catering costs.',
  },
  { title: 'Set Your Comfortable Budget Range' },
];

export default function FirstFiveThingsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="First 5 Things to Do"
      subtitle="Your starting sequence — simple, logical, flexible."
    >
      {ITEMS.map((item, index) => (
        <View key={item.title} style={styles.card}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>{item.title}</Text>
            {item.subtitle ? (
              <Text style={styles.cardSubLabel}>{item.subtitle}</Text>
            ) : null}
          </View>
        </View>
      ))}
      <Text style={styles.encouragement}>
        These five decisions create the foundation for every later step.
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
  cardSubLabel: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  encouragement: {
    marginTop: 8,
    fontSize: 14,
    color: roadmapColors.mutedText,
    lineHeight: 22,
  },
});
