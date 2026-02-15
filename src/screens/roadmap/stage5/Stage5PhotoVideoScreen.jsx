import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const MOMENT_POINTS = [
  'List the feelings, people, and rituals you want remembered.',
  'Note anything you’re happy to skip so photographers know the vibe.',
];

const PRIORITY_POINTS = [
  'Group shots into must-have, nice-to-have, optional.',
  'Include video needs: vows audio, speeches, candid moments.',
];

const SHARE_POINTS = [
  'Send priorities plus schedule to your photo/video team.',
  'Give a trusted friend permission to gently wrangle family shots.',
];

const KEEP_POINTS = [
  'Only keep requests that feel meaningful.',
  'It’s okay if your shot list is short — presence beats volume.',
];

export default function Stage5PhotoVideoScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage5Style');
  const handleOpenPdf = () => console.log('Open shot list PDF');

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Photo & Video Plan"
      subtitle="Capture what matters, let go of what doesn’t."
    >
      <SoftInfoCard title="Capture the Moments That Matter Most">
        <View style={styles.bulletList}>
          {MOMENT_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Finalise Your Shot Priorities">
        <View style={styles.bulletList}>
          {PRIORITY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Share Priorities With Vendors">
        <View style={styles.bulletList}>
          {SHARE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Keep Only What Feels Good">
        <View style={styles.bulletList}>
          {KEEP_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Shot List PDF"
        variant="secondary"
        onPress={handleOpenPdf}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “You don’t need everything captured — just what matters to you.”
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
