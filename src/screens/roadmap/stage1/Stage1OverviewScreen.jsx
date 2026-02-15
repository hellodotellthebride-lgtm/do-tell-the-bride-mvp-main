import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CTAButton from '../../../components/roadmap/CTAButton';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import { roadmapColors } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import GuideCarousel from '../../../components/roadmap/GuideCarousel';
import { useFocusEffect } from '@react-navigation/native';
import { buildChecklistNavigationTarget } from '../../../roadmap/roadmapData';
import { selectRecommendedNextStepInStage } from '../../../roadmap/selectors/selectRecommendedNextStepInStage';
import { colors as themeColors } from '../../../theme';

const SECTION_CARDS = [
  {
    id: 'set-budget',
    title: 'Budget Breakdown & Allocation',
    description: 'Turn your range into categories and clarity.',
    icon: 'wallet-outline',
    route: 'Stage1SetYourBudget',
  },
  {
    id: 'budget-buffer',
    title: 'Budget Buffer & Emergency Costs',
    description: 'Build in a 5–15% buffer for calm decision-making.',
    icon: 'shield-checkmark-outline',
    route: 'Stage1BudgetBuffer',
  },
];

const STAGE_OUTPUTS = [
  'A budget range',
  'A guest count estimate range',
  'A target date or season',
  'A defined wedding type',
  'Your top 3 priorities',
];

export default function Stage1OverviewScreen({ navigation, route }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } =
    useStageChecklist('stage-1');
  const handleBack = () => navigation?.goBack?.();
  const handleContinue = () => {
    navigation?.navigate?.('Stage2EarlyDecisions');
  };

  const percent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((completeCount / totalCount) * 100);
  }, [completeCount, totalCount]);

  const stageNextStep = useMemo(
    () => selectRecommendedNextStepInStage('stage-1', { 'stage-1': checkedMap }),
    [checkedMap],
  );

  const openChecklistItem = useCallback(
    (itemId) => {
      const target = buildChecklistNavigationTarget('stage-1', itemId);
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

      navigation?.navigate?.('Stage2EarlyDecisions');
    }, [autoStart, focusItemId, navigation, openChecklistItem, stageNextStep]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color={themeColors.textSecondary} />
          <Text style={styles.backText}>Back to Wedding Roadmap</Text>
        </Pressable>

        <Text style={styles.title}>Your Beginning</Text>
        <Text style={styles.subtitle}>Set your tone, your budget, your first breath.</Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>STAGE PROGRESS</Text>
          <Text style={styles.progressPercent}>{percent}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>By the end of this stage, you'll have:</Text>
          {STAGE_OUTPUTS.map((point) => (
            <Text key={point} style={styles.summaryItem}>
              • {point}
            </Text>
          ))}
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
          <Text style={styles.miniSubtitle}>Tick what feels helpful, skip what doesn’t.</Text>

          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              label={item.label}
              description={item.description}
              checked={!!checkedMap[item.id]}
              onToggle={() => toggleItem(item.id)}
              onOpen={() => openChecklistItem(item.id)}
            />
          ))}

          <Text style={styles.miniProgress}>
            {completeCount} of {totalCount} completed
          </Text>
        </View>

        <Text style={styles.guidesLabel}>Helpful Planning Guides</Text>
        <GuideCarousel
          guides={SECTION_CARDS.map((card) => ({
            id: card.id,
            title: card.title,
            subtitle: card.description,
            icon: card.icon,
            route: card.route,
          }))}
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
          <CTAButton
            label="Continue to Stage 2 — Your Early Decisions"
            onPress={handleContinue}
          />
        ) : null}

        <SoftInfoCard
          title="“Small, clear decisions create calm momentum.”"
          body="Set your parameters gently. Everything gets easier after this."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themeColors.background,
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
    color: themeColors.textSecondary,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: themeColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.textSecondary,
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
    color: themeColors.textSecondary,
    fontFamily: 'Outfit_500Medium',
  },
  progressPercent: {
    fontSize: 14,
    color: themeColors.textSecondary,
    fontFamily: 'Outfit_500Medium',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: themeColors.muted,
    borderRadius: 6,
    marginBottom: 28,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: themeColors.primary,
    borderRadius: 6,
  },
  summaryCard: {
    backgroundColor: themeColors.muted,
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: themeColors.text,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 15,
    color: themeColors.textSecondary,
    marginBottom: 6,
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
    backgroundColor: themeColors.surface,
  },
  recommendedInner: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: themeColors.surface,
  },
  accentStrip: {
    width: 6,
    backgroundColor: themeColors.primary,
  },
  recommendedCard: {
    flex: 1,
    padding: 20,
  },
  recommendedLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: themeColors.primary,
    marginBottom: 8,
    fontFamily: 'Outfit_500Medium',
  },
  recommendedTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: themeColors.text,
    marginBottom: 6,
  },
  recommendedDesc: {
    fontSize: 15,
    color: themeColors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
  },
  primaryButton: {
    backgroundColor: themeColors.primary,
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
    backgroundColor: themeColors.muted,
    padding: 20,
    borderRadius: 24,
    marginBottom: 40,
  },
  miniTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: themeColors.text,
    marginBottom: 6,
  },
  miniSubtitle: {
    fontSize: 14,
    color: themeColors.textSecondary,
    marginBottom: 16,
    fontFamily: 'Outfit_400Regular',
  },
  miniProgress: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: themeColors.textSecondary,
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
