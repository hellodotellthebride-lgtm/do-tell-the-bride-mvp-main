import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const ORDER_POINTS = [
  'Decide how many speeches you truly want.',
  'List the order and estimated length for each.',
];

const SHORT_POINTS = [
  'Aim for 3–5 minutes per person to keep energy up.',
  'Encourage pauses for laughs so no one rushes.',
];

const TIPS_POINTS = [
  'Offer cue cards, stools, or mics for nervous speakers.',
  'Remind them eye contact with you is enough — no need to scan the room.',
];

const AVOID_POINTS = [
  'Skip inside jokes that exclude guests.',
  'Avoid mentioning exes, money, or anything you’d cringe hearing aloud.',
];

const NOTE_POINTS = [
  'Let guests know if you two plan to speak together or separately.',
  'Share who to hand the mic to next so transitions stay easy.',
];

export default function Stage6SpeechesScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage6FinalDetails');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Speeches Plan & Guidelines"
      subtitle="Set expectations without awkwardness."
    >
      <SoftInfoCard title="Decide Your Order">
        <View style={styles.bulletList}>
          {ORDER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Keep It Short & Sweet">
        <View style={styles.bulletList}>
          {SHORT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Tips for Nervous Speakers">
        <View style={styles.bulletList}>
          {TIPS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="What to Avoid">
        <View style={styles.bulletList}>
          {AVOID_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="A Gentle Note for Couples">
        <View style={styles.bulletList}>
          {NOTE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“Kind guidance now avoids discomfort later.”</Text>
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
