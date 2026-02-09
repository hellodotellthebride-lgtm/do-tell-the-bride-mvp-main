import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors } from '../../../components/roadmap/tokens';

const SECTIONS = [
  {
    title: 'Have the Budget Talk',
    body:
      'Sit somewhere calm, pour a drink, and talk about what you both want to spend energy and money on. No spreadsheets yet.',
  },
  {
    title: 'Draft a Guest List (Rough)',
    body:
      'List the people who feel non-negotiable. This is not final — it just gives you a sense of scale and cost drivers.',
  },
  {
    title: 'Decide How Much Feels Right',
    body:
      'Instead of asking “what should we spend?”, ask “what feels good, safe, and generous enough for us?”.',
  },
  {
    title: 'Set Simple Ground Rules',
    body:
      'Note who’s contributing, how you’ll track spending, and any quick “nope” items. Write it down so future-you doesn’t have to guess.',
  },
];

export default function SetYourBudgetScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();

  const openBudgetBuddy = () => {
    navigation?.navigate?.('Budget Buddy');
  };

  const openGuestList = () => {
    navigation?.navigate?.('GuestList');
  };

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Set Your Budget"
      subtitle="Money talk, but make it soft."
    >
      {SECTIONS.map((section) => (
        <SoftInfoCard key={section.title} title={section.title} body={section.body} />
      ))}

      <View style={styles.ctaGroup}>
        <CTAButton label="Open Budget Buddy" onPress={openBudgetBuddy} />
        <CTAButton
          label="Open Guest List"
          onPress={openGuestList}
          variant="secondary"
        />
      </View>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  ctaGroup: {
    marginTop: 8,
  },
  helper: {
    fontSize: 13,
    color: roadmapColors.mutedText,
  },
});
