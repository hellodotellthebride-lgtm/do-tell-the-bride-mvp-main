import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const TONE_POINTS = [
  'Decide what feels grounding: music, silence, journaling, stretching.',
  'Let your crew know it’s a slow morning so they mirror the pace.',
];

const KIT_POINTS = [
  'Include steamer, sewing kit, blotting sheets, extra chargers, mints.',
  'Label the bag so helpers can find it without you.',
];

const CARE_POINTS = [
  'Eat something gentle, hydrate, and breathe between hair/makeup.',
  'Schedule a minute to sit alone or with your partner before leaving.',
];

const BOUNDARY_POINTS = [
  'Decide who can reach you and who fields questions.',
  'Share which topics are off-limits so no one brings stress into the room.',
];

export default function Stage7MorningPrepScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage7WeddingWeek');
  const handleTimeline = () => console.log('Open Wedding Morning Timeline');
  const handleSelfCare = () => console.log('Open Bride/Groom Self-Care Checklist');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Wedding Morning Prep"
      subtitle="Create a calm, unhurried start."
    >
      <SoftInfoCard title="Set Your Morning Tone">
        <View style={styles.bulletList}>
          {TONE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Emergency Kit Checklist">
        <View style={styles.bulletList}>
          {KIT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Look After You">
        <View style={styles.bulletList}>
          {CARE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Morning-Of Boundaries & Expectations">
        <View style={styles.bulletList}>
          {BOUNDARY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Wedding Morning Timeline"
        variant="secondary"
        onPress={handleTimeline}
        style={styles.outlineButton}
      />
      <CTAButton
        label="Bride/Groom Self-Care Checklist"
        variant="secondary"
        onPress={handleSelfCare}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“A calm morning changes everything.”</Text>
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
    marginTop: 12,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
