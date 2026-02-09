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
    id: 'thank-yous',
    title: 'Thank-Yous & Gratitude',
    description: 'Make appreciation feel personal, never pressured.',
    icon: 'mail-outline',
    route: 'Stage8ThankYous',
  },
  {
    id: 'gifts-money',
    title: 'Gifts & Money',
    description: 'Handle gifts and admin gently.',
    icon: 'gift-outline',
    route: 'Stage8GiftsMoney',
  },
  {
    id: 'name-change',
    title: 'Name Change & Official Admin',
    description: 'Break paperwork into doable steps.',
    icon: 'document-text-outline',
    route: 'Stage8NameChange',
  },
  {
    id: 'memories',
    title: 'Photos, Videos & Memories',
    description: 'Keep what matters without overdoing it.',
    icon: 'images-outline',
    route: 'Stage8Memories',
  },
  {
    id: 'decor-outfits',
    title: 'Décor, Outfits & Wedding Items',
    description: 'Decide what stays, sells, or is passed on.',
    icon: 'pricetags-outline',
    route: 'Stage8DecorItems',
  },
  {
    id: 'vendor-wrap',
    title: 'Vendor Wrap-Up',
    description: 'Close the loop kindly, on your timeline.',
    icon: 'briefcase-outline',
    route: 'Stage8VendorWrap',
  },
  {
    id: 'emotional-closure',
    title: 'Emotional Closure',
    description: 'Reflect without rushing yourself forward.',
    icon: 'heart-circle-outline',
    route: 'Stage8EmotionalClosure',
  },
];

export default function Stage8WrapUpScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } = useStageChecklist('stage-8');

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
      title="Your Wedding Wrap-Up"
      subtitle="Everything after the day — calmly closed, properly finished."
    >
      <Text style={styles.stageLabel}>STAGE 8</Text>
      <Text style={styles.introText}>
        Take your time here. These guides simply hold the loose ends until you’re ready.
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
        title="“It’s okay to take your time. Nothing is chasing you now.”"
        body="Pick these up when you feel ready — not because you have to."
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
