import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const VENUE_POINTS = [
  'Compare the calm of one venue with the possibilities of two.',
  'List how each option affects travel, décor, and downtime.',
  'Note any traditions that influence the choice.',
];

const TIMELINE_POINTS = [
  'Sketch generous travel windows if venues differ.',
  'Capture how guests arrive, wait, and move without rush.',
  'Highlight quiet breaks for you two.',
];

const CEREMONY_POINTS = [
  'Clarify if it’s legal, religious, symbolic, or a blend.',
  'Flag who needs to be involved (officiant, readers, elders).',
  'Capture any paperwork or rehearsals to schedule.',
];

const ORDER_POINTS = [
  'Draft a loose flow (arrival, vows, photos, dinner, dancing).',
  'Keep it pencil-only. This is a guide, not a contract.',
  'Focus on how you want each moment to feel.',
];

export default function Stage2CeremonyReceptionScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage2EarlyDecisions');
  const handleAddNotes = () => navigation?.navigate?.('WeddingHub');

  return (
    <StageScreenContainer
      backLabel="Back to Your Early Decisions"
      onBackPress={handleBack}
      title="Ceremony vs Reception Setup"
      subtitle="Explore structures without locking yourself in."
    >
      <SoftInfoCard title="One venue vs two" body="Look at the practical ripple effects.">
        <View style={styles.bulletList}>
          {VENUE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="If separate, sketch a loose timeline">
        <View style={styles.bulletList}>
          {TIMELINE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Type of ceremony">
        <View style={styles.bulletList}>
          {CEREMONY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Rough running order (draft only)">
        <View style={styles.bulletList}>
          {ORDER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
        <CTAButton
          label="Add to Ceremony Notes"
          variant="secondary"
          onPress={handleAddNotes}
          style={styles.softButton}
        />
      </SoftInfoCard>

      <Text style={styles.footer}>“You’re designing how the day feels — not just where people stand.”</Text>
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
  softButton: {
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
