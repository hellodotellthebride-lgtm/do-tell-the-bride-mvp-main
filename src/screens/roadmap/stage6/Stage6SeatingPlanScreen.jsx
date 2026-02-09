import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const BASICS_POINTS = [
  'Confirm table sizes, venue layout, and any must-seat guests (elders, VIPs).',
  'Decide on round, banquet, or mix based on room flow.',
];

const GROUP_POINTS = [
  'Seat people by comfort (energy levels, interests) rather than obligation.',
  'Offer a calm table for parents with babies or guests needing quiet.',
];

const DRAFT_POINTS = [
  'Sketch a quick draft on paper or inside your seating tool.',
  'Mark gaps instead of forcing instant decisions.',
];

const MATCH_POINTS = [
  'Matching outfits or sides are optional — choose what feels easy.',
  'Blend families if it keeps conversation light.',
];

const ETHICAL_POINTS = [
  'Add a table for people who need interpreter, prayer space, or quick exits.',
  'Consider sentimental pairings that will make someone’s night.',
];

const FLOW_POINTS = [
  'Trace how you and servers will move through the room.',
  'Check that anyone with mobility needs isn’t blocked in.',
];

export default function Stage6SeatingPlanScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenBuilder = () => console.log('Open seating plan builder');
  const handleLayoutNotes = () => navigation?.navigate?.('WeddingRoadmap');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Seating Plan Guide"
      subtitle="Make seating decisions feel practical, not political."
    >
      <SoftInfoCard title="Set the Basics">
        <View style={styles.bulletList}>
          {BASICS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Group People in a Kind Way">
        <View style={styles.bulletList}>
          {GROUP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Sketch a First Draft">
        <View style={styles.bulletList}>
          {DRAFT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Matching… or Not">
        <View style={styles.bulletList}>
          {MATCH_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Explore Ethical or Sentimental Options">
        <View style={styles.bulletList}>
          {ETHICAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Stress-Check the Room Flow">
        <View style={styles.bulletList}>
          {FLOW_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Try Seating Plan Builder"
        variant="secondary"
        onPress={handleOpenBuilder}
        style={styles.outlineButton}
      />
      <CTAButton
        label="Check Layout + Venue Notes"
        variant="secondary"
        onPress={handleLayoutNotes}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “You’re creating comfort — not solving every relationship.”
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
