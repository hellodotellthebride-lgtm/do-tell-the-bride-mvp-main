import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from './AppText';
import Card from './ui/Card';
import { gapSm } from '../theme';

const PALETTE = {
  green: '#3F7F63',
  greenTint: '#EAF6EF',
  text: '#262626',
  textSoft: '#8F8B87',
};

const ActionChip = ({ label, onPress, accessibilityLabel }) => (
  <Pressable
    onPress={(event) => {
      event?.stopPropagation?.();
      onPress?.();
    }}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel || label}
    style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
  >
    <AppText variant="caption" style={styles.chipText} numberOfLines={2}>
      {label}
    </AppText>
  </Pressable>
);

export default function WellnessPanel({
  subtitle = 'For when planning feels like too much.',
  resetOption = '2-minute reset',
  tipOption = 'Breathing exercise',
  extraOption,
  suggested = false,
  onPressReset,
  onPressTip,
  onPressExtra,
  onExplore,
  style,
}) {
  return (
    <Pressable
      onPress={onExplore}
      accessibilityRole="button"
      accessibilityLabel="Open Calm Corner"
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <Card
        elevated={false}
        backgroundColor={PALETTE.greenTint}
        borderColor="rgba(63, 127, 99, 0.12)"
        style={styles.card}
      >
        <View style={styles.supportLineRow}>
          <View style={styles.supportIconBadge}>
            <Ionicons name="heart-outline" size={16} color={PALETTE.green} />
          </View>
          <AppText variant="bodySmall" style={styles.supportLine}>
            We’ll handle the pressure. You enjoy the moments.
          </AppText>
        </View>

        <AppText variant="h2" style={styles.title}>
          Calm Corner
        </AppText>
        <AppText variant="bodySmall" style={styles.subtitle}>
          {subtitle}
        </AppText>

        <View style={styles.quickRow}>
          <ActionChip label={resetOption} onPress={onPressReset} accessibilityLabel={`Open ${resetOption}`} />
          <ActionChip label={tipOption} onPress={onPressTip} accessibilityLabel={`Open ${tipOption}`} />
          {extraOption ? (
            <ActionChip
              label={extraOption}
              onPress={onPressExtra}
              accessibilityLabel={`Open ${extraOption}`}
            />
          ) : null}
        </View>

        <View style={styles.divider} />
        <AppText variant="bodySmall" color="textMuted" style={styles.exploreLink}>
          Explore more support →
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.94,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    gap: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  supportLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
  },
  supportIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(63, 127, 99, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportLine: {
    flex: 1,
    minWidth: 0,
    color: PALETTE.green,
    fontFamily: 'Outfit_500Medium',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: PALETTE.text,
  },
  subtitle: {
    color: PALETTE.green,
    opacity: 0.95,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSm,
  },
  chip: {
    flexGrow: 1,
    flexBasis: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(63, 127, 99, 0.10)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(63, 127, 99, 0.14)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
    color: PALETTE.green,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(63, 127, 99, 0.14)',
  },
  exploreLink: {
    fontFamily: 'Outfit_500Medium',
    color: PALETTE.green,
  },
});
