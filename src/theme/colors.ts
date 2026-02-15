type HexColor = `#${string}`;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const normalizeHex = (hex: string) => {
  const trimmed = hex.trim();
  if (!trimmed.startsWith('#')) return null;
  const raw = trimmed.slice(1);
  if (raw.length === 3) {
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toUpperCase();
  }
  if (raw.length === 6) return `#${raw}`.toUpperCase();
  return null;
};

export const hexToRgba = (hex: string, opacity: number) => {
  const normalized = normalizeHex(hex);
  if (!normalized) return hex;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${clamp01(opacity)})`;
};

export const PALETTE_LIGHT = {
  primary: '#FF9B85',
  background: '#FAF8F6',
  surface: '#FFFFFF',
  text: '#2B2B2B',
  textSecondary: '#6E6E6E',
  border: '#EAE3DD',
  muted: '#F1ECE7',
  sageGrey: '#A8B8B2',
  blueGrey: '#8FA3B0',
  success: '#73B49C',
  danger: '#C62828',
} as const satisfies Record<string, HexColor>;

export const colors = {
  ...PALETTE_LIGHT,

  // Back-compat aliases used across the app
  accent: PALETTE_LIGHT.primary,
  textMuted: PALETTE_LIGHT.textSecondary,
  borderSoft: PALETTE_LIGHT.border,

  // Derived tints
  accentSoft: hexToRgba(PALETTE_LIGHT.primary, 0.15),
  accentChip: hexToRgba(PALETTE_LIGHT.primary, 0.18),
  overlaySoft: 'rgba(255,255,255,0.65)',

  // Legacy tokens still referenced in a few places
  card: PALETTE_LIGHT.surface,
  neutral: PALETTE_LIGHT.muted,
  warning: PALETTE_LIGHT.primary,
  shadow: '#000000',
} as const;

export const getPrimaryPressed = () => hexToRgba(colors.primary, 0.88);

export const getDisabled = () => ({
  text: hexToRgba(colors.textSecondary, 0.45),
  background: colors.muted,
});

