import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../components/AppText';
import { colors } from '../theme';

const S8 = 8;
const S16 = 16;
const S24 = 24;

export default function AskIvyEntry({
  children,
  style,
  variant = 'tile',
  title = 'Ask Ivy',
  subtitle = 'Your calm wedding expert',
}) {
  const navigation = useNavigation();
  const [opening, setOpening] = useState(false);

  const openAskIvy = useCallback(async () => {
    if (opening) return;
    setOpening(true);
    navigation?.navigate?.('AskIvy');
    setOpening(false);
  }, [navigation, opening]);

  const defaultContent = useMemo(() => {
    if (variant === 'button') {
      return (
        <View style={styles.buttonRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.accent} />
          <AppText variant="body" style={styles.buttonLabel}>
            {title}
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.tileRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">{title}</AppText>
          <AppText variant="bodySmall" color="textMuted">
            {subtitle}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    );
  }, [subtitle, title, variant]);

  return (
    <Pressable
      onPress={openAskIvy}
      accessibilityRole="button"
      disabled={opening}
      style={({ pressed }) => [
        styles.base,
        variant === 'button' ? styles.baseButton : styles.baseTile,
        pressed && styles.pressed,
        style,
      ]}
    >
      {children || defaultContent}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: S24,
  },
  baseTile: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: S16,
  },
  baseButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: S16,
    paddingHorizontal: S24,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.92,
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S8,
  },
  buttonLabel: {
    fontFamily: 'Outfit_500Medium',
  },
});
