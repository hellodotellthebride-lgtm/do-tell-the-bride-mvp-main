import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors } from '../../../components/roadmap/tokens';

const CARDS = [
  {
    title: 'Get the Big Picture',
    body: 'See how venue, vendors, outfits, and admin weave together month-by-month.',
  },
  {
    title: 'Mark Your Rough Date',
    body: 'You don’t need a venue yet. Choose a month or season so the plan has a spine.',
  },
  {
    title: 'Circle the Key Milestones',
    body: 'Deposits, dress fittings, tastings, final payments. Awareness alone is calming.',
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
      subtitle="A zoomed-out map of the whole journey."
    >
      {CARDS.map((card) => (
        <SoftInfoCard key={card.title} title={card.title} body={card.body} />
      ))}

      <CTAButton label="Use the Master Timeline Tool" onPress={openMasterTimeline} />
      <CTAButton
        label="View Planning Path"
        variant="secondary"
        onPress={openPlanningPath}
      />
      <Text style={styles.helper}>
        You can come back and tweak this anytime. The aim is awareness, not perfection.
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
