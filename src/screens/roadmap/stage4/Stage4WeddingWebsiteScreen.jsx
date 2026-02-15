import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const WHY_POINTS = [
  'Answer questions once instead of repeating details in messages.',
  'Share changes quickly if plans shift.',
];

const INCLUDE_POINTS = [
  'Schedule, venues, dress guidance, travel, accommodation, FAQs.',
  'Link to RSVP form or contact details for the person helping you.',
];

const GUIDE_POINTS = [
  'Use the PDF guide to map sections before you start designing.',
  'Keep tone calm and personal — it’s an extension of you both.',
];

export default function Stage4WeddingWebsiteScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage4GuestsInvitations');
  const handleOpenTemplates = () => console.log('Open Wedding Website Guide');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Wedding Website Setup Guide"
      subtitle="A single link that keeps guests informed and reassured."
    >
      <SoftInfoCard title="Why a Wedding Website Helps">
        <View style={styles.bulletList}>
          {WHY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="What to Include">
        <View style={styles.bulletList}>
          {INCLUDE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Build Confidently With Our PDF Guide">
        <View style={styles.bulletList}>
          {GUIDE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Open Invite Templates"
        variant="secondary"
        onPress={handleOpenTemplates}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “A good website answers questions before they’re asked.”
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
