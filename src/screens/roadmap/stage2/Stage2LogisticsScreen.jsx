import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const LOCATION_POINTS = [
  'Note distance for you and your guests.',
  'Balance sentimental spots with access and cost.',
  'Check transport links and accommodation clusters.',
];

const TRAVEL_POINTS = [
  'Flag hotel blocks, shuttles, or rideshares.',
  'Consider late-night travel or local curfews.',
  'List guests who need extra care (kids, elders, chronic illness).',
];

const WEATHER_POINTS = [
  'Name the season and likely weather curveballs.',
  'Plan an indoor fallback that feels intentional.',
  'Check heating, cooling, and shade for comfort.',
];

export default function Stage2LogisticsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage2EarlyDecisions');
  const handleAddNotes = () => navigation?.navigate?.('WeddingHub');

  return (
    <StageScreenContainer
      backLabel="Back to Your Early Decisions"
      onBackPress={handleBack}
      title="Logistics Reality Check"
      subtitle="Surface practical constraints early so calm decisions stay calm."
    >
      <SoftInfoCard title="General location & travel considerations" body="Map out the lay of the land.">
        <View style={styles.bulletList}>
          {LOCATION_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Travel times, accommodation & availability" body="Keep the journey comfortable.">
        <View style={styles.bulletList}>
          {TRAVEL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Weather & backup planning" body="Plan for comfort whatever the forecast.">
        <View style={styles.bulletList}>
          {WEATHER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Add to To-Do Notes"
        variant="secondary"
        onPress={handleAddNotes}
        style={styles.softButton}
      />

      <Text style={styles.footer}>“Good logistics are invisible on the day — that’s the goal.”</Text>
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
  softButton: {
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
