import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const LIST_POINTS = [
  'Note every remaining task (set décor, manage tips, cue music, pack gifts).',
  'Assign names — not “someone” — to each item.',
];

const SHARE_POINTS = [
  'Include key contacts, room numbers, wifi codes, and emergency plans.',
  'Store everything in one handover doc so you’re not fielding questions.',
];

const EASY_POINTS = [
  'Highlight what “done” looks like so helpers can finish without you.',
  'Thank them in advance so they feel trusted, not micromanaged.',
];

export default function Stage7DelegationScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage7WeddingWeek');
  const handleOpenSheet = () => console.log('Open Delegation & Handover Sheet');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Delegation & Handover"
      subtitle="Move responsibility off the couple."
    >
      <SoftInfoCard title="List Who’s Handling What">
        <View style={styles.bulletList}>
          {LIST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Share Your Final Contacts & Info">
        <View style={styles.bulletList}>
          {SHARE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Make It Easy for Them">
        <View style={styles.bulletList}>
          {EASY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Delegation & Handover Sheet"
        variant="secondary"
        onPress={handleOpenSheet}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“You don’t need to manage the day — just live it.”</Text>
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
