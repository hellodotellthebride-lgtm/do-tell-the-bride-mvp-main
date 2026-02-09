import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const CERT_POINTS = [
  'Order multiple official copies if you plan to update lots of accounts.',
  'Store them somewhere dry and easy to reach when you feel ready.',
];

const IDS_POINTS = [
  'Tackle IDs, banks, and utilities in short bursts.',
  'Update the ones you use daily first; the rest can wait.',
];

const WORK_POINTS = [
  'Update HR, payroll, insurance, and travel profiles if you’re changing names.',
  'Let colleagues know gently — no need for a big announcement.',
];

export default function Stage8NameChangeScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Name Change & Official Admin"
      subtitle="Break admin into calm, doable steps."
    >
      <SoftInfoCard title="Order Marriage Certificate">
        <View style={styles.bulletList}>
          {CERT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Update IDs, Banks & Utilities">
        <View style={styles.bulletList}>
          {IDS_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Update Work & Insurance Details">
        <View style={styles.bulletList}>
          {WORK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“This can be done slowly — nothing needs to happen all at once.”</Text>
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
