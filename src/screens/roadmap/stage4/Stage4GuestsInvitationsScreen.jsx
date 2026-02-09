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
    id: 'plan-list',
    title: 'Plan Your Guest List',
    description: 'Build your list with intention and care.',
    icon: 'list-outline',
    route: 'Stage4PlanGuestList',
  },
  {
    id: 'contact-info',
    title: 'Collect Contact Info',
    description: 'Keep everything organised in one place.',
    icon: 'book-outline',
    route: 'Stage4CollectContacts',
  },
  {
    id: 'create-invites',
    title: 'Create Invitations',
    description: 'Design with ease — minus the stress.',
    icon: 'mail-open-outline',
    route: 'Stage4CreateInvitations',
  },
  {
    id: 'save-dates',
    title: 'Send Save-the-Dates',
    description: 'Give guests time to plan ahead.',
    icon: 'calendar-outline',
    route: 'Stage4SaveTheDates',
  },
  {
    id: 'manage-rsvps',
    title: 'Manage RSVPs',
    description: 'Track responses calmly and clearly.',
    icon: 'stats-chart-outline',
    route: 'Stage4ManageRSVPs',
  },
  {
    id: 'accessibility',
    title: 'Accessibility & Guest Comfort',
    description: 'Thoughtful planning that includes everyone.',
    icon: 'accessibility-outline',
    route: 'Stage4AccessibilityComfort',
  },
  {
    id: 'kids-family',
    title: 'Kids & Family Dynamics',
    description: 'Clear, kind guidance for tricky guest situations.',
    icon: 'people-outline',
    route: 'Stage4KidsFamily',
  },
  {
    id: 'website',
    title: 'Wedding Website Setup Guide',
    description: 'Create a simple, guest-friendly wedding website.',
    icon: 'globe-outline',
    route: 'Stage4WeddingWebsite',
  },
];

export default function Stage4GuestsInvitationsScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } =
    useStageChecklist('stage-4');

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
      title="Your Guest List & Invitations"
      subtitle="A gentle guide to creating and communicating your guest list."
    >
      <Text style={styles.stageLabel}>STAGE 4</Text>
      <Text style={styles.introText}>
        This hub is here to calm the conversations, keep every contact close, and carry the admin
        for you.
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
        title="“You can lead this part calmly.”"
        body="Every clear note you capture here means one less favour to chase later."
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
