import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const PLAN_POINTS = [
  'Gather references that feel like you, not the internet.',
  'Note budget, fabric preferences, and any cultural details.',
];

const ORDER_POINTS = [
  'Check lead times before you fall in love with a designer.',
  'Confirm what’s included: veil, alterations, storage.',
];

const FITTING_POINTS = [
  'Schedule fittings spaced enough for alterations.',
  'Decide who attends so the room stays calm.',
];

const FINAL_POINTS = [
  'Plan pickup, steaming, and safe storage.',
  'Note transport needs and who brings the dress the day of.',
];

export default function Stage5WeddingDressScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage5Style');
  const handleSaveIdeas = () => console.log('Save dress ideas + notes');
  const handleTrackBudget = () => navigation?.navigate?.('Budget Buddy');

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Plan Your Wedding Dress"
      subtitle="Structure the process so it stays exciting and calm."
    >
      <SoftInfoCard title="Explore and Set Your Dress Plan">
        <View style={styles.bulletList}>
          {PLAN_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Order Your Dress">
        <View style={styles.bulletList}>
          {ORDER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Plan Your Fittings">
        <View style={styles.bulletList}>
          {FITTING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Final Fitting & Pick-Up">
        <View style={styles.bulletList}>
          {FINAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Save Dress Ideas + Notes"
        variant="secondary"
        onPress={handleSaveIdeas}
        style={styles.outlineButton}
      />
      <CTAButton
        label="Track Payments + Budget Buddy"
        variant="secondary"
        onPress={handleTrackBudget}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “Your dress journey should feel exciting — not overwhelming.”
      </Text>
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
    marginTop: 12,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
