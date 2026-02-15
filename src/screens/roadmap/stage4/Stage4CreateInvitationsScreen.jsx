import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const FORMAT_POINTS = [
  'Decide on paper, digital, or a hybrid (and why).',
  'Note who might need a mailed version even if most are digital.',
];

const TIMING_POINTS = [
  'Work backwards from your wedding date.',
  'Allow time for printing, addressing, assembling, or approving proofs.',
];

const CONTENT_POINTS = [
  'Names, date, time, venue(s), dress guidance, RSVP details.',
  'Add gentle wording about kids, plus-ones, or transport if needed.',
];

const TEMPLATE_POINTS = [
  'Drop key deadlines into the invitation timeline template.',
  'Share it with anyone helping assemble or send invites.',
];

export default function Stage4CreateInvitationsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage4GuestsInvitations');
  const handleOpenTemplates = () => console.log('Open Invitation Templates');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Create Invitations"
      subtitle="Design them in a way that feels creative, not stressful."
    >
      <SoftInfoCard title="Choose Your Format">
        <View style={styles.bulletList}>
          {FORMAT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Set the Right Timing">
        <View style={styles.bulletList}>
          {TIMING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="What to Include">
        <View style={styles.bulletList}>
          {CONTENT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Attach the Invitation Timeline Template">
        <View style={styles.bulletList}>
          {TEMPLATE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Open Invitation Templates"
        variant="secondary"
        onPress={handleOpenTemplates}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “Your invites don’t need to impress everyone — just reflect you.”
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
