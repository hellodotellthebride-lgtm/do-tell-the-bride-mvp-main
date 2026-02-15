import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../AppText';
import { cardPadding, colors, gapMd, gapSm, radius } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'sm';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  const labelColor = isPrimary ? '#FFFFFF' : colors.accent;
  const iconColor = isPrimary ? '#FFFFFF' : colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && (isPrimary ? styles.primaryPressed : styles.nonPrimaryPressed),
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={18} color={iconColor} style={styles.icon} />
      ) : null}
      <AppText variant="body" style={[styles.label, { color: labelColor }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    paddingVertical: gapMd,
    paddingHorizontal: cardPadding,
    borderWidth: 1,
  },
  sm: {
    paddingVertical: gapSm,
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(255,155,133,0.6)',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryPressed: {
    opacity: 0.9,
  },
  nonPrimaryPressed: {
    backgroundColor: colors.accentSoft,
  },
  icon: {
    marginRight: gapSm,
  },
  label: {
    fontFamily: 'Outfit_500Medium',
    lineHeight: 22,
  },
});
