import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const TRACK_POINTS = [
  'Log responses in one tool so numbers stay consistent everywhere.',
  'Note meal choices, plus-ones, and accessibility notes next to each name.',
];

const QUESTION_POINTS = [
  'Ask what information would make the day calmer for you (songs, allergies, pronouns).',
  'Keep forms short so guests reply faster.',
];

const FOLLOW_POINTS = [
  'Send a kind reminder a week after your deadline.',
  'Offer multiple ways to respond (tap, reply, quick call).',
];

export default function Stage4ManageRSVPScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuestList = () => navigation?.navigate?.('Guest Nest');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Manage RSVPs"
      subtitle="Keep responses organised without stress or urgency."
    >
      <SoftInfoCard title="Track With Ease">
        <View style={styles.bulletList}>
          {TRACK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Customise Your Questions">
        <View style={styles.bulletList}>
          {QUESTION_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Follow Up Gently">
        <View style={styles.bulletList}>
          {FOLLOW_POINTS.map((point) => (
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

      <Text style={styles.footer}>“RSVPs arrive slowly — that’s normal.”</Text>
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
