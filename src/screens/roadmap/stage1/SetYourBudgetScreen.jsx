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
      'Sit somewhere calm and discuss:\n• What feels financially comfortable\n• Whether this is savings-based, monthly cash flow, or family-supported\n• What “overstretching” would look like for you\n\nThis is about alignment, not numbers yet.',
  },
  {
    title: 'Draft a Guest List (Rough)',
    body:
      'List the people who feel non-negotiable. This is not final — it just gives you a sense of scale and cost drivers.\n\nEven a range (e.g., 60–80 guests) helps calculate venue and catering impact.',
  },
  {
    title: 'Set Your Comfortable Budget Range',
    body:
      'Choose a minimum and maximum total that feels realistic in your city or country.\nWedding costs vary widely by location — research averages in your area, but prioritise your own financial stability.\n\nWrite this as a range, not a single number.',
  },
  {
    title: 'Confirm Financial Contributors & Decision Roles',
    body:
      'Clarify:\n• Who is contributing financially\n• Whether contributions are fixed or flexible\n• Who has final decision authority on major expenses\n\nWrite this down to avoid misunderstandings later.',
  },
  {
    title: 'Define Your Budget Structure',
    body:
      'Decide how you’ll track spending:\n• App\n• Spreadsheet\n• Shared document\n• Planner or coordinator\n\nChoose one system early to reduce stress later.',
  },
];

const PAGE_OUTPUTS = [
  'A guest count range',
  'A comfortable total budget range',
  'Clarity on financial contributors',
  'A chosen tracking method',
];

export default function SetYourBudgetScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage1Overview');

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
      subtitle="Set a realistic range that reflects your region, priorities, and comfort level."
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

      <View style={styles.outputsBlock}>
        <Text style={styles.outputsTitle}>By the End of This Page, You Should Have:</Text>
        <Text style={styles.outputsList}>
          {PAGE_OUTPUTS.map((output) => `• ${output}`).join('\n')}
        </Text>
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
  outputsBlock: {
    marginTop: 16,
  },
  outputsTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  outputsList: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
});
