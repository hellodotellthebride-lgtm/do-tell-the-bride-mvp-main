import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { textVariants } from '../theme/typography';

const variantMap = {
  h1: textVariants.h1,
  h2: textVariants.h2,
  h3: textVariants.h3,
  body: textVariants.body,
  bodySmall: textVariants.bodySmall,
  label: textVariants.label,
  labelSmall: textVariants.labelSmall,
  caption: textVariants.caption,
};

export default function AppText({
  variant = 'body',
  color = 'text',
  align = 'left',
  style = undefined,
  children,
  ...rest
}) {
  const textStyle = variantMap[variant] || variantMap.body;
  const colorValue = colors[color] || colors.text;

  return (
    <Text
      {...rest}
      style={StyleSheet.flatten([
        textStyle,
        { color: colorValue, textAlign: align },
        style,
      ])}
    >
      {children}
    </Text>
  );
}
