import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const NON_NEGOTIABLE_POINTS = [
  'Circle the experiences or finishes you won’t compromise on.',
  'Note where personal touches matter most.',
  'Highlight anything that needs professional insurance or licensing.',
];

const TIME_POINTS = [
  'Log how much free time you truly have in each month.',
  'Add energy notes — busy season, work travel, family needs.',
  'Remember: rest time counts as real time.',
];

const COST_POINTS = [
  'Compare material + tool costs vs professional quotes.',
  'Include delivery, setup, and teardown so DIY math stays honest.',
  'Track value of your own hours so the choice feels clear.',
];

export default function Stage3DIYorHireScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage3DreamTeam');
  const openDecisionSheet = () => console.log('Open DIY vs Pro Decision Sheet');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="DIY or Hire a Pro?"
      subtitle="Spot where your time, budget, and energy are best spent."
    >
      <SoftInfoCard title="Know Your Non-Negotiables">
        <View style={styles.bulletList}>
          {NON_NEGOTIABLE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="What’s Realistic for Your Time">
        <View style={styles.bulletList}>
          {TIME_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Cost Differences">
        <View style={styles.bulletList}>
          {COST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="DIY vs Pro Decision Sheet"
        variant="secondary"
        onPress={openDecisionSheet}
        style={styles.button}
      />

      <Text style={styles.footer}>
        “Your time and energy count as real costs.”
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
  button: {
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
