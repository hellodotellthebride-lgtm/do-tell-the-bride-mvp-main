import React from 'react';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SectionCard from '../../../components/roadmap/SectionCard';
import { DREAM_TEAM_VENDORS } from './vendorData';
import { StyleSheet, Text } from 'react-native';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';

export default function Stage3MeetingPrepLibraryScreen({ navigation }) {
  const handleBack = () => navigation?.navigate?.('Stage3DreamTeam');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Meeting Prep Notes Library"
      subtitle="One place to jot what matters before every vendor chat."
    >
      {DREAM_TEAM_VENDORS.map((vendor) => (
        <SectionCard
          key={vendor.id}
          icon="create-outline"
          title={vendor.label}
          description="Tap to open your calm notes page."
          onPress={() =>
            navigation?.navigate?.('Stage3MeetingPrepDetail', { vendorId: vendor.id })
          }
        />
      ))}

      <Text style={styles.footer}>“Clarity before the meeting makes everything easier.”</Text>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
