import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const WHY_POINTS = [
  'Keeps questions off your plate and gives helpers clarity.',
  'Makes teardown kinder on friends and family.',
];

const SETUP_POINTS = [
  'List décor per zone (ceremony aisle, welcome table, lounges).',
  'Include simple sketches or photos so helpers can copy easily.',
];

const CEREMONY_POINTS = [
  'Note who brings florals, signage, unity items, or chairs.',
  'Add timing for flipping the space if needed.',
];

const RECEPTION_POINTS = [
  'Document table numbers, centrepieces, stationery, candles.',
  'Flag any rentals that need to be returned with packaging.',
];

const CAKE_POINTS = [
  'Include dessert tables, photo displays, or guest book spots.',
  'Share storage or refrigeration needs.',
];

const TEARDOWN_POINTS = [
  'List end-of-night tasks, bins, and where items go after.',
  'Assign who takes flowers, keepsakes, rentals, and signage.',
];

export default function Stage6DecorPlanScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage6FinalDetails');
  const handleOpenPdf = () => console.log('Open Décor Setup & Teardown Plan PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Décor Setup & Teardown Plan"
      subtitle="Make the day run smoothly behind the scenes."
    >
      <SoftInfoCard title="What This Plan Helps With">
        <View style={styles.bulletList}>
          {WHY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="What to Plan for Setup">
        <View style={styles.bulletList}>
          {SETUP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Ceremony décor">
        <View style={styles.bulletList}>
          {CEREMONY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Reception tables">
        <View style={styles.bulletList}>
          {RECEPTION_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Cake & signage">
        <View style={styles.bulletList}>
          {CAKE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="What to Plan for Teardown">
        <View style={styles.bulletList}>
          {TEARDOWN_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Décor Setup & Teardown Plan – Printable"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“You don’t need to oversee everything — just decide who does.”</Text>
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
