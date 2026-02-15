import { colors } from './colors';

export const screenPaddingX = 20;
export const sectionGap = 24;
export const cardPadding = 16;
export const radiusCard = 20;
export const gapSm = 8;
export const gapMd = 12;
export const gapLg = 16;

export { colors };

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  card: radiusCard,
  xl: 24,
  pill: 999,
};

export const spacing = {
  none: 0,
  xs: 4,
  sm: gapSm,
  md: gapMd,
  lg: gapLg,
  xl: screenPaddingX,
  xxl: sectionGap,
  jumbo: 32,
  giant: 40,
  gapSm,
  gapMd,
  gapLg,
  screenPaddingX,
  sectionGap,
  cardPadding,
};

export const shadows = {
  softCard: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
};

export const sizes = {
  avatarMd: 48,
  iconBadge: 42,
  cardMaxWidth: 420,
};
