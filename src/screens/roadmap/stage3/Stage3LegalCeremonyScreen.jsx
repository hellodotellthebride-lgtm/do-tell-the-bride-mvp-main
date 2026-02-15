import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const REQUIREMENT_POINTS = [
  'List identification, witness, or residency rules for your location.',
  'Note deadlines for blood tests, translations, or apostilles if needed.',
  'Keep copies of whatever you submit, just in case.',
];

const PAPERWORK_POINTS = [
  'Record when to apply, when the licence becomes valid, and when it expires.',
  'Set gentle reminders for collecting paperwork or scheduling appointments.',
  'Track fees and where to pay them.',
];

const OFFICIANT_POINTS = [
  'Confirm who can legally marry you (civil, religious, friend ordained).',
  'Note rehearsal needs or scripts they’ll help with.',
  'Capture contact details so everyone knows where to send updates.',
];

export default function Stage3LegalCeremonyScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage3DreamTeam');
  const openGuide = () => console.log('Open Legal & Ceremony Guide');
  const addNotes = () => console.log('Add to Ceremony Notes');
  const saveDetails = () => console.log('Save Officiant Details');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Making It Official – Legal & Ceremony Guide"
      subtitle="Calm steps so paperwork and ceremony structure feel lighter."
    >
      <SoftInfoCard title="Marriage Requirements">
        <View style={styles.bulletList}>
          {REQUIREMENT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Licence or Paperwork Timeline">
        <View style={styles.bulletList}>
          {PAPERWORK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Confirm Legal Officiant">
        <View style={styles.bulletList}>
          {OFFICIANT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Legal & Ceremony Guide"
        variant="secondary"
        onPress={openGuide}
        style={styles.button}
      />
      <CTAButton
        label="Add to Ceremony Notes"
        variant="secondary"
        onPress={addNotes}
        style={styles.button}
      />
      <CTAButton
        label="Save Officiant Details"
        variant="secondary"
        onPress={saveDetails}
        style={styles.button}
      />

      <Text style={styles.footer}>
        “Once this is handled, everything else gets lighter.”
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
  button: {
    borderColor: roadmapColors.accent,
    marginTop: 10,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
