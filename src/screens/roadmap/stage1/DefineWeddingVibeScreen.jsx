import React from 'react';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';

const SECTIONS = [
  {
    title: 'Dream It (Discuss)',
    body: 'Talk about size, energy, formality, and location. Think “what do we want it to feel like?”',
  },
  {
    title: 'List Your Top 3 Priorities',
    body: 'Food, music, photography, vows? Choose three anchors so decisions stay aligned.',
  },
  {
    title: 'Choose Your “No” List',
    body: 'Say no to trends you don’t love. This removes noise instantly.',
  },
  {
    title: 'Gather Vibe Evidence',
    body: 'Colours, textures, venues, or scents. Keep it intentional, not endless.',
  },
  {
    title: 'Save It Somewhere',
    body: 'Put everything into a shared doc or board you can revisit later.',
  },
];

export default function DefineWeddingVibeScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const openStyleBoard = () => navigation?.navigate?.('StyleBoard');
  const openInspiration = () => navigation?.navigate?.('InspirationLibrary');

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Define Your Wedding Vibe"
      subtitle="Not a Pinterest board. A feeling."
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
    </StageScreenContainer>
  );
}
