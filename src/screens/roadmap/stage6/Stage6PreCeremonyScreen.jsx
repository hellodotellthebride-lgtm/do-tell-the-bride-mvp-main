import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const CHECKLIST_POINTS = [
  'Lay out outfits, rings, vows, gifts, and emergency items the night before.',
  'Assign who is responsible for each item so nothing sits on you.',
];

const HAIR_POINTS = [
  'Set start times with buffer for makeup, hair, and travel.',
  'Share a calm schedule so no one has to ask repeatedly.',
];

const ARRIVAL_POINTS = [
  'List the arrival order for vendors, officiant, and VIPs.',
  'Note parking, contacts, and door codes in one place.',
];

const PERSONAL_POINTS = [
  'Include a moment to eat, hydrate, breathe, and read any letters.',
  'Remind yourself what can be left undone.',
];

export default function Stage6PreCeremonyScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleOpenPdf = () => console.log('Open Pre-Ceremony Checklist PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Final Details & Personal Touches"
      onBackPress={handleBack}
      title="Pre-Ceremony Logistics"
      subtitle="Smooth the morning without over-scheduling."
    >
      <SoftInfoCard title="Pre-Ceremony Checklist">
        <View style={styles.bulletList}>
          {CHECKLIST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Hair & Makeup Timing">
        <View style={styles.bulletList}>
          {HAIR_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Arrival Order">
        <View style={styles.bulletList}>
          {ARRIVAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Personal Items">
        <View style={styles.bulletList}>
          {PERSONAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Pre-Ceremony Checklist (PDF)"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“A calm morning sets the tone for the whole day.”</Text>
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
