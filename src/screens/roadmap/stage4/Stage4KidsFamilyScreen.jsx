import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const APPROACH_POINTS = [
  'Decide early if your day is adults-only, selective, or fully inclusive.',
  'Write gentle wording you can reuse when questions pop up.',
];

const PLAN_POINTS = [
  'If kids are invited, note sitters, activity corners, or quiet tables.',
  'Share expectations with parents so they can prep snacks, headphones, or clothes.',
];

const FAMILY_POINTS = [
  'Acknowledge relatives’ feelings while still holding your boundary.',
  'Offer alternatives (post-wedding brunch, virtual stream) where it feels right.',
];

export default function Stage4KidsFamilyScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage4GuestsInvitations');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Kids & Family Dynamics"
      subtitle="Handle tricky conversations with clarity and kindness."
    >
      <SoftInfoCard title="Decide Your Approach Early">
        <View style={styles.bulletList}>
          {APPROACH_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Plan for the Kids Who Are Attending">
        <View style={styles.bulletList}>
          {PLAN_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Navigating Family Expectations">
        <View style={styles.bulletList}>
          {FAMILY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>
        “Clear choices early prevent difficult conversations later.”
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
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
