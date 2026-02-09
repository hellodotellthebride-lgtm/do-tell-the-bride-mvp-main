import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const SUPPLIER_POINTS = [
  'Ask vendors about local sourcing, reusables, and energy use.',
  'Note who already works sustainably so you’re not starting from scratch.',
  'Keep a short list of “dream partners” who align with your values.',
];

const MATERIAL_POINTS = [
  'Stationery: recycled stocks, soy inks, digital RSVPs.',
  'Decor: rentals, secondhand finds, pieces you can reuse.',
  'Florals: seasonal stems, foam-free designs, potted plants.',
];

const TRACKING_POINTS = [
  'Log each eco swap along with any added cost or savings.',
  'Highlight the swaps that matter most so the list feels doable.',
  'Note where deposits or rentals are refundable, so nothing lingers.',
];

const CHECKLIST_POINTS = [
  'Preview the PDF before chats so you know what to ask.',
  'Check items that feel relevant, ignore the rest.',
  'Share it with any helper so everyone stays aligned.',
];

export default function Stage3EcoFriendlyGuideScreen({ navigation }) {
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Stage3DreamTeam');
  };
  const openChecklist = () => console.log('Open Eco-Friendly Vendor Checklist');
  const openInspiration = () => navigation?.navigate?.('InspirationStation');
  const openBudgetBuddy = () => navigation?.navigate?.('Budget Buddy');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Eco-Friendly Vendor Guide"
      subtitle="Gentle swaps that lower waste without losing the magic."
    >
      <SoftInfoCard title="Choose Sustainable Suppliers">
        <View style={styles.bulletList}>
          {SUPPLIER_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Eco Materials Checklist">
        <View style={styles.bulletList}>
          {MATERIAL_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Track Eco Swaps + Costs">
        <View style={styles.bulletList}>
          {TRACKING_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <SoftInfoCard title="Eco-Friendly Vendor Checklist (PDF)">
        <View style={styles.bulletList}>
          {CHECKLIST_POINTS.map((point) => (
            <Text key={point} style={styles.bulletText}>
              • {point}
            </Text>
          ))}
        </View>
      </SoftInfoCard>

      <CTAButton
        label="Eco-Friendly Vendor Checklist"
        variant="secondary"
        onPress={openChecklist}
        style={styles.button}
      />
      <CTAButton
        label="Open Inspiration Library"
        variant="secondary"
        onPress={openInspiration}
        style={styles.button}
      />
      <CTAButton
        label="Open Budget Buddy"
        variant="secondary"
        onPress={openBudgetBuddy}
        style={styles.button}
      />

      <Text style={styles.footer}>
        “Small choices add up — perfection isn’t required.”
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
