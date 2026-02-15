import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const COMFORT_POINTS = [
  'Ask how they feel best (sleeves, lengths, shoes).',
  'Share the vibe without dictating every choice.',
];

const COLOUR_POINTS = [
  'Choose a palette or fabric that works across skin tones.',
  'Align on budget early and offer options.',
];

const TRY_POINTS = [
  'Schedule try-ons with room for tailoring.',
  'Collect sizes, alterations, and delivery timelines in one spot.',
];

const ORDER_POINTS = [
  'Place orders with buffer time for exchanges.',
  'Track shipping dates so nothing sneaks up.',
];

const FINAL_POINTS = [
  'Decide hair, accessories, or bouquet styles gently.',
  'Share a small checklist so everyone knows what to bring.',
];

export default function Stage5BridesmaidPlannerScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage5Style');
  const handleAddNotes = () => console.log('Add group notes');
  const handleSavePalette = () => console.log('Save palette to style boards');

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Bridesmaid Dresses Planner"
      subtitle="Keep decisions collaborative and pressure-free."
    >
      <SoftInfoCard title="Start With Comfort & Preferences">
        <View style={styles.bulletList}>
          {COMFORT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Choose Colours & Budget">
        <View style={styles.bulletList}>
          {COLOUR_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Try-Ons & Sizing">
        <View style={styles.bulletList}>
          {TRY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Order & Fit">
        <View style={styles.bulletList}>
          {ORDER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Final Styling">
        <View style={styles.bulletList}>
          {FINAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Add Group Notes"
        variant="secondary"
        onPress={handleAddNotes}
        style={styles.outlineButton}
      />
      <CTAButton
        label="Save Palette + Style Boards"
        variant="secondary"
        onPress={handleSavePalette}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “The goal is everyone feeling comfortable and confident.”
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
  outlineButton: {
    borderColor: roadmapColors.accent,
    marginTop: 12,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
