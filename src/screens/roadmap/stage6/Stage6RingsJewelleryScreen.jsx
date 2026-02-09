import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const COMFORT_POINTS = [
  'Think about work, hobbies, and comfort before deciding on height or stones.',
  'Consider hypoallergenic metals if you’re unsure.',
];

const STYLE_POINTS = [
  'Mix metals if you like — matching isn’t mandatory.',
  'Capture engravings or cultural elements that feel meaningful.',
];

export default function Stage6RingsJewelleryScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenPdf = () => console.log('Open Wedding Ring Style Guide PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Rings & Jewellery"
      subtitle="Support thoughtful, unpressured choices."
    >
      <SoftInfoCard title="Think About Comfort & Lifestyle">
        <View style={styles.bulletList}>
          {COMFORT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide on Metal & Style">
        <View style={styles.bulletList}>
          {STYLE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Wedding Ring Style Guide (PDF)"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Choose what you’ll love wearing — not what’s expected.”</Text>
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
