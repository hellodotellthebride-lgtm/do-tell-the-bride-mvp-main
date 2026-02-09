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
    id: 'final-week-checklist',
    title: 'Final Week Checklist',
    description: 'Calm reminders so nothing needs last-minute energy.',
    icon: 'checkbox-outline',
    route: 'Stage7FinalWeekChecklist',
  },
  {
    id: 'wedding-morning',
    title: 'Wedding Morning Prep',
    description: 'Keep the start of the day slow and nourishing.',
    icon: 'sunny-outline',
    route: 'Stage7MorningPrep',
  },
  {
    id: 'rain-plan',
    title: 'Rain Plan',
    description: 'Know exactly what happens if the weather shifts.',
    icon: 'cloud-outline',
    route: 'Stage7RainPlan',
  },
  {
    id: 'letters',
    title: 'Letters & Meaningful Moments',
    description: 'Protect space for the words that matter.',
    icon: 'heart-outline',
    route: 'Stage7LettersMoments',
  },
  {
    id: 'boundaries',
    title: 'Morning-of Boundaries & Expectations',
    description: 'Keep your focus and energy exactly where you want it.',
    icon: 'shield-outline',
    route: 'Stage7MorningBoundaries',
  },
  {
    id: 'delegation',
    title: 'Delegation & Handover',
    description: 'Move responsibility off your shoulders completely.',
    icon: 'people-circle-outline',
    route: 'Stage7Delegation',
  },
  {
    id: 'timeline',
    title: 'Wedding Day Timeline Cards',
    description: 'Share clear cards so everyone knows what happens when.',
    icon: 'time-outline',
    route: 'Stage7TimelineCards',
  },
  {
    id: 'honeymoon',
    title: 'Honeymoon Prep & Travel',
    description: 'Glide from celebration to rest without scrambling.',
    icon: 'airplane-outline',
    route: 'Stage7HoneymoonPrep',
  },
];

export default function Stage7WeddingWeekScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } = useStageChecklist('stage-7');

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
      title="Your Wedding Week"
      subtitle="Ready, calm, and only moments that matter most."
    >
      <Text style={styles.stageLabel}>STAGE 7</Text>
      <Text style={styles.introText}>
        Use this space to keep the final days simple. Everything essential is captured here so you can
        focus on being present.
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
        title="“Everything important is covered. You can just be here.”"
        body="Share these guides with the people supporting you, then let them hold the rest."
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
