import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Card from '../../components/ui/Card';
import AppText from '../../components/AppText';
import { cardPadding, colors, gapLg, gapSm, radius, spacing } from '../../theme';

const ICON_BADGE_SIZE = spacing.jumbo + gapLg; // 48

export default function CalmTile({
  title,
  description,
  iconName,
  tint,
  onPress,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Card backgroundColor={tint} padding={cardPadding} style={styles.card}>
        <View style={styles.iconBadge}>
          <Ionicons name={iconName} size={20} color={colors.text} />
        </View>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="bodySmall" color="textMuted">
          {description}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.card,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    flex: 1,
  },
  iconBadge: {
    width: ICON_BADGE_SIZE,
    height: ICON_BADGE_SIZE,
    borderRadius: ICON_BADGE_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: gapLg,
  },
  title: {
    marginBottom: gapSm,
  },
});
