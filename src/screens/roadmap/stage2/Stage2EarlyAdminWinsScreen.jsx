import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const EMAIL_POINTS = [
  'Create a shared wedding email or alias.',
  'Forward all vendor responses there.',
  'Share access with anyone helping you plan.',
];

const FOLDER_POINTS = [
  'Set up cloud folders for quotes, receipts, contracts.',
  'Name files clearly so you can find them during a call.',
  'Keep a “waiting on” list for pending replies.',
];

const TIMELINE_POINTS = [
  'Draft a lightweight planning timeline with milestones.',
  'Log decisions in the app (budget, guest list, logistics).',
  'Mark what’s delegated so your brain can rest.',
];

export default function Stage2EarlyAdminWinsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage2EarlyDecisions');
  const handleAddToNotes = () => navigation?.navigate?.('WeddingHub');

  return (
    <StageScreenContainer
      backLabel="Back to Your Early Decisions"
      onBackPress={handleBack}
      title="Early Admin Wins"
      subtitle="Light systems now mean calm brains later."
    >
      <SoftInfoCard title="Create a shared wedding email">
        <View style={styles.bulletList}>
          {EMAIL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Set up folders for quotes & receipts">
        <View style={styles.bulletList}>
          {FOLDER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Create a rough planning timeline" body="Capture milestones, not micromanagement.">
        <View style={styles.bulletList}>
          {TIMELINE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Add decisions into the app"
        variant="secondary"
        onPress={handleAddToNotes}
        style={styles.softButton}
      />

      <Text style={styles.footer}>“Future you will be relieved you did this bit early.”</Text>
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
  softButton: {
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
