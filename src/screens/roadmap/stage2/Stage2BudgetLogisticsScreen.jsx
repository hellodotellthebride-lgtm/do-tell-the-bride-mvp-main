import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const CONTRIBUTORS_POINTS = [
  'List who might contribute (you two, family, others).',
  'Write down amounts or percentages after calm conversations.',
  'Note any conditions or boundaries with kindness.',
];

const TOTAL_POINTS = [
  'Set a realistic headline number with a buffer.',
  'Think “enough to feel generous, safe, and comfortable.”',
  'Document it so future decisions have a guardrail.',
];

const SYSTEM_POINTS = [
  'Track spend in one shared place (Budget Buddy, spreadsheet, notebook).',
  'Decide how you’ll approve surprises above a certain amount.',
  'Note what “paid”, “pending”, and “due” mean for you both.',
];

export default function Stage2BudgetLogisticsScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage2EarlyDecisions');
  const openBudgetBuddy = () => navigation?.navigate?.('Budget Buddy');

  return (
    <StageScreenContainer
      backLabel="Back to Your Early Decisions"
      onBackPress={handleBack}
      title="Budget Logistics"
      subtitle="Turn money stress into clarity you both trust."
    >
      <SoftInfoCard title="Who is contributing & how much" body="Conversations beat assumptions.">
        <View style={styles.bulletList}>
          {CONTRIBUTORS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Set a realistic total number" body="Aim for clarity with compassion.">
        <View style={styles.bulletList}>
          {TOTAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Build light systems that keep spending calm">
        <View style={styles.bulletList}>
          {SYSTEM_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Open Budget Buddy"
        onPress={openBudgetBuddy}
        style={styles.primaryButton}
      />

      <Text style={styles.footer}>“Your budget is not a prison. It’s your permission slip.”</Text>
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
  primaryButton: {
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
