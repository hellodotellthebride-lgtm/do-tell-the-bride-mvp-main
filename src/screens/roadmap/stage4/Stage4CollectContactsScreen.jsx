import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const STORAGE_POINTS = [
  'Decide on one home (Guest Nest, spreadsheet, shared doc).',
  'Give access to whoever needs to help.',
];

const ASK_POINTS = [
  'Send a kind message explaining why you’re gathering details early.',
  'Request names, pronouns, email, phone, and postal address in one go.',
];

const CENTRAL_POINTS = [
  'Log replies as you receive them so nothing lives in DMs.',
  'Tag people who still need an update or reminder.',
];

export default function Stage4CollectContactsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage4GuestsInvitations');
  const handleOpenContacts = () => console.log('Open Guest Contacts');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Collect Contact Info"
      subtitle="Centralise details early so communication stays gentle."
    >
      <SoftInfoCard title="Choose How You’ll Store Info">
        <View style={styles.bulletList}>
          {STORAGE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Ask for Details Gently">
        <View style={styles.bulletList}>
          {ASK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Keep It All in One Place">
        <View style={styles.bulletList}>
          {CENTRAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Open Guest Contacts"
        variant="secondary"
        onPress={handleOpenContacts}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “One organised place now saves a lot of chasing later.”
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
