import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { roadmapColors, roadmapRadius } from './tokens';

export default function ChecklistItem({ label, description, checked, onToggle }) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      hitSlop={8}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: roadmapRadius,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  rowPressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: roadmapColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: roadmapColors.accent,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
});
