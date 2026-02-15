import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { roadmapColors } from './tokens';

export default function ChecklistItem({
  label,
  description,
  checked,
  onToggle,
  onOpen,
}) {
  return (
    <Pressable
      onPress={onOpen ?? onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      hitSlop={8}
    >
      <Pressable
        onPress={(event) => {
          event?.stopPropagation?.();
          onToggle?.();
        }}
        hitSlop={10}
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!checked }}
        accessibilityLabel={checked ? `Mark ${label} incomplete` : `Mark ${label} complete`}
      >
        {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {onOpen ? (
        <Ionicons name="chevron-forward" size={18} color="rgba(43,43,43,0.5)" />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: roadmapColors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: roadmapColors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  rowPressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: roadmapColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
