import React from 'react';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SectionCard from '../../../components/roadmap/SectionCard';
import CTAButton from '../../../components/roadmap/CTAButton';
import { roadmapColors, roadmapSpacing } from '../../../components/roadmap/tokens';
import { DREAM_TEAM_VENDORS } from './vendorData';
import { StyleSheet, Text } from 'react-native';

export default function Stage3VendorCheatSheetLibraryScreen({ navigation }) {
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Stage3DreamTeam');
  };
  const openVendorDirectory = () => navigation?.navigate?.('WeddingHub');

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title="Vendor Cheat Sheet Library"
      subtitle="Confidence-building questions for every key vendor."
    >
      {DREAM_TEAM_VENDORS.map((vendor) => (
        <SectionCard
          key={vendor.id}
          icon="help-circle-outline"
          title={vendor.label}
          description="Tap to open your calm question guide."
          onPress={() =>
            navigation?.navigate?.('Stage3VendorCheatSheetDetail', { vendorId: vendor.id })
          }
        />
      ))}

      <CTAButton
        label="Open Vendor Directory"
        variant="secondary"
        onPress={openVendorDirectory}
        style={styles.button}
      />

      <Text style={styles.footer}>“Good questions lead to better decisions.”</Text>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: roadmapColors.accent,
    marginTop: roadmapSpacing.sectionGap,
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
