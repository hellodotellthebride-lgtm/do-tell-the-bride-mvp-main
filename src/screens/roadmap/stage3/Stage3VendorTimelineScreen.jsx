import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const TIMELINE_CARDS = [
  {
    title: 'Use as a guide, not a rulebook',
    bullets: [
      'This is a calm reference, not a pace you must keep.',
      'Shift items forward or back as your life needs.',
    ],
  },
  {
    title: 'Start with the big, early-impact vendors',
    bullets: [
      'Venue, planner, photographer, and caterer anchor the rest.',
      'Book what affects availability first.',
    ],
  },
  {
    title: 'Fill in mid-stage vendors',
    bullets: [
      'Music, florals, beauty, rentals, stationery — in whatever order feels right.',
      'Use the plan to see how lead times overlap.',
    ],
  },
  {
    title: 'Final touches vendors',
    bullets: [
      'Transportation, favors, accessories, late-night snacks.',
      'Note who needs final confirmation closer to the day.',
    ],
  },
];

export default function Stage3VendorTimelineScreen({ navigation }) {
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Stage3DreamTeam');
  };
  const handleDownload = () => console.log('download vendor comparison');
  const handleUpdate = () => console.log('update timeline');
  const handleExport = () => console.log('export timeline');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Your Vendor Booking Timeline"
      subtitle="See the order at a glance — then adjust to suit your life."
    >
      {TIMELINE_CARDS.map((card) => (
        <SoftInfoCard key={card.title} title={card.title}>
          <View style={styles.bulletList}>
            {card.bullets.map((bullet) => (
              <Text key={bullet} style={styles.bulletText}>
                • {bullet}
              </Text>
            ))}
          </View>
        </SoftInfoCard>
      ))}

      <CTAButton
        label="Download Vendor Comparison Worksheets"
        variant="secondary"
        onPress={handleDownload}
        style={styles.button}
      />
      <CTAButton
        label="Update Timeline"
        variant="secondary"
        onPress={handleUpdate}
        style={styles.button}
      />
      <CTAButton
        label="Export Updated Timeline"
        variant="secondary"
        onPress={handleExport}
        style={styles.button}
      />

      <Text style={styles.footer}>
        “A timeline is support — not something to keep up with.”
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
