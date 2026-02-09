import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../../components/roadmap/tokens';
import { getVendorById } from './vendorData';

export default function Stage3VendorCheatSheetScreen({ navigation, route }) {
  const vendorId = route?.params?.vendorId;
  const vendor = getVendorById(vendorId) ?? { label: 'Vendor' };
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Stage3VendorCheatSheets');
  };

  const openPdf = () => {
    console.log('Open cheat sheet PDF for', vendor.label);
  };

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title={`${vendor.label} Questions Cheat Sheet`}
      subtitle="Tap the PDF to open calm, confident prompts."
    >
      <SoftInfoCard>
        <Pressable style={styles.pdfTile} onPress={openPdf} hitSlop={6}>
          <View style={styles.pdfBadge}>
            <Text style={styles.pdfBadgeText}>PDF</Text>
          </View>
          <Text style={styles.pdfTitle}>Tap to open your PDF</Text>
          <Text style={styles.pdfSub}>Save or share whenever you’re ready.</Text>
        </Pressable>
      </SoftInfoCard>

      <Text style={styles.footer}>
        “You don’t have to ask everything — just what matters to you.”
      </Text>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  pdfTile: {
    borderRadius: roadmapRadius,
    borderWidth: 1,
    borderColor: roadmapColors.border,
    padding: 18,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  pdfBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: roadmapColors.accent,
    marginBottom: 10,
  },
  pdfBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
  },
  pdfTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
  },
  pdfSub: {
    marginTop: 6,
    fontSize: 14,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
  footer: {
    marginTop: roadmapSpacing.sectionGap,
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: roadmapColors.mutedText,
    textAlign: 'center',
  },
});
