import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const CLEAR_POINTS = [
  'Keep wording simple, warm, and direct about dates, locations, and dress guidance.',
  'Double-check accessibility notes or travel info are included if needed.',
];

const ECO_POINTS = [
  'Batch deliveries, choose recycled stocks, or use digital RSVPs when it feels right.',
  'Reuse leftover paper for notes or thank-you tags.',
];

const FINAL_POINTS = [
  'Check names, spellings, addresses, and RSVP links once — then send.',
  'Mark who needs follow-ups in your guest tracker instead of relying on your head.',
];

export default function Stage6FinalInvitationsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleUpdateGuests = () => navigation?.navigate?.('Guest Nest');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Finalise & Send Invitations"
      subtitle="Ensure nothing is missed — without over-checking."
    >
      <SoftInfoCard title="Keep It Clear & Simple">
        <View style={styles.bulletList}>
          {CLEAR_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Add Eco-Friendly & Budget-Smart Touches">
        <View style={styles.bulletList}>
          {ECO_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Final Checks Before You Send">
        <View style={styles.bulletList}>
          {FINAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Update Guest Details"
        variant="secondary"
        onPress={handleUpdateGuests}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Clear, kind invitations do their job — no extras required.”</Text>
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
