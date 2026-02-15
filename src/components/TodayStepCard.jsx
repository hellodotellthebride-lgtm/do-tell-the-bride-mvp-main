import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from './AppText';
import Card from './ui/Card';
import { colors, gapLg, gapMd, gapSm, hexToRgba, spacing } from '../theme';

export default function TodayStepCard({
  heading = 'YOUR NEXT HELPFUL STEP',
  title,
  subtitle,
  continuityLine,
  ctaLabel = 'Let’s do this',
  onPress,
  type = 'roadmap',
  footnote,
  density = 'regular',
  style,
}) {
  const isCompact = density === 'compact';
  const primarySubLine = continuityLine || subtitle;
  const secondarySubLine = continuityLine && subtitle ? subtitle : null;
  const cardPadding = isCompact ? gapLg : 22;

  return (
    <View style={[styles.wrap, isCompact && styles.wrapCompact, style]}>
      <Card
        padding={cardPadding}
        backgroundColor={colors.surface}
        borderColor={hexToRgba(colors.border, 0.35)}
        elevated={false}
        style={[styles.card, isCompact && styles.cardCompact]}
      >
        <AppText variant="labelSmall" style={styles.label}>
          {heading}
        </AppText>

        <AppText variant="h3" style={styles.mainTitle}>
          Here’s a good next step
        </AppText>

        {title ? (
          <AppText variant="body" style={styles.actionLine}>
            {title}
          </AppText>
        ) : null}

        {primarySubLine || secondarySubLine ? (
          <View style={styles.supportingBlock}>
            {primarySubLine ? (
              <AppText variant="bodySmall" style={styles.subLine}>
                {primarySubLine}
              </AppText>
            ) : null}
            {secondarySubLine ? (
              <AppText variant="bodySmall" style={styles.supportLine}>
                {secondarySubLine}
              </AppText>
            ) : null}
          </View>
        ) : null}

        {footnote ? (
          <View style={styles.expertBox}>
            <View style={styles.expertAccent} />
            <AppText variant="bodySmall" style={styles.expertBoxText}>
              {footnote}
            </AppText>
          </View>
        ) : null}

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
          style={({ pressed }) => [styles.ctaPressable, pressed && styles.pressed]}
        >
          <View style={styles.ctaFill}>
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.ctaHighlight}
            />
            <AppText variant="body" style={styles.ctaText}>
              {ctaLabel}
            </AppText>
          </View>
        </Pressable>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: gapSm,
  },
  wrapCompact: {
    gap: spacing.xs,
  },
  heading: {
    marginLeft: spacing.xs,
  },
  card: {
    borderRadius: 26,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  cardCompact: {
    borderRadius: 24,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.primary,
    fontFamily: 'Outfit_500Medium',
    marginBottom: 12,
  },
  mainTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    lineHeight: 38,
    color: colors.text,
    marginBottom: 12,
  },
  actionLine: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 10,
  },
  supportingBlock: {
    marginBottom: 14,
    gap: 6,
  },
  subLine: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  supportLine: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  expertBox: {
    flexDirection: 'row',
    backgroundColor: colors.accentChip,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 18,
  },
  expertAccent: {
    width: 2,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  expertBoxText: {
    flex: 1,
    minWidth: 0,
    color: colors.textSecondary,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  ctaPressable: {
    width: '100%',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  ctaFill: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  ctaHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  ctaText: {
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 22,
  },
});
