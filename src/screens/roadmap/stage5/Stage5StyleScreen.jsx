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
    id: 'dress-plan',
    title: 'Plan Your Wedding Dress',
    description: 'From first fittings to final touches — a calm, structured plan.',
    icon: 'body-outline',
    route: 'Stage5WeddingDress',
  },
  {
    id: 'bridesmaid',
    title: 'Bridesmaid Dresses Planner',
    description: 'A step-by-step guide to dressing your bridal party.',
    icon: 'people-outline',
    route: 'Stage5BridesmaidPlanner',
  },
  {
    id: 'groom-style',
    title: 'Groom & Groomsmen Style Guide',
    description: 'Comfortable, confident, and true to your style.',
    icon: 'shirt-outline',
    route: 'Stage5GroomStyle',
  },
  {
    id: 'sustainable-fashion',
    title: 'Sustainable & Budget-Friendly Fashion',
    description: 'Look amazing, waste less, spend smart.',
    icon: 'leaf-outline',
    route: 'Stage5SustainableFashion',
  },
  {
    id: 'stag-hen',
    title: 'Stag & Hen Party Planner',
    description: 'Simple, stress-free celebrations.',
    icon: 'sparkles-outline',
    route: 'Stage5StagHen',
  },
  {
    id: 'photo-video',
    title: 'Photo & Video Plan',
    description: 'A clear guide for capturing what matters most.',
    icon: 'camera-outline',
    route: 'Stage5PhotoVideo',
  },
  {
    id: 'cultural',
    title: 'Cultural & Religious Traditions',
    description: 'Honour what matters most to you.',
    icon: 'earth-outline',
    route: 'Stage5CulturalTraditions',
  },
];

export default function Stage5StyleScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } = useStageChecklist('stage-5');

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };

  const handleCardPress = (card) => {
    if (card.route) {
      navigation?.navigate?.(card.route);
    }
  };

  return (
    <StageScreenContainer
      backLabel="Back to Planning Path"
      onBackPress={handleBack}
      title="Your Wedding Style"
      subtitle="A calm guide to outfits, parties, and details that feel like you."
    >
      <Text style={styles.stageLabel}>STAGE 5</Text>
      <Text style={styles.introText}>
        This stage keeps the joyful parts grounded — fashion, celebrations, and traditions that feel
        intentional instead of pressured.
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
          onPress={() => handleCardPress(card)}
        />
      ))}

      <SoftInfoCard
        title="“This should stay fun.”"
        body="Use these guides to keep style decisions joyful, not performative."
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
