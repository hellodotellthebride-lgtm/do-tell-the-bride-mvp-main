import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const BOUNDARY_POINTS = [
  'List who can knock on your door, call, or text.',
  'Set a “no decisions” rule for you two — reroute questions to your point person.',
];

const CONTACT_POINTS = [
  'Share a single contact card (planner, MOH, best man) for all urgent needs.',
  'Remind family that if they need something, they go to that person first.',
];

const DECISION_POINTS = [
  'Clarify what decisions are still yours (if any) and which are already handled.',
  'Say it aloud to each other so you both honour the boundary.',
];

export default function Stage7MorningBoundariesScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Morning-of Boundaries & Expectations"
      subtitle="Protect energy and focus."
    >
      <SoftInfoCard title="Morning-Of Boundaries & Expectations">
        <View style={styles.bulletList}>
          {BOUNDARY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Who Can Contact You">
        <View style={styles.bulletList}>
          {CONTACT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Who Handles Decisions">
        <View style={styles.bulletList}>
          {DECISION_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“Clear boundaries create calm.”</Text>
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
