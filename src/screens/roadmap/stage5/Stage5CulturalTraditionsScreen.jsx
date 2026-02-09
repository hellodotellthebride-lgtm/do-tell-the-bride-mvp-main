import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const NOTE_POINTS = [
  'List rituals, garments, or symbols that feel important.',
  'Include both families’ perspectives plus your own modern twists.',
];

const PRIORITY_POINTS = [
  'Decide which elements are essential, flexible, or optional.',
  'Note how they influence outfits, decor, or ceremony flow.',
];

const SHARE_POINTS = [
  'Explain meaning to your planner, stylist, and media team early.',
  'Give written guidance so elders see you’re honouring the intention.',
];

const KEEP_POINTS = [
  'Release anything that feels performative or pressured.',
  'Create new rituals if existing ones no longer fit.',
];

export default function Stage5CulturalTraditionsScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Style & Details"
      onBackPress={handleBack}
      title="Cultural & Religious Traditions"
      subtitle="Hold space for meaning without losing yourself."
    >
      <SoftInfoCard title="Note the Traditions That Matter to You">
        <View style={styles.bulletList}>
          {NOTE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Finalise Your Style Priorities">
        <View style={styles.bulletList}>
          {PRIORITY_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Share These With Vendors Early">
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

      <Text style={styles.footer}>
        “Meaningful choices matter more than perfect ones.”
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
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
