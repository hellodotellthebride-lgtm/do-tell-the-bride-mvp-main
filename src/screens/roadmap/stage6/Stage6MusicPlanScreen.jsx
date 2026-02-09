import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const DANCE_POINTS = [
  'Choose a song that feels like you — or skip the tradition altogether.',
  'If you’re nervous, keep it short or invite others to join halfway.',
];

const MAP_POINTS = [
  'List music for ceremony moments, cocktail hour, dinner, and dancing.',
  'Decide where silence or ambient sound would feel grounding.',
];

const DECIDE_POINTS = [
  'Compare live band, DJ, playlist, or hybrid based on budget and energy.',
  'Note breaks, rider needs, and sound limits in your plan.',
];

export default function Stage6MusicPlanScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuide = () => console.log('Open First Dance & Music Planning Guide');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="First Dance & Music Planning"
      subtitle="Keep music choices personal and stress-free."
    >
      <SoftInfoCard title="Choose Your First Dance (or Decide Not To)">
        <View style={styles.bulletList}>
          {DANCE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Map Out Ceremony & Reception Music">
        <View style={styles.bulletList}>
          {MAP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide: Live Band, DJ, or Both">
        <View style={styles.bulletList}>
          {DECIDE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="First Dance & Music Planning Guide"
        variant="secondary"
        onPress={handleOpenGuide}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“You don’t owe anyone a performance.”</Text>
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
