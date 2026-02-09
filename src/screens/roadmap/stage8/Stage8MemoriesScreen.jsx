import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const DOWNLOAD_POINTS = [
  'Save raw files to two places — cloud + drive — so nothing gets lost.',
  'Ask your photo/video team for delivery timelines if you haven’t already.',
];

const SHARE_POINTS = [
  'Send a curated batch to friends and family instead of every file.',
  'Use shared albums or galleries so you send once, not repeatedly.',
];

const DECIDE_POINTS = [
  'Pick any prints, frames, or albums slowly; it doesn’t have to be immediate.',
  'Create a “save for later” list if you’re waiting on budget or time.',
];

export default function Stage8MemoriesScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleSaveLater = () => console.log('Save memories plan for later');

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Wrap-Up"
      onBackPress={handleBack}
      title="Photos, Videos & Memories"
      subtitle="Keep memories without pressure."
    >
      <SoftInfoCard title="Download & Back Up Files">
        <View style={styles.bulletList}>
          {DOWNLOAD_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Share With Friends & Family">
        <View style={styles.bulletList}>
          {SHARE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Decide on Albums or Prints">
        <View style={styles.bulletList}>
          {DECIDE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Save for Later"
        variant="secondary"
        onPress={handleSaveLater}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>“You don’t need to do everything — keep what matters.”</Text>
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
