import { StyleSheet } from 'react-native';
import { colors } from './tokens';

const serifBold = 'PlayfairDisplay_700Bold';
const serifSemi = 'PlayfairDisplay_600SemiBold';
const sansRegular = 'Outfit_400Regular';
const sansMedium = 'Outfit_500Medium';
const sansSemi = 'Outfit_500Medium';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: serifBold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.text,
  },
  h2: {
    fontFamily: serifSemi,
    fontSize: 26,
    lineHeight: 32,
    color: colors.text,
  },
  h3: {
    fontFamily: serifSemi,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
  },
  body: {
    fontFamily: sansRegular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  bodySmall: {
    fontFamily: sansRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  label: {
    fontFamily: sansSemi,
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 18,
    color: colors.text,
    textTransform: 'uppercase',
  },
  labelSmall: {
    fontFamily: sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    lineHeight: 16,
    color: colors.text,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: sansRegular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});

export const textVariants = {
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  body: typography.body,
  bodySmall: typography.bodySmall,
  label: typography.label,
  labelSmall: typography.labelSmall,
  caption: typography.caption,
};
