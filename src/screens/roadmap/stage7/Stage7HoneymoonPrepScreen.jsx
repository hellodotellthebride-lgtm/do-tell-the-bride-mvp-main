import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const TRAVEL_POINTS = [
  'Confirm flights, trains, or routes and screenshot everything.',
  'Share itineraries with someone staying home just in case.',
];

const PACK_POINTS = [
  'Pack essentials earlier in the week so you’re not doing it midnight after the wedding.',
  'Include meds, adapters, swimsuits, comfy clothes, and copies of IDs.',
];

const HOME_POINTS = [
  'Arrange pet care, deliveries, bin day, and a tidy space to return to.',
  'Leave clean sheets or a snack basket so post-trip you still feel looked after.',
];

export default function Stage7HoneymoonPrepScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenGuide = () => console.log('Open Honeymoon Prep Guide PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Honeymoon Prep & Travel"
      subtitle="Smooth the transition after the wedding."
    >
      <SoftInfoCard title="Final Travel Checklist">
        <View style={styles.bulletList}>
          {TRAVEL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Packing Essentials">
        <View style={styles.bulletList}>
          {PACK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Final Home Hits">
        <View style={styles.bulletList}>
          {HOME_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Honeymoon Prep Guide (PDF)"
        variant="secondary"
        onPress={handleOpenGuide}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“You’ve planned beautifully — now you get to rest.”</Text>
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
