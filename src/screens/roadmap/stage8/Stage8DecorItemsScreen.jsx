import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const SELL_POINTS = [
  'List decor, signage, or accessories you no longer need.',
  'Sell, donate, or gift to friends planning their days.',
];

const PRESERVE_POINTS = [
  'Dry bouquets, press florals, or book cleaning for dresses and suits.',
  'Make an appointment with preservation services when you’re ready.',
];

const KEEP_POINTS = [
  'Choose a handful of sentimental pieces to keep — the rest can move on.',
  'Take photos before you part with anything to keep the memory.',
];

export default function Stage8DecorItemsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Décor, Outfits & Wedding Items"
      subtitle="Deal with physical items gently and intentionally."
    >
      <SoftInfoCard title="Sell or Donate Items">
        <View style={styles.bulletList}>
          {SELL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Preserve or Clean Outfits">
        <View style={styles.bulletList}>
          {PRESERVE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide What to Keep">
        <View style={styles.bulletList}>
          {KEEP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“Your day lives in memory, not storage.”</Text>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  bulletList: {
    marginTop: 8,
    gap: 6,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
