import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import SectionCard from '../../../components/roadmap/SectionCard';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';

const DECISION_CARDS = [
  {
    id: 'capacity',
    title: 'Guest Count & Capacity',
    description: 'How your numbers shape everything.',
    icon: 'people-outline',
  },
  {
    id: 'wedding-party',
    title: 'Your Wedding Party',
    description: 'Who you want beside you — and how you invite them.',
    icon: 'sparkles-outline',
  },
  {
    id: 'logistics',
    title: 'Logistics Reality Check',
    description: 'Location, travel, weather — the practical stuff that matters.',
    icon: 'navigate-outline',
  },
  {
    id: 'ceremony-setup',
    title: 'Ceremony vs Reception Setup',
    description: 'One venue or two? Timing it all out.',
    icon: 'hourglass-outline',
  },
  {
    id: 'budget-logistics',
    title: 'Budget Logistics',
    description: 'Who pays what, and where it goes.',
    icon: 'wallet-outline',
  },
  {
    id: 'early-admin',
    title: 'Early Admin Wins',
    description: 'Set up systems now, thank yourself later.',
    icon: 'document-text-outline',
  },
];

export default function Stage2EarlyDecisionsScreen({ navigation }) {
  const { items, checkedMap, toggleItem, totalCount, completeCount } =
    useStageChecklist('stage-2');
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };

  const handleCardPress = (id) => {
    const routeMap = {
      capacity: 'Stage2GuestCount',
      'wedding-party': 'Stage2WeddingParty',
      logistics: 'Stage2Logistics',
      'ceremony-setup': 'Stage2CeremonySetup',
      'budget-logistics': 'Stage2BudgetLogistics',
      'early-admin': 'Stage2EarlyAdmin',
    };
    const route = routeMap[id];
    if (route) {
      navigation?.navigate?.(route);
      return;
    }
    console.log('[Stage2EarlyDecisions] card pressed ->', id);
  };

  return (
    <StageScreenContainer
      backLabel="Back to Planning Path"
      onBackPress={handleBack}
      title="Your Early Decisions"
      subtitle="These calm steps help you choose the pieces that guide everything else."
    >
      <Text style={styles.stageLabel}>STAGE 2</Text>
      <Text style={styles.introText}>
        Think of this as your gentle orientation. Take what helps, skip what doesn’t. Every tick is
        simply momentum ({completeCount}/{totalCount}).
      </Text>

      <View style={styles.sectionGap} />

      <View style={styles.checklistCard}>
        <Text style={styles.cardTitle}>Mini checklist</Text>
        <Text style={styles.cardSubtitle}>Light, calm, and totally flexible.</Text>
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            label={item.label}
            checked={checkedMap[item.id]}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </View>

      <View style={styles.sectionGap} />

      <Text style={styles.sectionLabel}>DECISION CARDS</Text>
      <Text style={styles.sectionTitle}>Break each big decision into a moment you can breathe in.</Text>

      {DECISION_CARDS.map((card) => (
        <SectionCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          description={card.description}
          onPress={() => handleCardPress(card.id)}
        />
      ))}

      <SoftInfoCard
        title="“You don’t have to decide everything today.”"
        body="Just enough clarity to move forward calmly is always enough."
      />
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
  introText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  sectionGap: {
    height: roadmapSpacing.sectionGap,
  },
  checklistCard: {
    backgroundColor: roadmapColors.card,
    borderRadius: roadmapRadius,
    padding: roadmapSpacing.cardPadding,
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
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    marginBottom: 14,
  },
});
