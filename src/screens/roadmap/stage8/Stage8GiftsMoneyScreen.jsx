import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const LOG_POINTS = [
  'List gifts and cards whenever you notice them — there’s no rush.',
  'Note amounts only if it helps you keep track, not out of obligation.',
];

const TRACK_POINTS = [
  'Record who gave what so thank-yous stay easy later.',
  'Let a partner or friend help if you’re tired of admin.',
];

const DECIDE_POINTS = [
  'Keep, exchange, or donate based on what feels useful.',
  'Sell duplicates without guilt — the sentiment already arrived.',
];

export default function Stage8GiftsMoneyScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Gifts & Money"
      subtitle="Handle gifts practically, without guilt."
    >
      <SoftInfoCard title="Log Received Gifts">
        <View style={styles.bulletList}>
          {LOG_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Track Who Gave What">
        <View style={styles.bulletList}>
          {TRACK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide What to Return, Exchange, or Keep">
        <View style={styles.bulletList}>
          {DECIDE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“There’s no right timeline for this.”</Text>
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
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
