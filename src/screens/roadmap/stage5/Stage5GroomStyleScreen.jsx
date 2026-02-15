import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const HIRE_POINTS = [
  'Decide what’s worth owning vs. renting based on future use.',
  'List pros/cons for each to make the call calmly.',
];

const STYLE_POINTS = [
  'Choose silhouettes, colours, or cultural elements that feel like you.',
  'Align on how formal each event is (ceremony, dinner, after-party).',
];

const FIT_POINTS = [
  'Book tailoring appointments as soon as outfits arrive.',
  'Note who needs extra time for travel or alterations.',
];

const GROUP_POINTS = [
  'Share a simple guide so everyone knows what to wear and bring.',
  'Offer flexibility for shoes, accessories, or grooming where possible.',
];

export default function Stage5GroomStyleScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage5Style');
  const handleOpenPdf = () => console.log('Open Groom & Groomsmen Wear Guide PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Groom & Groomsmen Style Guide"
      subtitle="Keep looks cohesive while letting everyone stay comfortable."
    >
      <SoftInfoCard title="Hire or Buy">
        <View style={styles.bulletList}>
          {HIRE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Choose Timeline & Style">
        <View style={styles.bulletList}>
          {STYLE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Fittings Timeline">
        <View style={styles.bulletList}>
          {FIT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Coordinate the Group">
        <View style={styles.bulletList}>
          {GROUP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Groom & Groomsmen Wear Guide (PDF)"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“Comfort shows — especially in photos.”</Text>
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
