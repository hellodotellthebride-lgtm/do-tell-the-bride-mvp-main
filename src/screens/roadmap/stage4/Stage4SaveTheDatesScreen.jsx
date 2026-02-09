import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const TIMING_POINTS = [
  'Send 8–12 months out for destination weddings, 6–8 months for local.',
  'Adjust based on travel seasons, school holidays, or guest availability.',
];

const WHO_POINTS = [
  'Include everyone you’re confident inviting to the full day.',
  'Skip for evening-only guests if space is limited.',
];

const STYLE_POINTS = [
  'Match your broader vibe, but keep it simple.',
  'Digital cards are perfect if you still need to finalise stationery.',
];

const TEMPLATE_POINTS = [
  'Note wording, dates, and send-by reminders inside the save-the-date template.',
  'Share it with anyone co-managing addresses or email lists.',
];

export default function Stage4SaveTheDatesScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Send Save-the-Dates"
      subtitle="Offer clarity early so guests can plan without a rush."
    >
      <SoftInfoCard title="Pick the Right Time">
        <View style={styles.bulletList}>
          {TIMING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide Who Gets One">
        <View style={styles.bulletList}>
          {WHO_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Choose Your Style">
        <View style={styles.bulletList}>
          {STYLE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Attach the Save-the-Date Template">
        <View style={styles.bulletList}>
          {TEMPLATE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“Early notice gives everyone room to breathe.”</Text>
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
