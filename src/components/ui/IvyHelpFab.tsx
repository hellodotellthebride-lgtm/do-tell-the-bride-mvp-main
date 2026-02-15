import React, { useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, screenPaddingX, sizes } from '../../theme';

type IvyHelpFabProps = {
  onPress?: () => void;
  accessibilityLabel?: string;
  insetRight?: number;
  insetBottom?: number;
  style?: StyleProp<ViewStyle>;
};

export default function IvyHelpFab({
  onPress,
  accessibilityLabel = 'Ask Ivy about this',
  insetRight = 0,
  insetBottom = screenPaddingX,
  style,
}: IvyHelpFabProps) {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    navigation?.navigate?.('AskIvy' as never);
  }, [navigation, onPress]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { right: insetRight, bottom: insetBottom }, style]}
    >
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={8}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    zIndex: 999,
    elevation: 20,
  },
  button: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    borderRadius: sizes.iconBadge / 2,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
