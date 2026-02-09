import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../../components/AppText';
import { colors, radius, shadows, spacing } from '../../theme';

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  icon,
  style,
}) => {
  const isNonPrimary = variant === 'secondary' || variant === 'ghost';
  const variantStyle =
    variant === 'secondary'
      ? styles.buttonSecondary
      : variant === 'ghost'
        ? styles.buttonGhost
        : styles.buttonPrimary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={spacing.sm}
      style={({ pressed }) => [
        styles.buttonBase,
        size === 'sm' && styles.buttonSm,
        variantStyle,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={isNonPrimary ? colors.text : '#FFFFFF'}
          style={{ marginRight: 10 }}
        />
      ) : null}
      <AppText
        variant="body"
        style={[styles.buttonLabel, isNonPrimary && styles.buttonLabelSecondary]}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

export const ChoiceChip = ({ label, selected, onPress, tone = 'neutral' }) => {
  const toneStyles = useMemo(() => {
    if (tone === 'accent') return [styles.chipAccent, styles.chipAccentText];
    if (tone === 'success') return [styles.chipSuccess, styles.chipSuccessText];
    if (tone === 'danger') return [styles.chipDanger, styles.chipDangerText];
    return [styles.chipNeutral, styles.chipNeutralText];
  }, [tone]);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chip,
        selected ? toneStyles[0] : styles.chipUnselected,
        pressed && styles.chipPressed,
      ]}
    >
      <AppText
        variant="bodySmall"
        style={[styles.chipText, selected ? toneStyles[1] : styles.chipTextUnselected]}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

export const Pill = ({ label, tone = 'neutral' }) => {
  const toneStyle =
    tone === 'success'
      ? styles.pillSuccess
      : tone === 'danger'
        ? styles.pillDanger
        : tone === 'warning'
          ? styles.pillWarning
          : styles.pillNeutral;
  const textStyle =
    tone === 'success'
      ? styles.pillTextSuccess
      : tone === 'danger'
        ? styles.pillTextDanger
        : tone === 'warning'
          ? styles.pillTextWarning
          : styles.pillTextNeutral;

  return (
    <View style={[styles.pill, toneStyle]}>
      <AppText variant="caption" style={[styles.pillText, textStyle]}>
        {label}
      </AppText>
    </View>
  );
};

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  style,
}) => (
  <View style={style}>
    {label ? (
      <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
        {label}
      </AppText>
    ) : null}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(43,43,43,0.35)"
      multiline={multiline}
      keyboardType={keyboardType}
      style={[styles.input, multiline && styles.inputMultiline]}
    />
  </View>
);

export const SelectField = ({ label, valueLabel, placeholder, onPress, style }) => (
  <View style={style}>
    {label ? (
      <AppText variant="labelSmall" color="textMuted" style={{ marginBottom: 6 }}>
        {label}
      </AppText>
    ) : null}
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.select, pressed && styles.pressed]}
    >
      <AppText variant="body" style={{ flex: 1 }}>
        {valueLabel || placeholder || 'Select'}
      </AppText>
      <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
    </Pressable>
  </View>
);

export const ToastBanner = ({ visible, message }) => {
  if (!visible || !message) return null;
  return (
    <View style={styles.toast}>
      <Ionicons name="checkmark-circle" size={18} color={colors.success} />
      <AppText variant="body" style={{ marginLeft: 10 }}>
        {message}
      </AppText>
    </View>
  );
};

export const ModalCard = ({ visible, title, onClose, children }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.modalBackdrop} onPress={onClose}>
      <Pressable style={styles.modalCard} onPress={() => {}}>
        <View style={styles.modalHeader}>
          <AppText variant="h3" style={{ flex: 1 }}>
            {title}
          </AppText>
          <Pressable hitSlop={spacing.sm} onPress={onClose} style={styles.modalClose}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...shadows.softCard,
  },
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonSm: {
    paddingVertical: 12,
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.6)',
  },
  buttonGhost: {
    backgroundColor: 'rgba(255,155,133,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.25)',
  },
  buttonLabel: {
    fontFamily: 'Outfit_500Medium',
    color: '#FFFFFF',
  },
  buttonLabelSecondary: {
    color: colors.text,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  chip: {
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipUnselected: {
    backgroundColor: '#FFFDFB',
    borderColor: 'rgba(0,0,0,0.08)',
  },
  chipNeutral: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  chipAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(255,155,133,0.35)',
  },
  chipSuccess: {
    backgroundColor: 'rgba(115,180,156,0.16)',
    borderColor: 'rgba(115,180,156,0.35)',
  },
  chipDanger: {
    backgroundColor: 'rgba(242,143,121,0.14)',
    borderColor: 'rgba(242,143,121,0.35)',
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
  },
  chipTextUnselected: {
    color: colors.textMuted,
  },
  chipNeutralText: {
    color: colors.text,
  },
  chipAccentText: {
    color: '#F05F40',
  },
  chipSuccessText: {
    color: '#4F6B60',
  },
  chipDangerText: {
    color: '#9A4F44',
  },
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  pillNeutral: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pillSuccess: {
    backgroundColor: 'rgba(115,180,156,0.16)',
  },
  pillWarning: {
    backgroundColor: colors.accentSoft,
  },
  pillDanger: {
    backgroundColor: 'rgba(242,143,121,0.14)',
  },
  pillText: {
    fontFamily: 'Outfit_500Medium',
  },
  pillTextNeutral: {
    color: colors.textMuted,
  },
  pillTextSuccess: {
    color: '#4F6B60',
  },
  pillTextWarning: {
    color: '#F05F40',
  },
  pillTextDanger: {
    color: '#9A4F44',
  },
  input: {
    backgroundColor: '#FFFDFB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  select: {
    backgroundColor: '#FFFDFB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.86,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: spacing.lg,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: spacing.xl,
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginLeft: spacing.sm,
  },
});
