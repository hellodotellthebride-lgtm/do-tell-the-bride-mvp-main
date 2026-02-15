import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import GuideCarousel from '../../../components/roadmap/GuideCarousel';
import { roadmapColors } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';
import { useFocusEffect } from '@react-navigation/native';
import { buildChecklistNavigationTarget } from '../../../roadmap/roadmapData';
import { selectRecommendedNextStepInStage } from '../../../roadmap/selectors/selectRecommendedNextStepInStage';

const DECISION_CARDS = [
  {
    id: 'capacity',
    title: 'Guest Count & Capacity',
    description:
      'How your numbers shape everything.\nBefore browsing venues, define your maximum capacity number.',
    icon: 'people-outline',
    route: 'Stage2GuestCount',
  },
  {
    id: 'logistics',
    title: 'Logistics Reality Check',
    description:
      'Identify:\n• Seasonal weather patterns in your region\n• Travel time for majority of guests\n• Accessibility requirements\n• Local legal requirements (if relevant)',
    icon: 'navigate-outline',
    route: 'Stage2Logistics',
  },
  {
    id: 'ceremony-setup',
    title: 'Ceremony vs Reception Setup',
    description:
      'This decision affects:\n• Venue type\n• Transportation planning\n• Guest flow\n• Timeline structure',
    icon: 'hourglass-outline',
    route: 'Stage2CeremonySetup',
  },
  {
    id: 'wedding-party',
    title: 'Your Wedding Party',
    description:
      'Define roles early to understand group size, attire coordination, and timeline needs.',
    icon: 'sparkles-outline',
    route: 'Stage2WeddingParty',
  },
  {
    id: 'budget-logistics',
    title: 'Budget Structure & Payment Planning',
    description: 'Align deposits and payment timing with your overall budget plan.',
    icon: 'wallet-outline',
    route: 'Stage2BudgetLogistics',
  },
  {
    id: 'early-admin',
    title: 'Early Admin Wins',
    description: 'Set up shared folders, tracking systems, and communication channels.',
    icon: 'document-text-outline',
    route: 'Stage2EarlyAdmin',
  },
];

const STAGE_OUTCOMES = [
  'A confirmed guest maximum',
  'A defined location direction',
  'A clear ceremony structure',
  'Logistics requirements documented',
  'Budget aligned with scale',
];

const SUPPORT_CARDS = [
  {
    id: 'first-five',
    title: 'First 5 Things to Do',
    description: 'Your starting sequence — simple, logical, flexible.',
    icon: 'list-outline',
    route: 'Stage1FirstFiveThings',
  },
  {
    id: 'timeline',
    title: 'Month-by-Month Planning Timeline',
    description: 'A flexible overview based on your date, region, and priorities.',
    icon: 'calendar-outline',
    route: 'Stage1Timeline',
  },
];

export default function Stage2EarlyDecisionsScreen({ navigation, route }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } = useStageChecklist('stage-2');
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };

  const handleContinue = () => navigation?.navigate?.('Stage3DreamTeam');

  const percent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((completeCount / totalCount) * 100);
  }, [completeCount, totalCount]);

  const stageNextStep = useMemo(
    () => selectRecommendedNextStepInStage('stage-2', { 'stage-2': checkedMap }),
    [checkedMap],
  );

  const openChecklistItem = useCallback(
    (itemId) => {
      const target = buildChecklistNavigationTarget('stage-2', itemId);
      if (!target?.routeName) {
        Alert.alert('Coming soon', 'This step will be available soon.');
        return;
      }
      navigation?.navigate?.(target.routeName, target.params);
    },
    [navigation],
  );

  const autoStart = route?.params?.autoStart;
  const focusItemId = route?.params?.focusItemId;

  useFocusEffect(
    useCallback(() => {
      if (!autoStart) return;
      navigation?.setParams?.({ autoStart: undefined, focusItemId: undefined });

      const targetItemId = focusItemId ?? stageNextStep?.itemId;
      if (targetItemId) {
        openChecklistItem(targetItemId);
        return;
      }

      navigation?.navigate?.('Stage3DreamTeam');
    }, [autoStart, focusItemId, navigation, openChecklistItem, stageNextStep]),
  );

  const guides = useMemo(
    () => [
      ...DECISION_CARDS.map((card) => ({
        id: card.id,
        title: card.title,
        subtitle: card.description,
        icon: card.icon,
        route: card.route,
      })),
      ...SUPPORT_CARDS.map((card) => ({
        id: card.id,
        title: card.title,
        subtitle: card.description,
        icon: card.icon,
        route: card.route,
      })),
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color={roadmapColors.mutedText} />
          <Text style={styles.backText}>Back to Planning Path</Text>
        </Pressable>

        <Text style={styles.title}>Your Early Decisions</Text>
        <Text style={styles.subtitle}>Define the structural decisions that shape your venue search.</Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>STAGE PROGRESS</Text>
          <Text style={styles.progressPercent}>{percent}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>By the end of this stage, you'll have:</Text>
          {STAGE_OUTCOMES.map((point) => (
            <Text key={point} style={styles.summaryItem}>
              • {point}
            </Text>
          ))}
          <Text style={styles.summaryNote}>These decisions reduce overwhelm later.</Text>
        </View>

        <View style={styles.recommendedWrapper}>
          <View style={styles.recommendedShadow}>
            <View style={styles.recommendedInner}>
              <View style={styles.accentStrip} />
              <View style={styles.recommendedCard}>
                <Text style={styles.recommendedLabel}>RECOMMENDED NEXT STEP</Text>
                <Text style={styles.recommendedTitle}>
                  {stageNextStep ? stageNextStep.title : 'Stage complete'}
                </Text>
                <Text style={styles.recommendedDesc}>
                  {stageNextStep?.description ||
                    (stageNextStep
                      ? 'A small next step to keep this stage moving.'
                      : 'You’ve unlocked the next phase.')}
                </Text>

                <Pressable
                  onPress={() => {
                    const itemId = stageNextStep?.itemId;
                    if (itemId) {
                      openChecklistItem(itemId);
                      return;
                    }
                    handleContinue();
                  }}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>
                    {stageNextStep ? 'Start now' : 'Continue'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.miniChecklistContainer}>
          <Text style={styles.miniTitle}>Mini checklist</Text>
          <Text style={styles.miniSubtitle}>
            Complete these in order to keep your venue search focused.
          </Text>
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              label={item.label}
              description={item.description}
              checked={checkedMap[item.id]}
              onToggle={() => toggleItem(item.id)}
              onOpen={() => openChecklistItem(item.id)}
            />
          ))}
          <Text style={styles.miniProgress}>
            Progress: {completeCount} of {totalCount} completed
          </Text>
        </View>

        <Text style={styles.readyText}>Once these are clear, you are ready to shortlist venues.</Text>
        <Text style={styles.guidesLabel}>Helpful Planning Guides</Text>

        <GuideCarousel
          guides={guides}
          suggestedGuideIds={[]}
          completedGuideIds={[]}
          onPressGuide={(guide) => {
            if (!guide?.route) {
              Alert.alert('Coming soon', 'This guide will be available soon.');
              return;
            }
            navigation?.navigate?.(guide.route);
          }}
        />

        {completeCount === totalCount && totalCount > 0 ? (
          <CTAButton label="Continue to Stage 3 — Your Dream Team" onPress={handleContinue} />
        ) : null}

        <SoftInfoCard
          title="“You’re building the filters that protect your time.”"
          body="Once these are clear, venue shortlisting becomes calmer and more realistic."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: roadmapColors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 4,
    color: roadmapColors.mutedText,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: roadmapColors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: roadmapColors.mutedText,
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
  },
  progressPercent: {
    fontSize: 14,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: roadmapColors.border,
    borderRadius: 6,
    marginBottom: 28,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: roadmapColors.accent,
    borderRadius: 6,
  },
  summaryCard: {
    backgroundColor: roadmapColors.muted,
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: roadmapColors.textDark,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 15,
    color: roadmapColors.mutedText,
    marginBottom: 6,
    fontFamily: 'Outfit_400Regular',
  },
  summaryNote: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  recommendedWrapper: {
    marginBottom: 32,
  },
  recommendedShadow: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    backgroundColor: roadmapColors.surface,
  },
  recommendedInner: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: roadmapColors.surface,
  },
  accentStrip: {
    width: 6,
    backgroundColor: roadmapColors.accent,
  },
  recommendedCard: {
    flex: 1,
    padding: 20,
  },
  recommendedLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: roadmapColors.accent,
    marginBottom: 8,
    fontFamily: 'Outfit_500Medium',
  },
  recommendedTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: roadmapColors.textDark,
    marginBottom: 6,
  },
  recommendedDesc: {
    fontSize: 15,
    color: roadmapColors.mutedText,
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
  },
  primaryButton: {
    backgroundColor: roadmapColors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
  miniChecklistContainer: {
    backgroundColor: roadmapColors.muted,
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },
  miniTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: roadmapColors.textDark,
    marginBottom: 6,
  },
  miniSubtitle: {
    fontSize: 14,
    color: roadmapColors.mutedText,
    marginBottom: 16,
    fontFamily: 'Outfit_400Regular',
  },
  miniProgress: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.mutedText,
  },
  readyText: {
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  guidesLabel: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1.5,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
    textTransform: 'uppercase',
  },
});
