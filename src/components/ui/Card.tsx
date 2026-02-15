import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { cardPadding, colors, radius, shadows } from '../../theme';

type CardProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  backgroundColor?: string;
  borderColor?: string;
  elevated?: boolean;
};

export default function Card({
  children,
  style,
  padding = cardPadding,
  backgroundColor = '#FFFFFF',
  borderColor = colors.borderSoft,
  elevated = true,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding, backgroundColor, borderColor },
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.card,
    borderWidth: 1,
  },
  elevated: {
    ...shadows.softCard,
  },
});
