import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from '../stage1/StageScreenContainer';
import SoftInfoCard from '../../../components/roadmap/SoftInfoCard';
import { roadmapColors, roadmapRadius, roadmapSpacing } from '../../../components/roadmap/tokens';
import { getVendorById } from './vendorData';

export default function Stage3MeetingPrepDetailScreen({ navigation, route }) {
  const vendorId = route?.params?.vendorId;
  const vendor = getVendorById(vendorId) ?? { label: 'Vendor' };
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.navigate?.('Stage3MeetingPrepLibrary');
  };
  const openPdf = () => {
    console.log('Open meeting prep PDF for', vendor.label);
  };

  return (
    <StageScreenContainer
      backLabel="Back to Core Vendors"
      onBackPress={handleBack}
      title={`${vendor.label} Meeting Prep Notes`}
      subtitle="Tap the notes PDF whenever you want a quiet place to think."
    >
      <SoftInfoCard>
        <Pressable style={styles.pdfTile} onPress={openPdf} hitSlop={8}>
          <View style={styles.pdfBadge}>
            <Text style={styles.pdfBadgeText}>PDF</Text>
          </View>
          <Text style={styles.pdfTitle}>Tap to open your PDF</Text>
          <Text style={styles.pdfSub}>Capture questions, ideas, and decisions without rush.</Text>
        </Pressable>
      </SoftInfoCard>

      <Text style={styles.footer}>
        “You don’t need perfect notes — just a place to think clearly.”
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
    backgroundColor: '#FFFFFF',
  },
  pdfBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: roadmapColors.accent,
    alignSelf: 'flex-start',
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
