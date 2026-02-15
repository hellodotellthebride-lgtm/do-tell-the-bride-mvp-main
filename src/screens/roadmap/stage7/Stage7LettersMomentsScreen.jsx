import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const LETTER_POINTS = [
  'Write or re-read the note you’ll open on the morning.',
  'Keep it short; honesty beats eloquence.',
];

const PAGES_POINTS = [
  'Print letter pages or use the app notes so handwriting stress disappears.',
  'Store them with your day-of bag so they’re easy to reach.',
];

const MOMENT_POINTS = [
  'Block five quiet minutes together or alone — no phones, no cameras.',
  'Let someone you trust guard that time for you.',
];

export default function Stage7LettersMomentsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage7WeddingWeek');
  const handleCalmCorner = () => console.log('Open Calm Corner');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Letters & Meaningful Moments"
      subtitle="Protect emotional space."
    >
      <SoftInfoCard title="Write or Re-Read Your Morning Letter">
        <View style={styles.bulletList}>
          {LETTER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Use Your Letter Pages">
        <View style={styles.bulletList}>
          {PAGES_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Take a Quiet Moment Together or Alone">
        <View style={styles.bulletList}>
          {MOMENT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Go to Calm Corner"
        variant="secondary"
        onPress={handleCalmCorner}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“This part is just for you.”</Text>
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
