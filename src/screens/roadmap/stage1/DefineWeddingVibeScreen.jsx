import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors } from '../../../components/roadmap/tokens';

const SECTIONS = [
  {
    title: 'Dream It (Discuss)',
    body:
      'Discuss:\n• Guest size (intimate / medium / large)\n• Formality level (black tie / relaxed / cultural / mixed)\n• Location type (local / destination / city / countryside / beach / religious venue)\n• One-day or multi-day\n\nThese choices directly affect venue size, vendor needs, and budget scale.',
  },
  {
    title: 'List Your Top 3 Priorities',
    body:
      'Choose three anchors that will guide spending and decisions.\nExamples: food quality, photography, guest experience, ceremony meaning, music, décor.\n\nIf everything is a priority, nothing is.',
  },
  {
    title: 'Choose Your “No” List',
    body:
      'Decide what you’re intentionally skipping:\n• Traditions that don’t fit\n• Trends you don’t love\n• Extra events that add stress\n\nThis reduces budget creep and decision fatigue.',
  },
  {
    title: 'Gather Vibe Evidence',
    body:
      'Collect 5–10 references maximum:\n• Colours\n• Textures\n• Venues\n• Cultural elements\n• Lighting\n\nFocus on cohesion, not volume.',
  },
  {
    title: 'Save It Somewhere',
    body:
      'Store your references in one shared place:\n• App folder\n• Shared drive\n• Mood board\n• Printed page\n\nThis becomes your reference point when speaking to vendors.',
  },
];

const PAGE_OUTPUTS = [
  'A defined wedding type',
  'A clear atmosphere description',
  'Three non-negotiable priorities',
  'A short “no” list',
  'One saved reference board',
];

export default function DefineWeddingVibeScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage1Overview');
  const openStyleBoard = () => navigation?.navigate?.('StyleBoard');
  const openInspiration = () => navigation?.navigate?.('InspirationLibrary');

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Define Your Wedding Vibe"
      subtitle="Define how it should feel — and what that means practically."
    >
      {SECTIONS.map((section) => (
        <SoftInfoCard key={section.title} title={section.title} body={section.body} />
      ))}
      <CTAButton label="Add to Style Board" onPress={openStyleBoard} />
      <CTAButton
        label="Open Inspiration Library"
        onPress={openInspiration}
        variant="secondary"
      />

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
