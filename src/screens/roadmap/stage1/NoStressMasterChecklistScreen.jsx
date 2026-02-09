import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import { roadmapColors } from '../../../components/roadmap/tokens';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NoStressMasterChecklistScreen({ navigation }) {
  const handleBack = () => navigation?.goBack?.();
  return (
    <StageScreenContainer
      backLabel="Back to Stage 1"
      onBackPress={handleBack}
      title="No-Stress Master Checklist"
    >
      <View style={styles.placeholder}>
        <Ionicons name="document-outline" size={40} color={roadmapColors.mutedText} />
        <Text style={styles.placeholderText}>
          This is a placeholder for the full PDF view.{'\n'}
          The complete guide will be displayed here.
        </Text>
      </View>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 20,
    backgroundColor: roadmapColors.surface,
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
});
