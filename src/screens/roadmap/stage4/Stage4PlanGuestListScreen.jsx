import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const INNER_CIRCLE_POINTS = [
  'Write down the people you can’t imagine the day without.',
  'Start with the two of you, then immediate family, then chosen family.',
];

const VENUE_POINTS = [
  'Sense-check how each venue option affects capacity and vibe.',
  'Note any non-negotiable limits (fire codes, budget per person).',
];

const CATEGORY_POINTS = [
  'Group guests loosely (family, friends, work, other).',
  'Label optional or “later” lists to remove pressure now.',
];

const FLOWCHART_POINTS = [
  'Use your guest list flowchart to make consistent decisions.',
  'If you hesitate, park the name rather than forcing a call.',
];

const TRUST_POINTS = [
  'Check in with how the list feels — crowded or calm.',
  'Let your intuition override outside opinions.',
];

export default function Stage4PlanGuestListScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuestList = () => navigation?.navigate?.('Guest Nest');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Plan Your Guest List"
      subtitle="Build a list that feels honest to your priorities and energy."
    >
      <SoftInfoCard title="Start With Your Inner Circle">
        <View style={styles.bulletList}>
          {INNER_CIRCLE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Consider Your Venue">
        <View style={styles.bulletList}>
          {VENUE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Create Guest Categories">
        <View style={styles.bulletList}>
          {CATEGORY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Use the Guest List Flowchart">
        <View style={styles.bulletList}>
          {FLOWCHART_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Trust Your Gut">
        <View style={styles.bulletList}>
          {TRUST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Open Guest List"
        variant="secondary"
        onPress={handleOpenGuestList}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “There’s no perfect guest list — only one that feels right to you.”
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
