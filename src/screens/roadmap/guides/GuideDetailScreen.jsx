import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';
import GuideStepCard from '../../../components/roadmap/GuideStepCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { getGuideById, getGuidesForStage } from '../../../roadmap/guides';
import {
  loadGuideState,
  markGuideCompleted,
  updateGuideProgress,
} from '../../../roadmap/guideStorage';

const clampIndex = (value, max) => {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
};

export default function GuideDetailScreen({ navigation, route }) {
  const { stageId, guideId } = route?.params ?? {};
  const { width } = useWindowDimensions();
  const listRef = useRef(null);

  const guide = useMemo(() => getGuideById(stageId, guideId), [stageId, guideId]);
  const stageGuides = useMemo(() => getGuidesForStage(stageId), [stageId]);

  const steps = guide?.steps ?? [];
  const pages = useMemo(() => {
    const stepPages = steps.map((step) => ({ type: 'step', step }));
    return [...stepPages, { type: 'end' }];
  }, [steps]);

  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guideState, setGuideState] = useState(null);

  const totalSteps = steps.length;
  const isEnd = currentIndex === pages.length - 1;

  const loadProgress = useCallback(async () => {
    if (!stageId || !guideId) return;
    const state = await loadGuideState();
    const stageState = state?.[stageId] ?? {};
    const progress = stageState?.[guideId] ?? null;
    setGuideState(stageState);
    setCompleted(!!progress?.completed);

    const initialIndex = progress?.completed
      ? pages.length - 1
      : clampIndex(progress?.lastStepIndex ?? 0, pages.length - 1);

    setCurrentIndex(initialIndex);
    setReady(true);

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex?.({ index: initialIndex, animated: false });
    });

    updateGuideProgress(stageId, guideId, { lastOpenedAt: Date.now() });
  }, [guideId, pages.length, stageId]);

  useEffect(() => {
    setReady(false);
    setGuideState(null);
    setCompleted(false);
    setCurrentIndex(0);
    loadProgress();
  }, [loadProgress]);

  const handleBack = () => {
    navigation?.goBack?.();
  };

  const handleIndexChanged = useCallback(
    (index) => {
      setCurrentIndex(index);
      if (!stageId || !guideId) return;
      updateGuideProgress(stageId, guideId, { lastStepIndex: index });
    },
    [guideId, stageId],
  );

  const handleMomentumEnd = (event) => {
    const x = event?.nativeEvent?.contentOffset?.x ?? 0;
    const nextIndex = Math.round(x / width);
    handleIndexChanged(clampIndex(nextIndex, pages.length - 1));
  };

  const scrollToIndex = (index) => {
    listRef.current?.scrollToIndex?.({ index, animated: true });
    handleIndexChanged(index);
  };

  const goPrev = () => {
    const next = Math.max(currentIndex - 1, 0);
    scrollToIndex(next);
  };

  const goNext = () => {
    const next = Math.min(currentIndex + 1, pages.length - 1);
    scrollToIndex(next);
  };

  const handleMarkComplete = async () => {
    if (!stageId || !guideId) return;
    await markGuideCompleted(stageId, guideId);
    setCompleted(true);
    Alert.alert('Marked as done', 'Nice. One less thing future-you has to deal with.');
  };

  const nextGuide = useMemo(() => {
    if (!stageGuides.length) return null;
    const next = stageGuides.find((g) => {
      if (g.id === guideId) return false;
      const progress = guideState?.[g.id];
      return !progress?.completed;
    });
    return next ?? null;
  }, [guideId, guideState, stageGuides]);

  const handleNextGuide = () => {
    if (!nextGuide) return;
    navigation?.setParams?.({ guideId: nextGuide.id });
  };

  if (!guide) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color="#6F5B55" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <SoftInfoCard
          title="Guide not found"
          body="This guide isn’t available yet. Please try another one."
        />
      </SafeAreaView>
    );
  }

  const stepProgressText = totalSteps > 0 ? `${Math.min(currentIndex + 1, totalSteps)} / ${totalSteps}` : '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color="#6F5B55" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        {stepProgressText ? <Text style={styles.progressText}>{stepProgressText}</Text> : null}
      </View>

      <Text style={styles.title}>{guide.title}</Text>
      <Text style={styles.subtitle}>{guide.subtitle}</Text>

      <View style={styles.pager}>
        {ready ? (
          <FlatList
            ref={listRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={pages}
            keyExtractor={(_, index) => `${guide.id}-${index}`}
            onMomentumScrollEnd={handleMomentumEnd}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <View style={[styles.page, { width }]}>
                <View style={styles.pageInner}>
                  {item.type === 'step' ? (
                    <GuideStepCard
                      index={index}
                      total={totalSteps}
                      title={item.step.title}
                      bullets={item.step.bullets}
                      scripts={item.step.scripts}
                    />
                  ) : (
                    <View style={styles.endCard}>
                      <Text style={styles.endTitle}>Nice.</Text>
                      <Text style={styles.endBody}>
                        One less thing future-you has to deal with.
                      </Text>

                      {!completed ? (
                        <CTAButton label="Mark guide complete" onPress={handleMarkComplete} />
                      ) : (
                        <SoftInfoCard title="Done" body="You’ve already completed this guide." />
                      )}

                      {nextGuide ? (
                        <Pressable
                          onPress={handleNextGuide}
                          style={({ pressed }) => [
                            styles.nextGuideButton,
                            pressed && styles.nextGuideButtonPressed,
                          ]}
                        >
                          <Text style={styles.nextGuideText}>
                            Next recommended guide: {nextGuide.title} →
                          </Text>
                        </Pressable>
                      ) : null}

                      <Pressable
                        onPress={() => navigation?.goBack?.()}
                        style={({ pressed }) => [
                          styles.backToChecklistButton,
                          pressed && styles.nextGuideButtonPressed,
                        ]}
                      >
                        <Text style={styles.backToChecklistText}>Back to checklist</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}
          />
        ) : null}
      </View>

      <View style={styles.navBar}>
        <Pressable
          onPress={goPrev}
          disabled={currentIndex === 0}
          style={({ pressed }) => [
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
            pressed && styles.navButtonPressed,
          ]}
        >
          <Ionicons name="chevron-back" size={18} color={roadmapColors.textDark} />
          <Text style={styles.navText}>Prev</Text>
        </Pressable>

        <Pressable
          onPress={goNext}
          disabled={isEnd}
          style={({ pressed }) => [
            styles.navButton,
            isEnd && styles.navButtonDisabled,
            pressed && styles.navButtonPressed,
          ]}
        >
          <Text style={styles.navText}>Next</Text>
          <Ionicons name="chevron-forward" size={18} color={roadmapColors.textDark} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: roadmapColors.background,
    paddingHorizontal: roadmapSpacing.pageGutter,
    paddingTop: 12,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 4,
    color: '#6F5B55',
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.mutedText,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  pager: {
    flex: 1,
    marginTop: 16,
  },
  page: {
    flex: 1,
  },
  pageInner: {
    flex: 1,
    paddingBottom: 16,
  },
  endCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: roadmapColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 1,
    gap: 12,
  },
  endTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  endBody: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
  nextGuideButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.32)',
    backgroundColor: 'rgba(255,155,133,0.10)',
  },
  nextGuideButtonPressed: {
    opacity: 0.85,
  },
  nextGuideText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  backToChecklistButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  backToChecklistText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 8,
  },
  navButtonPressed: {
    opacity: 0.85,
  },
  navButtonDisabled: {
    opacity: 0.45,
  },
  navText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
});

