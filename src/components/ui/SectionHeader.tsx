import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../AppText';
import { colors, gapMd, gapSm, radius } from '../../theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  actionLabel?: string;
  actionIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onActionPress?: () => void;
  actionAccessibilityLabel?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
  toggleAccessibilityLabel?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  style,
  actionLabel,
  actionIcon = 'add',
  onActionPress,
  actionAccessibilityLabel,
  expanded,
  onToggleExpand,
  toggleAccessibilityLabel,
}: SectionHeaderProps) {
  const showAction = Boolean(actionLabel && typeof onActionPress === 'function');
  const showToggle = typeof onToggleExpand === 'function' && typeof expanded === 'boolean';
  const toggleIcon = expanded ? 'chevron-up' : 'chevron-down';

  return (
    <View style={[styles.row, style]}>
      <View style={styles.textBlock}>
        <AppText variant="h3">{title}</AppText>
        {subtitle ? (
          <AppText variant="bodySmall" color="textMuted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {showToggle || showAction ? (
        <View style={styles.actions}>
          {showToggle ? (
            <Pressable
              onPress={onToggleExpand}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={toggleAccessibilityLabel || 'Toggle section'}
            >
              <Ionicons name={toggleIcon} size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}

          {showAction ? (
            <Pressable
              onPress={onActionPress}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={actionAccessibilityLabel || actionLabel}
            >
              <Ionicons name={actionIcon} size={16} color={colors.accent} />
              <AppText variant="bodySmall" style={styles.actionLabel}>
                {actionLabel}
              </AppText>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const iconButtonSize = gapMd * 3;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapMd,
  },
  textBlock: {
    flex: 1,
  },
  subtitle: {
    marginTop: gapSm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
  },
  iconButton: {
    width: iconButtonSize,
    height: iconButtonSize,
    borderRadius: iconButtonSize / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gapSm,
    paddingHorizontal: gapMd,
    paddingVertical: gapSm,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.25)',
  },
  actionLabel: {
    color: colors.accent,
    fontFamily: 'Outfit_500Medium',
  },
  pressed: {
    opacity: 0.88,
  },
});
