import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const RANGE_POINTS = [
  'Capture both "worst" and "best" case numbers.',
  'Note family expectations vs what feels right for you.',
  'Treat it as a living range, not a final answer.',
];

const BLIST_POINTS = [
  'Create an A-list (absolutely there) and B-list (if space/budget allows).',
  'Label non-negotiables vs lovely-but-optional guests.',
  'Share the list with anyone helping you host.',
];

const IMPACT_POINTS = [
  'Capacity: venues, travel, accommodation.',
  'Cost per head: catering, rentals, bar plans.',
  'Emotional comfort: energy levels, intimacy, and flow.',
];

export default function Stage2GuestCountScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuestList = () => navigation?.navigate?.('Guest Nest');

  return (
    <StageScreenContainer
      backLabel="Back to Your Early Decisions"
      onBackPress={handleBack}
      title="Guest Count & Capacity"
      subtitle="Give your numbers a flexible, realistic shape — not a verdict."
    >
      <SoftInfoCard title="Estimate rough guest numbers" body="Think in ranges and let it evolve.">
        <View style={styles.bulletList}>
          {RANGE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Create an A-list and optional B-list">
        <View style={styles.bulletList}>
          {BLIST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Clarify how numbers affect everything" body="Use the range to sense-check each pillar.">
        <View style={styles.bulletList}>
          {IMPACT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Add estimated count to Guest List"
        variant="secondary"
        onPress={handleOpenGuestList}
        style={styles.softButton}
      />

      <Text style={styles.footer}>“You don’t have to finalise this today — just give it a realistic shape.”</Text>
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
