import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const VOW_POINTS = [
  'If you’re adding personal words, keep them simple and true — no need for poetry.',
  'Borrow prompts if you’re stuck (how we met, what I love, what I’m promising).',
  'If you’re following a cultural or religious format, align early on what’s fixed vs flexible.',
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

const AVOID_POINTS = [
  'Skip inside jokes that exclude guests.',
  'Avoid mentioning exes, money, or anything you’d cringe hearing aloud.',
];

export default function Stage6ToastsVowsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage6FinalDetails');
  const handleOpenGuide = () => console.log('Open Ceremony & Speeches Guide');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Ceremony & Speeches Guide"
      subtitle="Structure the words and moments without pressure."
    >
      <SoftInfoCard title="Plan Your Ceremony Words (If You’re Adding Personal Words)">
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

      <SoftInfoCard title="What to Avoid (So No One Cringes Later)">
        <View style={styles.bulletList}>
          {AVOID_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Ceremony & Speeches Guide"
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
