import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const TIMING_POINTS = [
  'Confirm ceremony, reception, transport, and vendor arrival times.',
  'Share the same document with whoever’s leading the day.',
];

const TOUCHES_POINTS = [
  'Note any final invoices, tips, or pickups.',
  'Label what can slide if life gets busy — permission granted.',
];

const ITEMS_POINTS = [
  'Gather attire, accessories, rings, licence, and day-of stationery in one place.',
  'Pack snacks, water, meds, and anything comforting.',
];

const RAIN_POINTS = [
  'If weather shifts, follow the Rain Plan card. No need to rethink it now.',
];

const CHECK_POINTS = [
  'Use the PDF checklist once, then rest. Duplicates only add noise.',
];

export default function Stage7FinalWeekChecklistScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenPdf = () => console.log('Open Final Week Checklist PDF');
  const handleRainPlan = () => navigation?.navigate?.('Stage7RainPlan');

  return (
    <StageScreenContainer
      backLabel="Back to Final Week & Wedding Day"
      onBackPress={handleBack}
      title="Final Week Checklist"
      subtitle="Reduce last-week spiralling with one calm reference."
    >
      <SoftInfoCard title="Confirm Your Final Timings & Logistics">
        <View style={styles.bulletList}>
          {TIMING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Final Touches & Loose Ends">
        <View style={styles.bulletList}>
          {TOUCHES_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Prep Your Day-Of Items">
        <View style={styles.bulletList}>
          {ITEMS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Rain Plan">
        <View style={styles.bulletList}>
          {RAIN_POINTS.map((point) => (
            <Text key={point} style={styles.linkText} onPress={handleRainPlan}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Check the Final Week Checklist">
        <View style={styles.bulletList}>
          {CHECK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Final Week Checklist (PDF)"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“If it’s not on this list, it can wait.”</Text>
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
  linkText: {
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.accent,
    fontFamily: 'Outfit_500Medium',
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
