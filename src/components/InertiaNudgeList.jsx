import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from './AppText';
import Card from './ui/Card';
import { colors, gapLg, gapMd, gapSm, spacing } from '../theme';

const iconForType = (type) => {
  switch (type) {
    case 'guest':
      return 'people-outline';
    case 'vendor':
      return 'storefront-outline';
    case 'today':
      return 'sparkles-outline';
    default:
      return 'notifications-outline';
  }
};

const NudgeRow = ({ item, onPress }) => (
  <Pressable
    onPress={() => onPress?.(item)}
    accessibilityRole="button"
    accessibilityLabel={item?.accessibilityLabel || item?.message}
    style={({ pressed }) => [styles.rowPressable, pressed && styles.pressed]}
  >
    <Card elevated={false} padding={gapLg} style={[styles.row, item.suggested && styles.rowSuggested]}>
      <View style={[styles.iconBadge, item.suggested && styles.iconBadgeSuggested]}>
        <Ionicons name={iconForType(item.type)} size={18} color={item.suggested ? colors.accent : colors.text} />
      </View>
      <View style={styles.textBlock}>
        <AppText variant="bodySmall" style={styles.message} numberOfLines={3}>
          {item.message}
        </AppText>
        {item.ctaLabel ? (
          <AppText variant="caption" style={styles.cta} numberOfLines={1}>
            {item.ctaLabel} →
          </AppText>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(43,43,43,0.45)" />
    </Card>
  </Pressable>
);

export default function InertiaNudgeList({ items = [], onPressItem, style }) {
  const visible = Array.isArray(items) ? items.filter(Boolean) : [];
  if (visible.length === 0) return null;

  return (
    <View style={[styles.wrap, style]}>
      <AppText variant="labelSmall" color="textMuted" style={styles.label}>
        REMINDERS
      </AppText>
      <View style={styles.stack}>
        {visible.map((item) => (
          <NudgeRow key={item.id} item={item} onPress={onPressItem} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: gapSm,
  },
  label: {
    marginLeft: spacing.xs,
  },
  stack: {
    gap: gapSm,
  },
  rowPressable: {
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapMd,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  rowSuggested: {
    borderColor: 'rgba(255,155,133,0.30)',
    backgroundColor: 'rgba(255,155,133,0.08)',
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconBadgeSuggested: {
    backgroundColor: 'rgba(255,155,133,0.16)',
    borderColor: 'rgba(255,155,133,0.28)',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  message: {
    color: colors.text,
    fontFamily: 'Outfit_500Medium',
  },
  cta: {
    color: colors.textMuted,
    fontFamily: 'Outfit_500Medium',
  },
});

