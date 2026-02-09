import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const DECIDE_POINTS = [
  'Skip favours entirely if they don’t feel like you.',
  'Redirect that budget to charities, upgrades, or travel.',
];

const SUSTAIN_POINTS = [
  'Edible, reusable, or local items tend to actually get used.',
  'Pool orders with friends to cut waste and shipping.',
];

const DIY_POINTS = [
  'Add handwritten tags, recipes, or playlists if you have time.',
  'Batch tasks over a few evenings with help.',
];

const THANKS_POINTS = [
  'Plan a short list of people getting extra thank-yous (parents, bridal party, helpers).',
  'Note what you’re gifting and when you’ll give it to avoid forgetfulness.',
];

export default function Stage6FavoursGiftsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuide = () => console.log('Open Wedding Favours & Gifts Guide');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Favours & Thank-You Gifts"
      subtitle="Keep gifting thoughtful, not performative."
    >
      <SoftInfoCard title="Decide If You Even Want Favours">
        <View style={styles.bulletList}>
          {DECIDE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Choose Sustainable Options">
        <View style={styles.bulletList}>
          {SUSTAIN_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Add DIY or Personal Elements">
        <View style={styles.bulletList}>
          {DIY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Plan Thank-You Gifts for Your People">
        <View style={styles.bulletList}>
          {THANKS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Wedding Favours & Gifts Guide"
        variant="secondary"
        onPress={handleOpenGuide}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Small, meaningful gestures matter more than quantity.”</Text>
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
