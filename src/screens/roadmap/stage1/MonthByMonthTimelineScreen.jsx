import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors } from '../../../components/roadmap/tokens';

const CARDS = [
  {
    title: 'Get the Big Picture',
    body:
      'See how venue, vendors, outfits, and admin connect over time.\nTimelines vary depending on location, vendor demand, and how far away your date is.',
  },
  {
    title: 'Mark Your Rough Date',
    body:
      'Even a flexible month or season helps structure the plan.\nIn some regions, venues book 12–24 months ahead. In others, shorter timelines are common.',
  },
  {
    title: 'Circle the Key Milestones',
    body:
      'Identify major planning anchors:\n• Venue booking\n• Vendor deposits\n• Outfit ordering\n• Legal paperwork (where applicable)\n• Final payments\n\nThese milestones differ by country and ceremony type — adjust accordingly.',
  },
];

export default function MonthByMonthTimelineScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const openMasterTimeline = () => navigation?.navigate?.('MasterTimeline');
  const openPlanningPath = () => navigation?.navigate?.('PlanningPath');

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Month-by-Month Planning Timeline"
      subtitle="A flexible overview based on your date, region, and priorities."
    >
      {CARDS.map((card) => (
        <SoftInfoCard key={card.title} title={card.title} body={card.body} />
      ))}

      <CTAButton label="Build Your Personal Timeline" onPress={openMasterTimeline} />
      <CTAButton
        label="View Planning Path"
        variant="secondary"
        onPress={openPlanningPath}
      />
      <Text style={styles.helper}>
        Your timeline adjusts as your plans evolve. Awareness reduces overwhelm.
      </Text>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  helper: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
    color: roadmapColors.mutedText,
  },
});
