import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const PLAN_POINTS = [
  'Document indoor or covered options with photos so helpers can recreate them.',
  'List any décor swaps (flowers, candles, aisle markers) that change indoors.',
];

const AWARENESS_POINTS = [
  'Share the plan with your planner, venue, band/DJ, photo/video, transport.',
  'Save a one-line text so you can notify everyone quickly if needed.',
];

const DECISION_POINTS = [
  'Choose who makes the weather call and when.',
  'Let yourself stay out of updates once you pass it over.',
];

export default function Stage7RainPlanScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenChecklist = () => console.log('Open Rain Plan Checklist');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Rain Plan"
      subtitle="Remove anxiety around weather."
    >
      <SoftInfoCard title="Your Rain Plan (Backup Setup)">
        <View style={styles.bulletList}>
          {PLAN_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Supplier Awareness">
        <View style={styles.bulletList}>
          {AWARENESS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Who Makes the Call">
        <View style={styles.bulletList}>
          {DECISION_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Rain Plan Checklist"
        variant="secondary"
        onPress={handleOpenChecklist}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“You’re prepared — whatever the weather does.”</Text>
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
