import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StageScreenContainer from './StageScreenContainer';
import ChecklistItem from '../../../components/roadmap/ChecklistItem';
import useStageChecklist from '../../../roadmap/useStageChecklist';
import { roadmapColors } from '../../../components/roadmap/tokens';

export default function MiniChecklistScreen({ navigation }) {
  const { items, checkedMap, toggleItem, completeCount, totalCount } =
    useStageChecklist('stage-1');

  const handleBack = () => navigation?.goBack?.();

  return (
    <StageScreenContainer
      backLabel="Back to Your Beginning"
      onBackPress={handleBack}
      title="Mini checklist"
      subtitle="Tick what feels helpful, skip what doesn’t."
    >
      {items.map((item) => (
        <ChecklistItem
          key={item.id}
          label={item.label}
          checked={!!checkedMap[item.id]}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
      <View style={styles.progressBlock}>
        <Text style={styles.progressText}>
          {completeCount} of {totalCount} ticked (for now)
        </Text>
        <Text style={styles.encouragement}>
          Small steps are still steps. Come back any time.
        </Text>
      </View>
    </StageScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressBlock: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  encouragement: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: roadmapColors.mutedText,
    fontFamily: 'Outfit_400Regular',
  },
});
