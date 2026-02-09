import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import RoadmapStageCard from '../components/RoadmapStageCard';
import { useFocusEffect } from '@react-navigation/native';
import {
  computeStageProgress,
  computeOverallProgress,
  loadChecklistState,
} from '../roadmap/progressStorage';

const WARM_BACKGROUND = '#FDFBF8';
const PEACH_TINT = 'rgba(255,155,133,0.12)';

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
    chips: stage.chips.map((chip, chipIndex) => ({
      ...chip,
      done: chipIndex < chipDoneCount,
    })),
  };
};

const WeddingRoadmapScreen = ({ navigation }) => {
  const [checklistState, setChecklistState] = useState({});

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

  const stages = useMemo(
    () => STAGE_BASE.map((stage) => mapStageProgress(stage, checklistState)),
    [checklistState],
  );

  const overallProgress = useMemo(
    () => computeOverallProgress(checklistState),
    [checklistState],
  );

  const handleStagePress = (stage) => {
    if (stage.id === 'stage-1') {
      navigation?.navigate?.('Stage1Overview');
      return;
    }
    if (stage.id === 'stage-2') {
      navigation?.navigate?.('Stage2EarlyDecisions');
      return;
    }
    if (stage.id === 'stage-3') {
      navigation?.navigate?.('Stage3DreamTeam');
      return;
    }
    if (stage.id === 'stage-4') {
      navigation?.navigate?.('Stage4GuestsInvitations');
      return;
    }
    if (stage.id === 'stage-5') {
      navigation?.navigate?.('Stage5Style');
      return;
    }
    if (stage.id === 'stage-6') {
      navigation?.navigate?.('Stage6FinalDetails');
      return;
    }
    if (stage.id === 'stage-7') {
      navigation?.navigate?.('Stage7WeddingWeek');
      return;
    }
    if (stage.id === 'stage-8') {
      navigation?.navigate?.('Stage8WrapUp');
      return;
    }
    if (stage.id === 'stage-8') {
      navigation?.navigate?.('Stage8WrapUp');
      return;
    }
    if (stage.id === 'stage-7') {
      navigation?.navigate?.('Stage7WeddingWeek');
      return;
    }
    if (stage.id === 'stage-6') {
      navigation?.navigate?.('Stage6FinalDetails');
      return;
    }
    if (stage.id === 'stage-5') {
      navigation?.navigate?.('Stage5Style');
      return;
    }
    Alert.alert('Coming soon', 'This stage will unlock soon.');
  };

  const handleChipPress = (stage, chip) => {
    if (stage.id === 'stage-1') {
      navigation?.navigate?.('Stage1Overview');
      return;
    }
    if (stage.id === 'stage-2') {
      navigation?.navigate?.('Stage2EarlyDecisions');
      return;
    }
    if (stage.id === 'stage-3') {
      navigation?.navigate?.('Stage3DreamTeam');
      return;
    }
    if (stage.id === 'stage-4') {
      navigation?.navigate?.('Stage4GuestsInvitations');
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable hitSlop={8} onPress={handleBack} style={styles.backRow}>
          <Ionicons name="chevron-back" size={18} color="#6F5B55" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.screenTitle}>Your Wedding Roadmap</Text>
        <Text style={styles.screenSubtitle}>
          Seven calm stages to guide you from first decision to wedding day confidence.
        </Text>

        <View style={styles.overallCard}>
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Your Overall Progress</Text>
            <Text style={styles.overallValue}>
              {overallProgress}% complete
            </Text>
          </View>
          {overallProgress > 0 && (
            <View style={styles.overallTrack}>
              <View style={[styles.overallFill, { width: `${overallProgress}%` }]} />
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Planning Stages</Text>
        </View>

        {stages.map((stage) => (
          <RoadmapStageCard
            key={stage.id}
            stage={stage}
            showProgress
            onPress={() => handleStagePress(stage)}
            onChipPress={(chip) => handleChipPress(stage, chip)}
          />
        ))}

        <Pressable style={styles.resourcesCard} onPress={handleResourcesPress}>
          <View style={styles.resourcesHeader}>
            <Text style={styles.resourcesTitle}>Planning Resources & Guides</Text>
            <Ionicons name="chevron-forward" size={18} color="#B7A7A0" />
          </View>
          <Text style={styles.resourcesBody}>
            Access all your Do Tell The Bride printable PDFs and downloads in one calm space.
          </Text>
          <Text style={styles.resourcesQuote}>
            “This? Not archived — we’re right there with you.”
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WARM_BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    fontSize: 13,
    color: '#6F5B55',
    fontFamily: 'Outfit_500Medium',
    marginLeft: 2,
  },
  screenTitle: {
    fontSize: 32,
    color: '#2F2925',
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 15,
    color: '#8C7A72',
    fontFamily: 'Outfit_400Regular',
    marginBottom: 24,
  },
  overallCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: PEACH_TINT,
    marginBottom: 28,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    color: '#6F5B55',
    fontFamily: 'Outfit_500Medium',
  },
  overallValue: {
    fontSize: 16,
    color: '#F05F40',
    fontFamily: 'Outfit_600SemiBold',
  },
  overallTrack: {
    marginTop: 16,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  overallFill: {
    height: '100%',
    backgroundColor: '#F28F79',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 2,
    color: '#8F8F8F',
    fontFamily: 'Outfit_600SemiBold',
  },
  resourcesCard: {
    borderRadius: 24,
    backgroundColor: PEACH_TINT,
    padding: 20,
    marginTop: 16,
  },
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resourcesTitle: {
    fontSize: 18,
    color: '#2F2925',
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  resourcesBody: {
    fontSize: 14,
    color: '#6F5B55',
    fontFamily: 'Outfit_400Regular',
    marginBottom: 12,
  },
  resourcesQuote: {
    fontStyle: 'italic',
    fontSize: 13,
    color: '#8C7A72',
    fontFamily: 'Outfit_400Regular',
  },
});

export default WeddingRoadmapScreen;
