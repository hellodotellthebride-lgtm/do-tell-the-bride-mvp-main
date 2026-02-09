import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors } from '../../../components/roadmap/tokens';

const POINTS = [
  {
    title: 'Expect a Few Curveballs',
    body: 'There will be last-minute taxis, postage, or outfit tweaks. Planning for them removes panic.',
  },
  {
    title: 'Choose a Buffer Range (5–10%)',
    body: 'Add a calm percentage to your total number. This keeps flexibility without inflating everything.',
  },
  {
    title: 'Separate a ‘Just in Case’',
    body: 'A different savings pot or account works wonders. Out of sight, out of daily temptation.',
  },
  {
    title: 'Ringfence It Somewhere Safe',
    body: 'Automate a transfer or tuck it into a high-yield account. Treat it as “can’t touch” unless you truly need it.',
  },
];

export default function BudgetBufferScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Budget Buffer & Emergency Costs"
      subtitle="No surprises, no panic."
    >
      {POINTS.map((point) => (
        <SoftInfoCard key={point.title} title={point.title} body={point.body} />
      ))}

      <View style={styles.quoteWrap}>
        <Text style={styles.quote}>
          “Planning your wedding should feel exciting, not overwhelming.”
        </Text>
      </View>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  quoteWrap: {
    marginTop: 8,
    padding: 18,
    borderRadius: 18,
    backgroundColor: roadmapColors.surface,
  },
  quote: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: roadmapColors.textDark,
  },
});
