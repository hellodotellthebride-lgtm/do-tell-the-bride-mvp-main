import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import GuideCard from './GuideCard';

const ItemSeparator = () => <View style={styles.separator} />;

export default function GuideCarousel({
  guides,
  suggestedGuideIds,
  completedGuideIds,
  onPressGuide,
}) {
  const suggestedSet = new Set(suggestedGuideIds ?? []);
  const completedSet = new Set(completedGuideIds ?? []);

  return (
    <FlatList
      horizontal
      data={guides}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <GuideCard
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
          suggested={suggestedSet.has(item.id)}
          completed={completedSet.has(item.id)}
          onPress={() => onPressGuide?.(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  separator: {
    width: 12,
  },
});

