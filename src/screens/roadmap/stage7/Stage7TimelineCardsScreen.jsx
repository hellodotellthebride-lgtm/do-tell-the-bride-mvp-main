import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const MASTER_POINTS = [
  'Start with the big beats: wake-up, ceremony, dinner, speeches, dance, exit.',
  'Note who leads each moment so they know when to step in.',
];

const STEPS_POINTS = [
  'Break the day into simple cards (Morning, Ceremony, Reception, Evening).',
  'Add only the details someone needs to guide others — nothing more.',
];

const SHARE_POINTS = [
  'Hand the cards to planner, wedding party, family leads, and vendors.',
  'Remind them they’re now the point people so you can stay present.',
];

export default function Stage7TimelineCardsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage7WeddingWeek');
  const handleSupplierTimeline = () => console.log('Open Wedding Day Timeline – Supplier Overview');
  const handleTimelineCards = () => console.log('Open Wedding Day Timeline Cards');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Wedding Day Timeline Cards"
      subtitle="Give clarity without micromanagement."
    >
      <SoftInfoCard title="Create Your Master Timeline">
        <View style={styles.bulletList}>
          {MASTER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Break It Into Clear, Simple Steps">
        <View style={styles.bulletList}>
          {STEPS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Share With Anyone Who Needs It">
        <View style={styles.bulletList}>
          {SHARE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Wedding Day Timeline – Supplier Overview"
        variant="secondary"
        onPress={handleSupplierTimeline}
        style={styles.outlineButton}
      />
      <CTAButton
        label="Wedding Day Timeline Cards"
        variant="secondary"
        onPress={handleTimelineCards}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Once shared, this is no longer yours to worry about.”</Text>
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
