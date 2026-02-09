import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const WHO_POINTS = [
  'Choose the people who feel grounding and joyful.',
  'Let emotional support outweigh obligation or symmetry.',
  'Remember you can keep it tiny, or skip titles entirely.',
];

const ASK_POINTS = [
  'Decide if you want low-key texts, letters, or playful gestures.',
  'Share why they matter to you, not just the logistics.',
  'Offer a graceful out so it never feels pressured.',
];

const ROLE_POINTS = [
  'Outline gentle expectations (time, cost, energy).',
  'Name the help you’d love, but stress it’s optional.',
  'Keep space for their personalities inside the role.',
];

export default function Stage2WeddingPartyScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  const handleWaysToAsk = () =>
    Alert.alert('Coming soon', 'Ways to ask your wedding party will live here soon.');
  const handleRolesGuide = () =>
    Alert.alert('Coming soon', 'Bridal party roles guide is on its way.');

  return (
    <StageScreenContainer
      backLabel="Back to Your Early Decisions"
      onBackPress={handleBack}
      title="Your Wedding Party"
      subtitle="Choose heart-first support and keep every invitation gentle."
    >
      <SoftInfoCard title="Decide who feels right" body="Support beats obligation every time.">
        <View style={styles.bulletList}>
          {WHO_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="How you’ll ask them" body="Pick a tone that matches your friendship.">
        <View style={styles.bulletList}>
          {ASK_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
        <CTAButton
          label="Open Ways to Ask Your Wedding Party"
          variant="secondary"
          onPress={handleWaysToAsk}
          style={styles.softButton}
        />
      </SoftInfoCard>

      <SoftInfoCard title="Clarify roles (gently)" body="Set expectations without pressure.">
        <View style={styles.bulletList}>
          {ROLE_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
        <CTAButton
          label="Open Bridal Party Roles"
          variant="secondary"
          onPress={handleRolesGuide}
          style={styles.softButton}
        />
      </SoftInfoCard>

      <Text style={styles.footer}>“There’s no right number of people — just the right people for you.”</Text>
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
    marginTop: 12,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
