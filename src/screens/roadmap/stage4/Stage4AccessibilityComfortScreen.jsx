import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const ACCESS_POINTS = [
  'Ask early about mobility, sensory, or medical needs.',
  'Flag who may need ramps, quiet rooms, or extra seating time.',
];

const SEATING_POINTS = [
  'Keep aisles wide and pathways obvious.',
  'Seat those who need quick exits or support near edges, not tucked away.',
];

const FOOD_POINTS = [
  'Collect allergy and dietary details with RSVPs.',
  'Share needs with your caterer and confirm safe serving plans.',
];

export default function Stage4AccessibilityComfortScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage4GuestsInvitations');
  const handleOpenGuestList = () => navigation?.navigate?.('Guest Nest');

  return (
    <StageScreenContainer
      backLabel="Back to Guests & Invitations"
      onBackPress={handleBack}
      title="Accessibility & Guest Comfort"
      subtitle="Little notes now create a more inclusive, relaxed celebration."
    >
      <SoftInfoCard title="Note Key Access Needs Early">
        <View style={styles.bulletList}>
          {ACCESS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Seating & Layout Considerations">
        <View style={styles.bulletList}>
          {SEATING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Food & Sensitivity Notes">
        <View style={styles.bulletList}>
          {FOOD_POINTS.map((point) => (
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
        “Thoughtful planning is one of the kindest things you can do.”
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
