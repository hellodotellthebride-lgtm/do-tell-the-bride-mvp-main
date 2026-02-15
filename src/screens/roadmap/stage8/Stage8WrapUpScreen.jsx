import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import GuideCarousel from '../../../components/roadmap/GuideCarousel';
import { roadmapColors } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';
import { useFocusEffect } from '@react-navigation/native';
import { buildChecklistNavigationTarget } from '../../../roadmap/roadmapData';
import { selectRecommendedNextStepInStage } from '../../../roadmap/selectors/selectRecommendedNextStepInStage';

const STAGE_OUTPUTS = [
  'All vendors fully paid and closed',
  'All legal admin handled (if relevant)',
  'Thank-yous sent or planned',
  'Photos safely stored',
  'A conscious emotional transition',
];

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
    title: 'Gifts, Payments & Reconciliation',
    description:
      'Track gifts received, final balances paid, and anything outstanding — calmly and clearly.',
    icon: 'gift-outline',
    route: 'Stage8GiftsMoney',
  },
  {
    id: 'name-change',
    title: 'Legal & Identity Updates (Optional)',
    description:
      'If your name, documents, or legal status changes, break it into small, manageable steps.',
    icon: 'document-text-outline',
    route: 'Stage8NameChange',
  },
  {
    id: 'memories',
    title: 'Photos, Videos & Memory Keeping',
    description:
      'Download, back up, print, or archive what matters most — without pressure to do it all at once.',
    icon: 'images-outline',
    route: 'Stage8Memories',
  },
  {
    id: 'decor-outfits',
    title: 'Wedding Items: Keep, Sell, Donate or Store',
    description: 'Decide what continues with you — and what moves on.',
    icon: 'pricetags-outline',
    route: 'Stage8DecorItems',
  },
  {
    id: 'vendor-wrap',
    title: 'Vendor Finalisation & Reviews',
    description:
      'Confirm all balances are closed, leave reviews if you wish, and formally complete agreements.',
    icon: 'briefcase-outline',
    route: 'Stage8VendorWrap',
  },
  {
    id: 'emotional-closure',
    title: 'Reflection & Emotional Closure',
    description: 'Mark the transition intentionally — celebrate, journal, or simply rest.',
    icon: 'heart-circle-outline',
    route: 'Stage8EmotionalClosure',
  },
];

export default function Stage8WrapUpScreen({ navigation, route }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } = useStageChecklist('stage-8');

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };

  const handleDone = () => navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });

  const percent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((completeCount / totalCount) * 100);
  }, [completeCount, totalCount]);

  const stageNextStep = useMemo(
    () => selectRecommendedNextStepInStage('stage-8', { 'stage-8': checkedMap }),
    [checkedMap],
  );

  const openChecklistItem = useCallback(
    (itemId) => {
      const target = buildChecklistNavigationTarget('stage-8', itemId);
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

      navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
    }, [autoStart, focusItemId, navigation, openChecklistItem, stageNextStep]),
  );

  const guides = useMemo(
    () =>
      NAV_CARDS.map((card) => ({
        id: card.id,
        title: card.title,
        subtitle: card.description,
        icon: card.icon,
        route: card.route,
      })),
    [],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color={roadmapColors.mutedText} />
          <Text style={styles.backText}>Back to Planning Path</Text>
        </Pressable>

        <Text style={styles.title}>Your Wedding Wrap-Up</Text>
        <Text style={styles.subtitle}>
          Everything after the day — calmly closed, properly finished.
        </Text>

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
                      : 'You’ve closed the loop — nothing is chasing you now.')}
                </Text>

                <Pressable
                  onPress={() => {
                    const itemId = stageNextStep?.itemId;
                    if (itemId) {
                      openChecklistItem(itemId);
                      return;
                    }
                    handleDone();
                  }}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>
                    {stageNextStep ? 'Start now' : 'Done'}
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
            Progress: {completeCount} of {totalCount} completed
          </Text>
        </View>

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

        <SoftInfoCard
          title="“It’s okay to take your time. Nothing is chasing you now.”"
          body="Pick these up when you feel ready — not because you have to."
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
  guidesLabel: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1.5,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
    textTransform: 'uppercase',
  },
});
