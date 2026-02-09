import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

const CARDS = [
  {
    title: 'Create Your Dream Team Cheat Sheet',
    bullets: [
      'Capture the vendors that matter most to you both.',
      'Note any names you already love.',
    ],
  },
  {
    title: 'List Your Must-Have Vendors',
    bullets: [
      'Think photography, music, food, planning, florals.',
      'Circle the ones that feel essential to your day.',
    ],
  },
  {
    title: 'Draft a Guest List (Rough)',
    bullets: [
      'A range is fine. It helps vendors quote confidently.',
      'Keep it flexible so you can adapt later.',
    ],
  },
  {
    title: 'Set Simple Ground Rules',
    bullets: [
      'Decide who enquiries vendors and who approves contracts.',
      'Agree on communication channels so everyone stays calm.',
    ],
  },
  {
    title: 'Use the Budget & Guest Tools',
    bullets: [
      'Keep key numbers in one place.',
      'Update as you confirm details — nothing rigid.',
    ],
  },
  {
    title: 'Gather Vibe Inspiration',
    bullets: [
      'Save looks, tones, and feelings you both love.',
      'Bring it to vendor chats to anchor the conversation.',
    ],
  },
];

export default function Stage3WhereToStartScreen({ navigation }) {
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Stage3DreamTeam');
  };
  const openVendorMatch = () => navigation?.navigate?.('WeddingHub');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Where Do I Start?"
      subtitle="Start with the calm foundations so every vendor choice feels lighter."
    >
      {CARDS.map((card) => (
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
        label="Open Vendor Match"
        variant="secondary"
        onPress={openVendorMatch}
        style={styles.outlineButton}
      />

      <Text style={styles.footer}>
        “You don’t need all the answers — just a calm starting point.”
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
