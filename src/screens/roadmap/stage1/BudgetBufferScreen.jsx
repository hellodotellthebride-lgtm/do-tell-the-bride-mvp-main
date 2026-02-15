import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors } from '../../../components/roadmap/tokens';

const POINTS = [
  {
    title: 'Expect a Few Curveballs',
    body:
      'Weddings often include small unexpected costs:\n• Local taxes or service charges\n• Delivery or transport fees\n• Alterations\n• Currency fluctuations (for destination weddings)\n• Vendor overtime\n\nPlanning for them reduces stress — not excitement.',
  },
  {
    title: 'Choose a Buffer Range (5–10%)',
    body:
      'Add 5–15% of your total budget as a flexibility buffer.\nThe percentage may vary depending on your location, vendor structure, and travel elements.',
  },
  {
    title: 'Separate a ‘Just in Case’',
    body:
      'Decide where this buffer lives:\n• Separate savings\n• Same account but mentally allocated\n• Payment schedule spacing\n• Emergency credit line (if appropriate in your region)',
  },
  {
    title: 'Ringfence It Somewhere Safe',
    body:
      'Keep your buffer accessible but intentional.\nTreat it as protection, not extra spending money.',
  },
];

const PAGE_OUTPUTS = [
  'A defined buffer percentage',
  'A buffer total amount',
  'A clear location for those funds',
];

export default function BudgetBufferScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage1Overview');

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Budget Buffer & Emergency Costs"
      subtitle="Plan for flexibility — costs vary by region and detail level."
    >
      {POINTS.map((point) => (
        <SoftInfoCard key={point.title} title={point.title} body={point.body} />
      ))}

      <View style={styles.quoteWrap}>
        <Text style={styles.quote}>
          “Planning your wedding should feel exciting, not overwhelming.”
        </Text>
      </View>

      <View style={styles.outputsBlock}>
        <Text style={styles.outputsTitle}>By the End of This Page, You Should Have:</Text>
        <Text style={styles.outputsList}>
          {PAGE_OUTPUTS.map((output) => `• ${output}`).join('\n')}
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
  outputsBlock: {
    marginTop: 16,
  },
  outputsTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  outputsList: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
});
