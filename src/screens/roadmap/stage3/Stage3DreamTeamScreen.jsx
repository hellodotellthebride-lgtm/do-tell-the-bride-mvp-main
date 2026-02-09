import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import SectionCard from '../../../components/roadmap/SectionCard';
import useStageChecklist from '../../../roadmap/useStageChecklist';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../../components/roadmap/tokens';

const SECTION_CARDS = [
  {
    id: 'start-guide',
    title: 'Where Do I Start?',
    description: 'A simple, calm guide to booking vendors in a smart order.',
    icon: 'compass-outline',
  },
  {
    id: 'timeline',
    title: 'Your Vendor Booking Timeline',
    description: 'When to book what, mapped out with calm clarity.',
    icon: 'time-outline',
  },
  {
    id: 'transport',
    title: 'Transport Plan',
    description: 'Simple routes, zero guest confusion.',
    icon: 'car-outline',
  },
  {
    id: 'cheat-sheet',
    title: 'Vendor Cheat Sheet Library',
    description: 'Quick questions to ask your key vendors.',
    icon: 'book-outline',
  },
  {
    id: 'meeting-prep',
    title: 'Meeting Prep Templates',
    description: 'Notes pages to keep every chat organised.',
    icon: 'clipboard-outline',
  },
  {
    id: 'legal-guide',
    title: 'Making It Official – Legal & Ceremony Guide',
    description: 'Simple, structured support for the legal side.',
    icon: 'document-text-outline',
  },
  {
    id: 'eco-friendly',
    title: 'Eco-Friendly Vendor Guide',
    description: 'Lower waste, same magic.',
    icon: 'leaf-outline',
  },
  {
    id: 'diy-vs-pro',
    title: 'DIY or Hire a Pro?',
    description: 'Work out what’s worth DIY-ing — and what isn’t.',
    icon: 'construct-outline',
  },
];

export default function Stage3DreamTeamScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } =
    useStageChecklist('stage-3');

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
  };
  const handleCardPress = (card) => {
    const routeMap = {
      'start-guide': 'Stage3WhereToStart',
      timeline: 'Stage3VendorTimeline',
      transport: 'Stage3TransportPlan',
      'cheat-sheet': 'Stage3VendorCheatSheets',
      'meeting-prep': 'Stage3MeetingPrepLibrary',
      'legal-guide': 'Stage3LegalCeremony',
      'eco-friendly': 'Stage3EcoFriendlyGuide',
      'diy-vs-pro': 'Stage3DIYorHire',
    };
    const route = routeMap[card.id];
    if (route) {
      navigation?.navigate?.(route);
      return;
    }
  };

  return (
    <StageScreenContainer
      backLabel="Back to Planning Path"
      onBackPress={handleBack}
      title="Your Dream Team"
      subtitle="Your core vendors, all in one place. This stage helps you lock in the key people who bring your wedding to life."
    >
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

      {SECTION_CARDS.map((card) => (
        <SectionCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          description={card.description}
          onPress={() => handleCardPress(card)}
        />
      ))}
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  checklistCard: {
    backgroundColor: roadmapColors.card,
    borderRadius: roadmapRadius,
    padding: roadmapSpacing.cardPadding,
    marginBottom: roadmapSpacing.sectionGap,
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
