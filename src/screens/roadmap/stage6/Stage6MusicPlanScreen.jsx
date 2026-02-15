import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const KEY_MOMENTS_POINTS = [
  'If you’re doing a first dance or another key moment (entrance, money dance, cultural dance), choose what fits you.',
  'If you’re nervous, keep it short, keep it simple, or invite others to join.',
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
  const handleBack = () => navigation?.navigate?.('Stage6FinalDetails');
  const handleOpenGuide = () => console.log('Open Music & Key Moments Plan Guide');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Music & Key Moments Plan"
      subtitle="Keep music choices personal and stress-free."
    >
      <SoftInfoCard title="Choose Key Moments (Or Skip Them)">
        <View style={styles.bulletList}>
          {KEY_MOMENTS_POINTS.map((point) => (
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
        label="Music & Key Moments Guide"
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
