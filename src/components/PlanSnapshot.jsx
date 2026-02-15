import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from './AppText';
import Card from './ui/Card';
import { colors, gapLg, gapMd, gapSm, spacing } from '../theme';

const HOME_PALETTE = {
  coral: colors.primary,
  text: colors.text,
  textBody: colors.textSecondary,
  textSoft: colors.textSecondary,
  green: '#3F7F63',
  greenTint: '#EAF6EF',
  creamCard: colors.muted,
  divider: colors.border,
};

export default function PlanSnapshot({
  coupleName,
  weddingDateLabel,
  daysLeftValue,
  daysLeftMeta,
  roadmapValue,
  budgetValue,
  guestsValue,
  onPressDaysLeft,
  onPressRoadmap,
  onPressBudget,
  onPressGuests,
  onPressContinue,
  onPressSettings,
  continueLabel = 'Continue Your Plan',
  statusLabel,
  style,
}) {
  const roadmapPercent = (() => {
    if (roadmapValue === null || roadmapValue === undefined) return null;
    const asNumber =
      typeof roadmapValue === 'number'
        ? roadmapValue
        : Number.parseFloat(String(roadmapValue).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(asNumber)) return null;
    const percent = asNumber <= 1 ? asNumber * 100 : asNumber;
    return Math.max(0, Math.min(100, percent));
  })();

  const parsePercent = (value) => {
    if (value === null || value === undefined) return null;
    const asNumber =
      typeof value === 'number'
        ? value
        : Number.parseFloat(String(value).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(asNumber)) return null;
    const percent = asNumber <= 1 ? asNumber * 100 : asNumber;
    return Math.max(0, Math.min(100, percent));
  };

  const budgetPercent = parsePercent(budgetValue);
  const guestsPercent = parsePercent(guestsValue);

  const getStatusForPercent = (percent) => {
    if (!Number.isFinite(percent)) {
      return { icon: 'ellipse', iconColor: HOME_PALETTE.textSoft, text: 'Just getting started' };
    }
    if (percent >= 80) {
      return { icon: 'checkmark-circle', iconColor: HOME_PALETTE.green, text: 'Beautifully on track' };
    }
    if (percent >= 40) {
      return { icon: 'ellipse', iconColor: HOME_PALETTE.coral, text: 'Gently moving forward' };
    }
    return { icon: 'ellipse', iconColor: HOME_PALETTE.textSoft, text: 'Just getting started' };
  };

  const stats = [
    {
      id: 'days',
      label: 'Your day',
      value: daysLeftValue,
      meta: daysLeftMeta || "Everything’s unfolding beautifully",
      metaIcon: 'ellipse',
      metaIconColor: HOME_PALETTE.coral,
      onPress: onPressDaysLeft,
    },
    {
      id: 'roadmap',
      label: 'Your journey',
      value: roadmapValue,
      emphasis: true,
      meta: getStatusForPercent(roadmapPercent).text,
      metaIcon: getStatusForPercent(roadmapPercent).icon,
      metaIconColor: getStatusForPercent(roadmapPercent).iconColor,
      onPress: onPressRoadmap,
    },
    {
      id: 'budget',
      label: 'Budget',
      value: budgetValue,
      meta: budgetPercent !== null && budgetPercent >= 80 ? '100% Sorted — well done' : getStatusForPercent(budgetPercent).text,
      metaIcon: getStatusForPercent(budgetPercent).icon,
      metaIconColor: getStatusForPercent(budgetPercent).iconColor,
      onPress: onPressBudget,
    },
    {
      id: 'guests',
      label: 'Guests',
      value: guestsValue,
      meta: guestsPercent !== null && guestsPercent < 40 ? 'A few more and table plans unlock' : getStatusForPercent(guestsPercent).text,
      metaIcon: getStatusForPercent(guestsPercent).icon,
      metaIconColor: getStatusForPercent(guestsPercent).iconColor,
      onPress: onPressGuests,
    },
  ].filter(Boolean);

  const rows = [stats.slice(0, 2), stats.slice(2, 4)].filter((row) => row.length);

  return (
    <Card
      backgroundColor={HOME_PALETTE.creamCard}
      padding={20}
      style={[styles.card, style]}
      elevated={false}
    >
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <AppText variant="h2" numberOfLines={1} style={styles.coupleName}>
            {coupleName}
          </AppText>
          {weddingDateLabel ? (
            <AppText variant="bodySmall" color="textMuted">
              {weddingDateLabel}
            </AppText>
          ) : null}
        </View>
        {onPressSettings ? (
          <Pressable
            onPress={onPressSettings}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Open account settings"
            style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
          >
            <Ionicons name="settings-outline" size={18} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.statsGrid}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.statsRow}>
            {row.map((stat) => (
              <Pressable
                key={stat.id}
                onPress={stat.onPress}
                disabled={!stat.onPress}
                accessibilityRole="button"
                accessibilityLabel={
                  stat.value ? `${stat.label}: ${stat.value}` : stat.label
                }
                hitSlop={8}
            style={({ pressed }) => [
              styles.statCell,
              stat.emphasis && styles.statCellEmphasis,
              stat.metaIcon === 'checkmark-circle' && styles.statCellSafe,
              pressed && stat.onPress && styles.statPressed,
            ]}
          >
            <AppText
              variant="caption"
              color="textMuted"
              style={styles.statLabel}
            >
              {stat.label}
            </AppText>
            <AppText
              variant="h3"
              style={[styles.statValue, stat.emphasis && styles.statValueEmphasis]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
                  {stat.value ?? '—'}
                </AppText>
                {stat.meta ? (
                  <View style={styles.metaRow}>
                    <Ionicons
                      name={stat.metaIcon || 'ellipse'}
                      size={14}
                      color={stat.metaIconColor || colors.accent}
                      style={styles.metaIcon}
                    />
                    <AppText
                      variant="caption"
                      style={[
                        styles.metaText,
                        stat.metaIcon === 'checkmark-circle' && styles.metaTextSafe,
                      ]}
                    >
                      {stat.meta}
                    </AppText>
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable
        onPress={onPressContinue}
        accessibilityRole="button"
        accessibilityLabel={continueLabel}
        style={({ pressed }) => [styles.continuePressable, pressed && styles.pressed]}
      >
        <View style={styles.continueFill}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.continueHighlight}
          />
          <AppText variant="body" style={styles.continueText}>
            {continueLabel}
          </AppText>
        </View>
      </Pressable>

      {statusLabel ? (
        <View style={styles.statusPill}>
          <Ionicons name="checkmark-circle" size={18} color={HOME_PALETTE.green} />
          <AppText variant="bodySmall" style={styles.statusText}>
            {statusLabel}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 24,
    gap: 16,
    backgroundColor: HOME_PALETTE.creamCard,
  },
  pressed: {
    opacity: 0.86,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: gapLg,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  coupleName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    lineHeight: 38,
    color: HOME_PALETTE.text,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,155,133,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.22)',
  },
  statsGrid: {
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCell: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statCellSafe: {
    backgroundColor: HOME_PALETTE.greenTint,
    borderColor: 'rgba(63, 127, 99, 0.12)',
  },
  statPressed: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentChip,
  },
  statLabel: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    color: HOME_PALETTE.text,
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: HOME_PALETTE.text,
  },
  statCellEmphasis: {
    backgroundColor: '#FFFFFF',
  },
  statValueEmphasis: {
    fontSize: 22,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    marginTop: 1,
  },
  metaText: {
    flex: 1,
    minWidth: 0,
  },
  metaTextSafe: {
    color: HOME_PALETTE.green,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: HOME_PALETTE.greenTint,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(63, 127, 99, 0.14)',
  },
  statusText: {
    fontFamily: 'Outfit_500Medium',
    color: HOME_PALETTE.green,
  },
  continuePressable: {
    width: '100%',
  },
  continueFill: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HOME_PALETTE.coral,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  continueHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  continueText: {
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 22,
  },
});
