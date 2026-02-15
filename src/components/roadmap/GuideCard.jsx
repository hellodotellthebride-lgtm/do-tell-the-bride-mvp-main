import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { roadmapColors, roadmapRadius } from './tokens';

export default function GuideCard({
  title,
  subtitle,
  icon = 'sparkles-outline',
  suggested = false,
  completed = false,
  onPress,
}) {
  const badgeText = completed ? 'Done' : suggested ? 'Suggested' : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.media}>
        <Ionicons name={icon} size={22} color={roadmapColors.accent} />
        {badgeText ? (
          <View style={styles.badge}>
            {completed ? (
              <Ionicons name="checkmark" size={12} color={roadmapColors.textDark} />
            ) : null}
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: roadmapColors.card,
    borderRadius: roadmapRadius,
    padding: 14,
    shadowColor: roadmapColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.85,
  },
  media: {
    width: '100%',
    height: 86,
    borderRadius: roadmapRadius,
    backgroundColor: 'rgba(255,155,133,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: roadmapColors.textDark,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: roadmapColors.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Outfit_400Regular',
    color: roadmapColors.mutedText,
  },
});

