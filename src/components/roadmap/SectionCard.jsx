import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { roadmapColors, roadmapRadius, roadmapSpacing } from './tokens';

export default function SectionCard({
  icon = 'sparkles-outline',
  label,
  title,
  description,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        disabled && styles.cardDisabled,
      ]}
      hitSlop={8}
    >
      <View style={styles.iconBadge}>
        <Ionicons name={icon} size={18} color={roadmapColors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(43,43,43,0.5)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: roadmapColors.card,
    borderRadius: roadmapRadius,
    paddingVertical: roadmapSpacing.cardPadding,
    paddingHorizontal: roadmapSpacing.cardPadding,
    marginBottom: 12,
    shadowColor: roadmapColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,155,133,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: roadmapColors.mutedText,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
});
