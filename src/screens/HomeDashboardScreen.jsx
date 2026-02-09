import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import {
  colors,
  spacing,
  radius,
  sizes,
  layout,
  componentStyles,
} from '../theme';

const STORAGE_KEYS = {
  firstName: 'ONBOARDING_FIRST_NAME',
  partnerName: 'ONBOARDING_PARTNER_NAME',
  weddingDate: 'ONBOARDING_WEDDING_DATE',
};

const DEFAULT_COUPLE_NAME = 'Sarah & Dan';
const DEFAULT_COUPLE_INITIALS = 'SD';
const DEFAULT_DISPLAY_DATE = '6th February 2026';
const DEFAULT_COUNTDOWN_TARGET = new Date(2026, 1, 6, 12, 0, 0);
const COUNTDOWN_SEGMENTS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hrs' },
  { key: 'minutes', label: 'Mins' },
  { key: 'seconds', label: 'Secs' },
];
const ICON_SIZE = Math.round(sizes.iconBadge * 0.45);
const TITLE_ICON_SIZE = Math.round(sizes.avatarMd * 0.45);

const formatOrdinalSuffix = (day) => {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatDisplayDate = (date) => {
  if (!date) return DEFAULT_DISPLAY_DATE;
  const day = date.getDate();
  const suffix = formatOrdinalSuffix(day);
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${day}${suffix} ${month} ${date.getFullYear()}`;
};

const normalizeDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const normalized = new Date(parsed);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
};

const getCountdownValues = (targetDate) => {
  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    return {
      days: '--',
      hours: '--',
      minutes: '--',
      seconds: '--',
    };
  }
  const now = new Date();
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export default function HomeDashboardScreen({ navigation }) {
  const [profile, setProfile] = useState({
    firstName: '',
    partnerName: '',
    weddingDate: '',
  });
  const [hydrated, setHydrated] = useState(false);
  const [countdown, setCountdown] = useState(() =>
    getCountdownValues(DEFAULT_COUNTDOWN_TARGET),
  );

  const hydrateProfile = useCallback(() => {
    let isActive = true;
    const load = async () => {
      try {
        const [firstName, partnerName, weddingDate] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.firstName),
          AsyncStorage.getItem(STORAGE_KEYS.partnerName),
          AsyncStorage.getItem(STORAGE_KEYS.weddingDate),
        ]);
        if (!isActive) return;
        setProfile({
          firstName: firstName ?? '',
          partnerName: partnerName ?? '',
          weddingDate: weddingDate ?? '',
        });
      } catch (error) {
        console.warn('[HomeDashboard] Unable to hydrate profile', error);
      } finally {
        if (isActive) {
          setHydrated(true);
        }
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(hydrateProfile);

  const showPlaceholders = !hydrated;

  const coupleName = useMemo(() => {
    if (showPlaceholders) {
      return DEFAULT_COUPLE_NAME;
    }
    const first = profile.firstName?.trim() ?? '';
    const partner = profile.partnerName?.trim() ?? '';
    if (first && partner) {
      return `${first} & ${partner}`;
    }
    if (first || partner) {
      return first || partner;
    }
    return DEFAULT_COUPLE_NAME;
  }, [profile.firstName, profile.partnerName, showPlaceholders]);

  const coupleInitials = useMemo(() => {
    if (showPlaceholders) {
      return DEFAULT_COUPLE_INITIALS;
    }
    const firstInitial = profile.firstName?.trim()?.[0]?.toUpperCase() ?? '';
    const partnerInitial = profile.partnerName?.trim()?.[0]?.toUpperCase() ?? '';
    const combined = `${firstInitial}${partnerInitial}`.trim();
    return combined || DEFAULT_COUPLE_INITIALS;
  }, [profile.firstName, profile.partnerName, showPlaceholders]);

  const parsedWeddingDate = useMemo(
    () => normalizeDate(profile.weddingDate),
    [profile.weddingDate],
  );

  const displayDateText = useMemo(() => {
    if (showPlaceholders) {
      return DEFAULT_DISPLAY_DATE;
    }
    return parsedWeddingDate ? formatDisplayDate(parsedWeddingDate) : 'Add your wedding date';
  }, [parsedWeddingDate, showPlaceholders]);

  const countdownTarget = useMemo(() => {
    if (showPlaceholders) {
      return DEFAULT_COUNTDOWN_TARGET;
    }
    return parsedWeddingDate ?? null;
  }, [parsedWeddingDate, showPlaceholders]);

  useEffect(() => {
    if (!countdownTarget) {
      setCountdown(getCountdownValues(null));
      return () => {};
    }
    setCountdown(getCountdownValues(countdownTarget));
    const timer = setInterval(() => {
      setCountdown(getCountdownValues(countdownTarget));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  const countdownDisplay = useMemo(
    () =>
      COUNTDOWN_SEGMENTS.map((segment) => ({
        label: segment.label,
        value:
          countdown[segment.key] === '--'
            ? '--'
            : String(countdown[segment.key]).padStart(2, '0'),
      })),
    [countdown],
  );

  const handleNavigateSettings = () => {
    navigation?.navigate?.('Account', { from: 'HomeDashboard', intent: 'settings' });
  };

  const handleEditDate = () => {
    console.log('Edit wedding date pressed');
  };

  const handleOpenRoadmap = () => {
    navigation?.navigate?.('WeddingRoadmap');
  };

  return (
    <Screen contentContainerStyle={styles.screenContent}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.avatarCircle}>
            <AppText variant="body" color="text" style={styles.avatarText}>
              {coupleInitials}
            </AppText>
          </View>
          <View style={styles.titleWrap}>
            <AppText variant="h2" align="center">
              {coupleName}
            </AppText>
          </View>
          <Pressable
            hitSlop={spacing.sm}
            onPress={handleNavigateSettings}
            style={({ pressed }) => [
              styles.iconCircle,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="settings-outline" size={TITLE_ICON_SIZE} color={colors.text} />
          </Pressable>
        </View>

        <View style={[componentStyles.softCard, styles.countdownCard]}>
          <View style={styles.datePill}>
            <View style={styles.iconBadge}>
              <Ionicons name="calendar-outline" size={ICON_SIZE} color={colors.accent} />
            </View>
            <AppText variant="body" color="text" style={styles.dateText}>
              {displayDateText}
            </AppText>
            <Pressable hitSlop={spacing.sm} onPress={handleEditDate} style={styles.editButton}>
              <Ionicons name="pencil-outline" size={ICON_SIZE} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.countdownRow}>
            {countdownDisplay.map((segment) => (
              <View key={segment.label} style={styles.countdownColumn}>
                <AppText variant="h2" color="accent" align="center">
                  {segment.value}
                </AppText>
                <AppText variant="labelSmall" color="warning" align="center" style={styles.countdownLabel}>
                  {segment.label}
                </AppText>
              </View>
            ))}
          </View>

          <AppText variant="bodySmall" color="textMuted" align="center">
            Until your big day.
          </AppText>
        </View>

        <Pressable
          onPress={handleOpenRoadmap}
          hitSlop={spacing.sm}
          style={({ pressed }) => [
            componentStyles.softCard,
            styles.roadmapCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.roadmapAccent} />
          <View style={styles.roadmapIconWrap}>
            <View style={styles.iconBadgeSmall}>
              <Ionicons name="map-outline" size={ICON_SIZE} color={colors.warning} />
            </View>
          </View>
          <View style={styles.roadmapTextBlock}>
            <AppText variant="h3" color="text">
              Your Wedding Roadmap
            </AppText>
            <AppText variant="bodySmall" color="textMuted" style={styles.roadmapSubtitle}>
              Pick back up exactly where you left off.
            </AppText>
          </View>
          <AppText variant="body" color="accent" style={styles.roadmapLink}>
            Continue ›
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: layout.maxCardWidth,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  avatarCircle: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
    borderRadius: sizes.avatarMd / 2,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    letterSpacing: 1,
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
    borderRadius: sizes.avatarMd / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  countdownCard: {
    marginBottom: spacing.jumbo,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  iconBadge: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    borderRadius: sizes.iconBadge / 2,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeSmall: {
    width: sizes.iconBadge,
    height: sizes.iconBadge,
    borderRadius: sizes.iconBadge / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  editButton: {
    marginLeft: spacing.md,
  },
  divider: {
    height: spacing.xs / 2,
    backgroundColor: colors.borderSoft,
    opacity: 0.6,
    borderRadius: radius.pill,
    marginVertical: spacing.md,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  countdownColumn: {
    flex: 1,
    alignItems: 'center',
  },
  countdownLabel: {
    marginTop: spacing.xs,
  },
  roadmapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingRight: spacing.xxl,
    paddingLeft: spacing.giant,
    position: 'relative',
    overflow: 'hidden',
  },
  roadmapAccent: {
    position: 'absolute',
    top: spacing.xl,
    bottom: spacing.xl,
    left: spacing.lg,
    width: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    opacity: 0.65,
  },
  roadmapIconWrap: {
    marginRight: spacing.md,
  },
  roadmapTextBlock: {
    flex: 1,
  },
  roadmapSubtitle: {
    marginTop: spacing.xs,
  },
  roadmapLink: {
    marginLeft: spacing.md,
  },
});
