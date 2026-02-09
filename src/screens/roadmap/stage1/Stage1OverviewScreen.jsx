import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import SectionCard from '../../../components/roadmap/SectionCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';

const SECTION_CARDS = [
  {
    id: 'mini-checklist',
    title: 'Mini checklist',
    description: 'Tick what feels helpful, skip what doesn’t.',
    icon: 'checkbox-outline',
    route: 'Stage1MiniChecklist',
  },
  {
    id: 'set-budget',
    title: 'Set Your Budget',
    description: 'Money talk, but make it soft.',
    icon: 'wallet-outline',
    route: 'Stage1SetYourBudget',
  },
  {
    id: 'budget-buffer',
    title: 'Budget Buffer & Emergency Costs',
    description: 'Protect your budget with calm, realistic buffers.',
    icon: 'shield-checkmark-outline',
    route: 'Stage1BudgetBuffer',
  },
  {
    id: 'wedding-vibe',
    title: 'Define Your Wedding Vibe',
    description: 'Not a Pinterest board. A feeling.',
    icon: 'sparkles-outline',
    route: 'Stage1DefineWeddingVibe',
  },
  {
    id: 'first-five',
    title: 'First 5 Things to Do',
    description: 'Mini checklist, major calm.',
    icon: 'list-outline',
    route: 'Stage1FirstFiveThings',
  },
  {
    id: 'timeline',
    title: 'Month-by-Month Planning Timeline',
    description: 'A zoomed-out map of the whole journey.',
    icon: 'calendar-outline',
    route: 'Stage1Timeline',
  },
];

export default function Stage1OverviewScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } =
    useStageChecklist('stage-1');
  const handleBack = () => navigation?.goBack?.();
  const handleCardPress = (route) => {
    if (!route) return;
    navigation?.navigate?.(route);
  };
  const handleMasterChecklist = () => {
    navigation?.navigate?.('Stage1NoStressMasterChecklist');
  };

  return (
    <StageScreenContainer
      backLabel="Back to Wedding Roadmap"
      onBackPress={handleBack}
      title="Your Beginning"
      subtitle="Set your tone, your budget, your first breath."
    >
      <Text style={styles.stageLabel}>STAGE 1</Text>
      <View style={{ height: 8 }} />

      <View style={styles.checklistCard}>
        <Text style={styles.cardTitle}>Mini checklist</Text>
        <Text style={styles.cardSubtitle}>Tick what feels helpful, skip what doesn’t.</Text>
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            label={item.label}
            checked={!!checkedMap[item.id]}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
        <Text style={styles.cardProgress}>
          {completeCount} of {totalCount} ticked
        </Text>
      </View>

      {SECTION_CARDS.map((card) => (
        <SectionCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          description={card.description}
          onPress={() => handleCardPress(card.route)}
        />
      ))}

      <View style={styles.helperCard}>
        <Text style={styles.helperText}>Need the full journey mapped out?</Text>
        <CTAButton label="Open No-Stress Master Checklist" onPress={handleMasterChecklist} />
      </View>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  stageLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
  },
  checklistCard: {
    backgroundColor: roadmapColors.card,
    borderRadius: roadmapRadius,
    padding: roadmapSpacing.cardPadding,
    marginBottom: roadmapSpacing.sectionGap,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
    marginBottom: 10,
  },
  cardProgress: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.mutedText,
  },
  helperCard: {
    marginTop: 12,
    backgroundColor: roadmapColors.surface,
    borderRadius: roadmapRadius,
    padding: 18,
  },
  helperText: {
    fontSize: 15,
    marginBottom: 8,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
});
