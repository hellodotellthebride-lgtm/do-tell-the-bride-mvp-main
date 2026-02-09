import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const REFLECT_POINTS = [
  'Jot down what moments felt most alive or meaningful.',
  'Keep notes private if that helps you be honest.',
];

const CAPTURE_POINTS = [
  'Write, voice-note, or film a quick reflection before memories blur.',
  'Add anything you’d love future-you to remember.',
];

export default function Stage8EmotionalClosureScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleSaveNotes = () => console.log('Add to Notes for emotional closure');

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Emotional Closure"
      subtitle="Acknowledge the emotional comedown."
    >
      <SoftInfoCard title="Reflect on What Mattered Most">
        <View style={styles.bulletList}>
          {REFLECT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Capture Final Thoughts or Memories">
        <View style={styles.bulletList}>
          {CAPTURE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Add to Notes"
        variant="secondary"
        onPress={handleSaveNotes}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“It’s normal to feel a mix of everything after a big moment.”</Text>
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
