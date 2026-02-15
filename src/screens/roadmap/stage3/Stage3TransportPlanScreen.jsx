import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const SECTIONS = [
  {
    title: 'Map Out the Important Routes',
    bullets: [
      'Home/hotel ➜ ceremony ➜ reception ➜ afterparty.',
      'Mark drive times with generous buffer.',
    ],
  },
  {
    title: 'Who Needs Transport?',
    bullets: [
      'Wedding party, immediate family, VIP elders, or guests without cars.',
      'Note any accessibility accommodations.',
    ],
  },
  {
    title: 'Parking & Access',
    bullets: [
      'Detail drop-off points, parking lots, and fees.',
      'Share any venue-specific instructions.',
    ],
  },
  {
    title: 'Taxis, Shuttles or Cars',
    bullets: [
      'Consider a shuttle timeline or shared ride codes.',
      'Assign someone to share updates on the day.',
    ],
  },
];

export default function Stage3TransportPlanScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage3DreamTeam');
  const handleSave = () => console.log('save transport plan');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Transport Plan"
      subtitle="A calm set of notes to keep everyone moving smoothly."
    >
      {SECTIONS.map((section) => (
        <SoftInfoCard key={section.title} title={section.title}>
          <View style={styles.bulletList}>
            {section.bullets.map((bullet) => (
              <Text key={bullet} style={styles.bulletText}>
                • {bullet}
              </Text>
            ))}
          </View>
        </SoftInfoCard>
      ))}

      <CTAButton
        label="Save Transport Plan"
        variant="secondary"
        onPress={handleSave}
        style={styles.button}
      />

      <Text style={styles.footer}>
        “Clear transport is one of the kindest things you can plan.”
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
  button: {
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
