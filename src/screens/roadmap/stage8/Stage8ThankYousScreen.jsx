import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const LIST_POINTS = [
  'Write names as you remember them — friends, family, vendors, helpers.',
  'Add notes on what they did so your thanks feels personal.',
];

const FORMAT_POINTS = [
  'Choose handwritten notes, voice notes, or simple texts — whatever suits your energy.',
  'Send in small batches so it never feels overwhelming.',
];

const WORDING_POINTS = [
  'Keep it short: what they did, how you felt, what it meant.',
  'It’s okay to reuse a structure — sincerity matters more than new words.',
];

export default function Stage8ThankYousScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Thank-Yous & Gratitude"
      subtitle="Make thank-yous feel personal, not overwhelming."
    >
      <SoftInfoCard title="List Who Needs a Thank-You">
        <View style={styles.bulletList}>
          {LIST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide Handwritten or Digital">
        <View style={styles.bulletList}>
          {FORMAT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Draft Thank-You Wording">
        <View style={styles.bulletList}>
          {WORDING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“There’s no perfect wording — sincerity is enough.”</Text>
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
