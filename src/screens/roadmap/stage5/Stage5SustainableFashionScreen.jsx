import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const SECOND_HAND_POINTS = [
  'Browse consignment, sample sales, or rental studios first.',
  'Note what can be tailored so it still feels custom.',
];

const SWAP_POINTS = [
  'Borrow accessories, veils, or jewellery from friends.',
  'Choose fabrics or designers with transparent sourcing.',
];

const WASTE_POINTS = [
  'Plan where outfits live after the wedding (resell, donate, rewear).',
  'Keep packaging minimal — return garment bags when you can.',
];

const BUDGET_POINTS = [
  'Log every outfit cost (ceremony, rehearsal, brunch).',
  'Use Budget Buddy to see trade-offs without guilt.',
];

export default function Stage5SustainableFashionScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenPdf = () => console.log('Open Sustainable Fashion Guide PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Sustainable & Budget-Friendly Fashion"
      subtitle="Ease into thoughtful choices that still feel special."
    >
      <SoftInfoCard title="Shop Second-Hand or Rent">
        <View style={styles.bulletList}>
          {SECOND_HAND_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Make Small Swaps">
        <View style={styles.bulletList}>
          {SWAP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Reduce Fashion Waste">
        <View style={styles.bulletList}>
          {WASTE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Keep It Budget-Friendly">
        <View style={styles.bulletList}>
          {BUDGET_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Sustainable Fashion Guide (PDF)"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Small decisions make a meaningful difference.”</Text>
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
  outlineButton: {
    borderColor: roadmapColors.accent,
    marginTop: roadmapSpacing.sectionGap,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
