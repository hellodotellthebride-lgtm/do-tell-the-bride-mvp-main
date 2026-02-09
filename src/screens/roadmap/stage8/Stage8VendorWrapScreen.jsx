import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const INVOICE_POINTS = [
  'Pay outstanding invoices when it feels manageable.',
  'Schedule reminders so you’re not keeping it in your head.',
];

const REVIEW_POINTS = [
  'Leave reviews when you’re ready — weeks or months later is fine.',
  'Share honest feedback privately if something needs follow-up.',
];

const THANK_POINTS = [
  'Send a gentle thank-you email or note once you’ve rested.',
  'Include a photo if you feel like it, but there’s no pressure.',
];

export default function Stage8VendorWrapScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Vendor Wrap-Up"
      subtitle="Close the loop professionally."
    >
      <SoftInfoCard title="Final Invoices">
        <View style={styles.bulletList}>
          {INVOICE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Reviews (When You’re Ready)">
        <View style={styles.bulletList}>
          {REVIEW_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Thank-You Messages">
        <View style={styles.bulletList}>
          {THANK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <Text style={styles.footer}>“Reviews can wait until you feel ready.”</Text>
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
