import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppText from '../../components/AppText';
import { colors, spacing } from '../../theme';

export default function GuestNestHeader({ title, subtitle, onBack, right }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          hitSlop={spacing.sm}
          onPress={onBack}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}
      <View style={styles.titleWrap}>
        <AppText variant="h2" align="center" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="caption"
            color="textMuted"
            align="center"
            numberOfLines={1}
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.rightWrap}>{right ?? <View style={styles.iconSpacer} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  pressed: {
    opacity: 0.8,
  },
  iconSpacer: {
    width: 40,
    height: 40,
  },
  subtitle: {
    marginTop: 2,
  },
  rightWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
