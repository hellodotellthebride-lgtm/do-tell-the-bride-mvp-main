import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, gapLg, gapMd, gapSm, sizes, spacing } from '../theme';
import AppText from './AppText';
import Card from './ui/Card';
import Button from './ui/Button';

export default function TodayFocusCard({
  heading = 'TODAY’S FOCUS',
  metaLines,
  suggestedLabel = '🎯 Suggested step',
  title,
  subtitle,
  ctaLabel = 'Start Now',
  icon = 'sparkles-outline',
  onPress,
  style,
}) {
  const showMeta = Array.isArray(metaLines) && metaLines.length > 0;
  return (
    <View style={[styles.wrap, style]}>
      <AppText variant="labelSmall" color="textMuted" style={styles.heading}>
        {heading}
      </AppText>
      <Card
        backgroundColor={colors.card}
        borderColor="rgba(255,155,133,0.28)"
        style={styles.card}
      >
        <View pointerEvents="none" style={styles.accentBar} />
        {showMeta ? (
          <View style={styles.metaBlock}>
            {metaLines.map((line, index) => (
              <AppText key={`${index}-${line}`} variant="caption" color="textMuted" style={styles.metaLine}>
                • {line}
              </AppText>
            ))}
          </View>
        ) : null}
        <AppText variant="caption" color="textMuted">
          {suggestedLabel}
        </AppText>
        <View style={styles.row}>
          <View style={styles.iconBadge}>
            <Ionicons name={icon} size={20} color={colors.accent} />
          </View>
          <View style={styles.textColumn}>
            <AppText variant="h3" style={styles.title}>
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="bodySmall" color="textMuted">
                {subtitle}
              </AppText>
            ) : null}
          </View>
        </View>

        <Button
          label={ctaLabel}
          onPress={onPress}
          variant="primary"
          size="sm"
          style={styles.button}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: gapSm,
  },
  heading: {
    marginLeft: spacing.xs,
  },
  card: {
    overflow: 'hidden',
    gap: gapMd,
  },
  metaBlock: {
    gap: spacing.xs,
  },
  metaLine: {
    lineHeight: 18,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: spacing.xs,
    bottom: spacing.xs,
    width: gapSm,
    borderRadius: gapSm,
    backgroundColor: colors.accent,
    opacity: 0.28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapLg,
  },
  iconBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    borderRadius: sizes.iconBadge / 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.25)',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  button: {
    alignSelf: 'flex-start',
  },
});
