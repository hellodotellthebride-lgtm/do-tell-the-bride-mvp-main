import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import SectionCard from '../../../components/roadmap/SectionCard';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';

const NAV_CARDS = [
  {
    id: 'final-invitations',
    title: 'Finalise & Send Invitations',
    description: 'Make sure nothing is missed — without over-checking.',
    icon: 'mail-outline',
    route: 'Stage6FinalInvitations',
  },
  {
    id: 'seating-plan',
    title: 'Seating Plan Guide',
    description: 'Keep seating practical and kind.',
    icon: 'grid-outline',
    route: 'Stage6SeatingPlan',
  },
  {
    id: 'rings',
    title: 'Rings & Jewellery',
    description: 'Comfortable, thoughtful choices for every day after.',
    icon: 'diamond-outline',
    route: 'Stage6RingsJewellery',
  },
  {
    id: 'pre-ceremony',
    title: 'Pre-Ceremony Logistics',
    description: 'Smooth the morning without over-scheduling.',
    icon: 'sunny-outline',
    route: 'Stage6PreCeremony',
  },
  {
    id: 'toasts-vows',
    title: 'Wedding Toasts & Vows',
    description: 'Keep the words sincere and pressure-free.',
    icon: 'create-outline',
    route: 'Stage6ToastsVows',
  },
  {
    id: 'favours',
    title: 'Favours & Thank-You Gifts',
    description: 'Meaningful gestures, no excess.',
    icon: 'gift-outline',
    route: 'Stage6FavoursGifts',
  },
  {
    id: 'music',
    title: 'First Dance & Music Planning',
    description: 'Personal music choices, zero performance pressure.',
    icon: 'musical-notes-outline',
    route: 'Stage6MusicPlan',
  },
  {
    id: 'speeches',
    title: 'Speeches Plan & Guidelines',
    description: 'Set expectations gently.',
    icon: 'megaphone-outline',
    route: 'Stage6Speeches',
  },
  {
    id: 'decor-plan',
    title: 'Décor Setup & Teardown Plan',
    description: 'Know who handles what so you can enjoy.',
    icon: 'construct-outline',
    route: 'Stage6DecorPlan',
  },
];

export default function Stage6FinalDetailsScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } = useStageChecklist('stage-6');

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };

  return (
    <StageScreenContainer
      backLabel="Back to Planning Path"
      onBackPress={handleBack}
      title="Final Details & Personal Touches"
      subtitle="Your final checks, thoughtful details, and personal touches — pulled together calmly."
    >
      <Text style={styles.stageLabel}>STAGE 6</Text>
      <Text style={styles.introText}>
        This hub keeps the last-layer details organised so you can focus on being present.
      </Text>

      <View style={styles.sectionGap} />

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
        <Text style={styles.cardFooter}>
          {completeCount} of {totalCount} ticked (for now)
        </Text>
      </View>

      <View style={styles.sectionGap} />

      {NAV_CARDS.map((card) => (
        <SectionCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          description={card.description}
          onPress={() => navigation?.navigate?.(card.route)}
        />
      ))}

      <SoftInfoCard
        title="“Everything important is covered.”"
        body="Use these calm guides to close the loop, then let the day breathe."
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
  cardFooter: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.mutedText,
  },
});
