import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from './AppText';
import { colors } from '../theme';

const PALETTE = {
  coral: colors.primary,
  coralSoft: colors.accentChip,
  green: '#3F7F63',
  greenSoft: '#EAF6EF',
  neutral: colors.muted,
  text: colors.text,
  textSoft: colors.textSecondary,
};

export default function QuickToolPill({
  headline,
  title,
  icon,
  suggested = false,
  variant = 'neutral', // 'neutral' | 'safe'
  completed = false,
  onPress,
  style,
  accessibilityLabel,
}) {
  const isSafe = variant === 'safe';
  const accentColor = isSafe ? PALETTE.green : PALETTE.coral;
  const surfaceColor = isSafe ? PALETTE.greenSoft : PALETTE.neutral;
  const iconBubbleColor = isSafe ? 'rgba(63,127,99,0.12)' : colors.accentSoft;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title || headline}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: surfaceColor, borderColor: iconBubbleColor },
        suggested && styles.tileSuggested,
        pressed && styles.pressed,
        style,
      ]}
    >
      {completed ? (
        <View style={styles.completedBadge} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={18} color={PALETTE.green} />
        </View>
      ) : null}
      {suggested ? (
        <View style={[styles.badge, { borderColor: iconBubbleColor }]} pointerEvents="none">
          <AppText variant="caption" style={[styles.badgeText, { color: accentColor }]}>
            Suggested
          </AppText>
        </View>
      ) : null}
      <View style={[styles.iconBubble, { backgroundColor: iconBubbleColor, borderColor: iconBubbleColor }]}>
        {icon}
      </View>
      {title ? (
        <AppText
          variant="h3"
          numberOfLines={2}
          allowFontScaling={false}
          style={styles.title}
        >
          {title}
        </AppText>
      ) : null}
      {headline ? (
        <AppText variant="bodySmall" numberOfLines={2} style={styles.headline}>
          {headline}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '47%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    overflow: 'hidden',
  },
  tileSuggested: {
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.9,
  },
  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headline: {
    fontFamily: 'Outfit_400Regular',
    color: PALETTE.textSoft,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: PALETTE.text,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: 'Outfit_500Medium',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
