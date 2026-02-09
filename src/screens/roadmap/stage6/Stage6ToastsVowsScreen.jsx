import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const VOW_POINTS = [
  'Write a handful of honest lines — no need for poetry.',
  'Borrow prompts if you’re stuck (how we met, what I love, what I promise).',
];

const PRACTICE_POINTS = [
  'Read them quietly once or twice to see how they feel.',
  'Record a voice memo to hear pacing without judgement.',
];

const SPEAKER_POINTS = [
  'List who is speaking and roughly when.',
  'Share timing guidance so no one feels rushed or longwinded.',
];

const GUIDELINE_POINTS = [
  'Offer simple guardrails: thank-yous, stories, no surprises that cause discomfort.',
  'Let speakers know they can ask for help editing.',
];

export default function Stage6ToastsVowsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuide = () => console.log('Open Wedding Toasts & Vows Guide');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Wedding Toasts & Vows"
      subtitle="Remove pressure from emotional moments."
    >
      <SoftInfoCard title="Write Your Vows Without Overthinking">
        <View style={styles.bulletList}>
          {VOW_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Practise in a Low-Pressure Way">
        <View style={styles.bulletList}>
          {PRACTICE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Plan Who’s Speaking & When">
        <View style={styles.bulletList}>
          {SPEAKER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Share Gentle Guidelines">
        <View style={styles.bulletList}>
          {GUIDELINE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Wedding Toasts & Vows Guide"
        variant="secondary"
        onPress={handleOpenGuide}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Sincere always lands — polished is optional.”</Text>
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
