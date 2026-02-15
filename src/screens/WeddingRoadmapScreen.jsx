import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import RoadmapPaceCard from '../components/roadmap/RoadmapPaceCard';
import RecommendedNextStepCard from '../components/roadmap/RecommendedNextStepCard';
import StageCard from '../components/roadmap/StageCard';
import IvyHelpFab from '../components/ui/IvyHelpFab';
import { useFocusEffect } from '@react-navigation/native';
import { colors as themeColors } from '../theme';
import {
  computeStageProgress,
  computeOverallProgress,
  loadChecklistState,
} from '../roadmap/progressStorage';
import { getChecklistItems } from '../roadmap/checklists';

const COLORS = {
  accent: themeColors.primary,
  accentDark: themeColors.primary,
  card: themeColors.surface,
  mutedText: themeColors.textSecondary,
  text: themeColors.text,
  divider: themeColors.border,
};

const GRADIENT_COLORS = [themeColors.muted, themeColors.background, themeColors.background];

const STAGE_ROUTES = {
  'stage-1': 'Stage1Overview',
  'stage-2': 'Stage2EarlyDecisions',
  'stage-3': 'Stage3DreamTeam',
  'stage-4': 'Stage4GuestsInvitations',
  'stage-5': 'Stage5Style',
  'stage-6': 'Stage6FinalDetails',
  'stage-7': 'Stage7WeddingWeek',
  'stage-8': 'Stage8WrapUp',
};

const STAGE_BASE = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Your Beginning',
    description: 'Set your tone, your budget, and your first decisions.',
    chips: [
      { id: 'vision-mood', label: 'Vision & mood' },
      { id: 'budget-outline', label: 'Budget outline' },
      { id: 'timeline', label: 'Timeline' },
    ],
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Your Early Decisions',
    description: 'Shortlist venues and research the vendors that feel right.',
    chips: [
      { id: 'venue-shortlist', label: 'Venue shortlist' },
      { id: 'vendor-research', label: 'Vendor research' },
      { id: 'timeline-planning', label: 'Timeline planning' },
    ],
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Your Dream Team',
    description: 'Book the people who will bring it to life.',
    chips: [
      { id: 'booking-process', label: 'Booking process' },
      { id: 'meeting-prep', label: 'Meeting prep' },
      { id: 'eco-friendly', label: 'Eco-friendly' },
      { id: 'diy-vs-pro', label: 'DIY vs Pro' },
    ],
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Guest List & Invitations',
    description: 'Start inviting and tracking the people you love.',
    chips: [
      { id: 'guest-list', label: 'Guest list' },
      { id: 'save-dates', label: 'Save the dates' },
      { id: 'invitations', label: 'Invitations' },
      { id: 'rsvp-tracking', label: 'RSVP tracking' },
    ],
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Wedding Style',
    description: 'Define the look, fashion, and feeling of the day.',
    chips: [
      { id: 'wedding-vibe', label: 'Wedding vibe' },
      { id: 'bridal-party-style', label: 'Bridal party style' },
      { id: 'sustainable-fashion', label: 'Sustainable fashion' },
      { id: 'style-planning', label: 'Style & planning' },
    ],
  },
  {
    id: 'stage-6',
    stageNumber: 6,
    title: 'Final Touches',
    description: 'Pull together seating, rings, vows, and music.',
    chips: [
      { id: 'seating-plan', label: 'Seating plan' },
      { id: 'rings-jewellery', label: 'Rings & jewellery' },
      { id: 'touch-vows', label: 'Touch & vows' },
      { id: 'favors-gifts', label: 'Favors & gifts' },
      { id: 'music-dance', label: 'Music & first dance' },
    ],
  },
  {
    id: 'stage-7',
    stageNumber: 7,
    title: 'Wedding Week',
    description: 'Keep calm through your final week and wedding morning.',
    chips: [
      { id: 'final-checklist', label: 'Final week checklist' },
      { id: 'morning-prep', label: 'Wedding morning prep' },
      { id: 'letters-moments', label: 'Letters & moments' },
      { id: 'delegation', label: 'Delegation' },
      { id: 'timeline-cards', label: 'Timeline cards' },
      { id: 'honeymoon-prep', label: 'Honeymoon prep' },
    ],
  },
  {
    id: 'stage-8',
    stageNumber: 8,
    title: 'Wedding Wrap-Up',
    description: 'Tie the loop with gratitude, returns, and keepsakes.',
    chips: [
      { id: 'thank-you-notes', label: 'Thank-you notes' },
      { id: 'photo-delivery', label: 'Photo delivery' },
      { id: 'vendor-payments', label: 'Vendor payments' },
      { id: 'dress-care', label: 'Dress care' },
      { id: 'rentals-return', label: 'Rentals return' },
      { id: 'name-changes', label: 'Name changes' },
    ],
  },
];

const mapStageProgress = (stage, checklistState) => {
  const progress = computeStageProgress(stage.id, checklistState);
  const chipDoneCount =
    stage.chips.length > 0
      ? Math.round(
          (progress.total > 0 ? progress.complete / progress.total : 0) *
            stage.chips.length,
        )
      : 0;
  return {
    ...stage,
    progress: progress.percent,
    complete: progress.complete,
    total: progress.total,
    chips: stage.chips.map((chip, chipIndex) => ({
      ...chip,
      done: chipIndex < chipDoneCount,
    })),
  };
};

const WeddingRoadmapScreen = ({ navigation }) => {
  const [checklistState, setChecklistState] = useState({});
  const enterAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      loadChecklistState().then((state) => {
        if (isActive) {
          setChecklistState(state);
        }
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enterAnim]);

  const stages = useMemo(
    () => STAGE_BASE.map((stage) => mapStageProgress(stage, checklistState)),
    [checklistState],
  );

  const overallProgress = useMemo(
    () => computeOverallProgress(checklistState),
    [checklistState],
  );

  const globalNextStep = useMemo(() => {
    for (const stage of STAGE_BASE) {
      const stageMap = checklistState?.[stage.id] ?? {};
      const items = getChecklistItems(stage.id);
      const nextItem = items.find((item) => !stageMap?.[item.id]);
      if (nextItem) {
        return {
          stageId: stage.id,
          stageNumber: stage.stageNumber,
          itemId: nextItem.id,
          title: nextItem.label,
          description: nextItem.description,
        };
      }
    }
    return null;
  }, [checklistState]);

  const currentStageNumber = globalNextStep?.stageNumber ?? STAGE_BASE.length;
  const totalStages = STAGE_BASE.length;

  const paceStatusLabel = useMemo(() => {
    if (overallProgress >= 100) return 'Complete';
    if (overallProgress > 0) return 'In progress';
    return 'Ready when you are';
  }, [overallProgress]);

  const navigateToStage = useCallback(
    (stageId, params) => {
      const routeName = STAGE_ROUTES[stageId];
      if (routeName) {
        navigation?.navigate?.(routeName, params);
        return;
      }
      Alert.alert('Coming soon', 'This stage will unlock soon.');
    },
    [navigation],
  );

  const handleStagePress = (stage) => {
    navigateToStage(stage.id);
  };

  const handleChipPress = (stage, chip) => {
    if (stage.id === 'stage-1' || stage.id === 'stage-2' || stage.id === 'stage-3' || stage.id === 'stage-4') {
      navigateToStage(stage.id);
      return;
    }
    Alert.alert('Resources coming soon', 'We’re still building this guide.');
  };

  const handleResourcesPress = () => {
    Alert.alert('Coming soon', 'Planning resources will live here soon.');
  };

  const handleBack = () => {
    navigation?.goBack?.();
  };

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.gradient}>
      <View pointerEvents="none" style={styles.glowTopRight} />
      <View pointerEvents="none" style={styles.glowMid} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: enterAnim,
              transform: [
                {
                  translateY: enterAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            }}
          >
            <Pressable hitSlop={10} onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={18} color={COLORS.text} />
            </Pressable>

            <Text style={styles.screenTitle}>Your Wedding Roadmap</Text>
            <Text style={styles.screenSubtitle}>
              {totalStages} calm stages guiding you from first decision to wedding day confidence.
            </Text>

            <View style={styles.sectionSpacingLg} />

            <RoadmapPaceCard
              statusLabel={paceStatusLabel}
              progressPercent={overallProgress}
              stageLine={
                overallProgress >= 100
                  ? 'You’ve completed your roadmap — future you is grateful.'
                  : `You’re currently in Stage ${currentStageNumber} of ${totalStages}.`
              }
            />

            <View style={styles.sectionSpacingMd} />

            <RecommendedNextStepCard
              title={globalNextStep ? globalNextStep.title : 'You’re all caught up'}
              body={
                globalNextStep?.description ||
                (globalNextStep
                  ? 'A small next step to keep your plan moving.'
                  : 'Everything in your plan is marked complete.')
              }
              ctaLabel={globalNextStep ? 'Continue' : 'View stages'}
              onPress={() => {
                if (globalNextStep) {
                  navigateToStage(globalNextStep.stageId, {
                    autoStart: true,
                    focusItemId: globalNextStep.itemId,
                  });
                  return;
                }
                navigateToStage('stage-8');
              }}
            />

            <View style={styles.sectionSpacingLg} />

            <Text style={styles.sectionTitle}>PLANNING STAGES</Text>

            <View style={styles.sectionSpacingSm} />

            {stages.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                onPress={() => handleStagePress(stage)}
                onTagPress={(chip) => handleChipPress(stage, chip)}
              />
            ))}

            <Pressable style={styles.resourcesCard} onPress={handleResourcesPress}>
              <View style={styles.resourcesHeader}>
                <Text style={styles.resourcesTitle}>Planning Resources & Guides</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.mutedText} />
              </View>
              <Text style={styles.resourcesBody}>
                Access all your Do Tell The Bride printable PDFs and downloads in one calm space.
              </Text>
              <Text style={styles.resourcesQuote}>
                “This? Not archived — we’re right there with you.”
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
        <IvyHelpFab insetRight={20} insetBottom={20} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  glowTopRight: {
    position: 'absolute',
    top: -160,
    right: -140,
    width: 380,
    height: 380,
    borderRadius: 380,
    backgroundColor: 'rgba(255,155,133,0.18)',
    opacity: 0.8,
  },
  glowMid: {
    position: 'absolute',
    top: 220,
    left: -180,
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: 'rgba(255,155,133,0.12)',
    opacity: 0.7,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 34,
    letterSpacing: -0.5,
    color: COLORS.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.mutedText,
    fontFamily: 'Outfit_600SemiBold',
  },
  sectionSpacingSm: {
    height: 8,
  },
  sectionSpacingMd: {
    height: 20,
  },
  sectionSpacingLg: {
    height: 28,
  },
  resourcesCard: {
    borderRadius: 28,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 22,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resourcesTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  resourcesBody: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.mutedText,
    fontFamily: 'Outfit_400Regular',
    marginBottom: 12,
  },
  resourcesQuote: {
    fontStyle: 'italic',
    fontSize: 13,
    color: COLORS.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
});

export default WeddingRoadmapScreen;
