import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import GuideCarousel from '../../../components/roadmap/GuideCarousel';
import { roadmapColors } from '../../../components/roadmap/tokens';
import useStageChecklist from '../../../roadmap/useStageChecklist';
import { stage4Config } from '../../../roadmap/stages/stage4';
import { stage4Guides } from '../../../roadmap/guides/stage4Guides';
import { loadGuideState } from '../../../roadmap/guideStorage';
import { useFocusEffect } from '@react-navigation/native';
import { buildChecklistNavigationTarget } from '../../../roadmap/roadmapData';
import { selectRecommendedNextStepInStage } from '../../../roadmap/selectors/selectRecommendedNextStepInStage';

function StageChecklistRow({
  label,
  description,
  checked,
  highlighted,
  onToggle,
  onOpen,
}) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [
        styles.checkRow,
        highlighted && styles.checkRowHighlighted,
        pressed && styles.checkRowPressed,
      ]}
      hitSlop={8}
    >
      <Pressable
        onPress={(event) => {
          event?.stopPropagation?.();
          onToggle?.();
        }}
        hitSlop={10}
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!checked }}
        accessibilityLabel={checked ? `Mark ${label} incomplete` : `Mark ${label} complete`}
      >
        {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.checkLabel}>{label}</Text>
        {description ? <Text style={styles.checkDescription}>{description}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(43,43,43,0.5)" />
    </Pressable>
  );
}

export default function Stage4GuestsInvitationsScreen({ navigation, route }) {
  const { items, checkedMap, toggleItem } = useStageChecklist(stage4Config.id);
  const [guideProgressMap, setGuideProgressMap] = useState({});

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadGuideState().then((state) => {
        if (!active) return;
        setGuideProgressMap(state?.[stage4Config.id] ?? {});
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };

  const itemById = useMemo(
    () =>
      items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    [items],
  );

  const checklist = useMemo(
    () =>
      stage4Config.checklist.map((entry) => ({
        id: entry.id,
        route: entry.route,
        label: itemById[entry.id]?.label ?? entry.id,
        description: itemById[entry.id]?.description,
      })),
    [itemById],
  );

  const completeCount = useMemo(
    () => checklist.reduce((sum, item) => sum + (checkedMap[item.id] ? 1 : 0), 0),
    [checklist, checkedMap],
  );
  const totalCount = checklist.length;
  const percent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((completeCount / totalCount) * 100);
  }, [completeCount, totalCount]);

  const handleContinue = () => {
    navigation?.navigate?.(stage4Config.continue.route);
  };

  const stageNextStep = useMemo(
    () => selectRecommendedNextStepInStage(stage4Config.id, { [stage4Config.id]: checkedMap }),
    [checkedMap],
  );

  const openChecklistItem = useCallback(
    (itemId) => {
      const target = buildChecklistNavigationTarget(stage4Config.id, itemId);
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

      navigation?.navigate?.(stage4Config.continue.route);
    }, [autoStart, focusItemId, navigation, openChecklistItem, stageNextStep]),
  );

  const shouldHighlightRsvps = !!checkedMap['create-invitations'] && !checkedMap['manage-rsvps'];
  const shouldSuggestPoliciesFirst =
    (!!checkedMap['send-save-dates'] || !!checkedMap['create-invitations']) &&
    !checkedMap['guest-policies'];

  const suggestedGuideIds = useMemo(() => {
    const ids = [];
    if (!checkedMap['guest-policies']) {
      ids.push('children-policy', 'family-dynamics');
    }
    if (!checkedMap['send-save-dates']) {
      ids.push('destination-support');
    }
    if (!checkedMap['accessibility-comfort']) {
      ids.push('cultural-multi-day');
    }
    const deduped = [...new Set(ids)];
    return deduped.slice(0, 2);
  }, [checkedMap]);

  const completedGuideIds = useMemo(
    () =>
      stage4Guides
        .filter((guide) => guideProgressMap?.[guide.id]?.completed)
        .map((guide) => guide.id),
    [guideProgressMap],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color={roadmapColors.mutedText} />
          <Text style={styles.backText}>Back to Planning Path</Text>
        </Pressable>

        <Text style={styles.title}>{stage4Config.title}</Text>
        <Text style={styles.subtitle}>{stage4Config.subtitle}</Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>STAGE PROGRESS</Text>
          <Text style={styles.progressPercent}>{percent}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>By the end of this stage, you'll have:</Text>
          {stage4Config.outcomes.map((point) => (
            <Text key={point} style={styles.summaryItem}>
              • {point}
            </Text>
          ))}
          <Text style={styles.summaryNote}>{stage4Config.note}</Text>
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
            Complete these in order to make your guest system operational.
          </Text>
          {checklist.map((item) => (
            <StageChecklistRow
              key={item.id}
              label={item.label}
              description={item.description}
              checked={!!checkedMap[item.id]}
              onToggle={() => toggleItem(item.id)}
              onOpen={() => openChecklistItem(item.id)}
              highlighted={item.id === 'manage-rsvps' && shouldHighlightRsvps}
            />
          ))}
          <Text style={styles.miniProgress}>
            Progress: {completeCount} of {totalCount} completed
          </Text>

          {shouldSuggestPoliciesFirst ? (
            <View style={styles.hintRow}>
              <Ionicons name="information-circle-outline" size={16} color={roadmapColors.mutedText} />
              <Text style={styles.hintText}>
                You haven’t finalised guest policies yet — want to do that first?
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.guidesLabel}>Helpful Planning Guides</Text>

        <GuideCarousel
          guides={stage4Guides}
          suggestedGuideIds={suggestedGuideIds}
          completedGuideIds={completedGuideIds}
          onPressGuide={(guide) =>
            navigation?.navigate?.('GuideDetail', {
              stageId: stage4Config.id,
              guideId: guide.id,
            })
          }
        />

        {completeCount === totalCount && totalCount > 0 ? (
          <CTAButton label={stage4Config.continue.label} onPress={handleContinue} />
        ) : null}

        <SoftInfoCard title={stage4Config.footer.title} body={stage4Config.footer.body} />
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
  checkRow: {
    backgroundColor: roadmapColors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: roadmapColors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  checkRowPressed: {
    opacity: 0.85,
  },
  checkRowHighlighted: {
    borderWidth: 1.5,
    borderColor: roadmapColors.accent,
    backgroundColor: 'rgba(255,155,133,0.15)',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: roadmapColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkboxChecked: {
    backgroundColor: roadmapColors.accent,
  },
  checkLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
    marginBottom: 2,
  },
  checkDescription: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  hintRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  guidesLabel: {
    marginTop: 12,
    fontSize: 12,
    letterSpacing: 1.5,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_500Medium',
    textTransform: 'uppercase',
  },
});
