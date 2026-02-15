import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const DATE_POINTS = [
  'Choose a date that respects budgets, caregiving, and energy.',
  'Share availability polls rather than dictating.',
];

const BASICS_POINTS = [
  'Decide on tone: relaxed dinner, weekend away, creative workshop.',
  'Clarify who’s hosting, contributing, or co-planning.',
];

const LOGISTICS_POINTS = [
  'Keep travel gentle and accommodations accessible.',
  'Note dietary needs, quieter options, and downtime.',
];

const ECO_POINTS = [
  'Choose reusable decor, low-waste favours, or local experiences.',
  'Encourage ride-shares or public transport when possible.',
];

export default function Stage5StagHenScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage5Style');
  const handleOpenPdf = () => console.log('Open Stag & Hen Idea Bank PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Stag & Hen Party Planner"
      subtitle="Keep celebrations joyful, not performative."
    >
      <SoftInfoCard title="Pencil In Dates">
        <View style={styles.bulletList}>
          {DATE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Plan the Basics">
        <View style={styles.bulletList}>
          {BASICS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Logistics & Comfort">
        <View style={styles.bulletList}>
          {LOGISTICS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Eco-Friendly Options">
        <View style={styles.bulletList}>
          {ECO_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Stag & Hen Idea Bank (PDF)"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“These are celebrations — not performance events.”</Text>
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
