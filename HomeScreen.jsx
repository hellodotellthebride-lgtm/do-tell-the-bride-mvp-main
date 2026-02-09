import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Path, Rect } from 'react-native-svg';
import Screen from './src/components/Screen';
import AppText from './src/components/AppText';
import { colors, spacing } from './src/theme';

const HERO_HEIGHT = 260;
const heroImage = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const FIRST_NAME_KEY = 'ONBOARDING_FIRST_NAME';
const PARTNER_NAME_KEY = 'ONBOARDING_PARTNER_NAME';
const WEDDING_DATE_KEY = 'ONBOARDING_WEDDING_DATE';
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

const FIRST_PLACEHOLDER = 'Tell us your name';
const PARTNER_PLACEHOLDER = 'Tell us your partner’s name';
const DATE_PLACEHOLDER = 'Wedding date';

const featureTiles = [
  {
    id: 'hub',
    title: 'Wedding Hub',
    subtitle: 'Your plan in one place',
    tint: '#FCEFEA',
    icon: 'heart-outline',
    route: 'WeddingHub',
    primary: true,
  },
  {
    id: 'inspo',
    title: 'Inspiration Station',
    subtitle: 'Save styles & palettes',
    tint: '#FFF1ED',
    icon: 'color-palette-outline',
    route: 'InspirationStation',
    primary: false,
  },
];

const quickTools = [
  {
    id: 'vendor',
    title: 'Vendor Match',
    subtitle: 'Local suppliers',
    icon: 'storefront-outline',
    suggested: true,
  },
  {
    id: 'budget',
    title: 'Budget Buddy',
    subtitle: 'Track spending',
    icon: 'shield-outline',
  },
  { id: 'guests', title: 'Guest Nest', subtitle: 'Manage RSVPs', icon: 'people-outline' },
  { id: 'notes', title: 'Notes', subtitle: 'Open notes', icon: 'document-text-outline' },
];

const wellnessTiles = [
  {
    id: 'calm',
    title: 'Calm Corner',
    subtitle: 'Breathing, meditation & support',
    tint: '#E9F3ED',
    linkLabel: 'Explore →',
    linkColor: '#7E9C84',
    icon: 'leaf-outline',
    accent: '#7E9C84',
  },
  {
    id: 'ivy',
    title: 'Ask Ivy',
    subtitle: 'Ask anything: vendors, budgets, scripts, advice',
    tint: '#FFEDE6',
    linkLabel: 'Chat Now →',
    linkColor: '#F28F79',
    icon: 'chatbubble-ellipses-outline',
    accent: '#F28F79',
  },
];

const vendorCards = [
  {
    id: 'vendor-1',
    name: 'Elegant Moments',
    category: 'Photography',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'vendor-2',
    name: 'The Manor Estate',
    category: 'Venues',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  },
];

const ICON_ACCENT_COLOR = '#F28F79';

const BudgetJarIcon = ({ size = 20, color = ICON_ACCENT_COLOR }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={7}
      y={3}
      width={10}
      height={3}
      rx={1.5}
      stroke={color}
      strokeWidth={1.4}
    />
    <Path
      d="M8 6.5h8c.83 0 1.5.67 1.5 1.5v7.8c0 2.07-1.68 3.75-3.75 3.75H10.25C8.18 19.55 6.5 17.87 6.5 15.8V8c0-.83.67-1.5 1.5-1.5Z"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 11.8h5"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const QUOTES = [
  'Your wedding doesn’t need to impress anyone but you.',
  'There’s no such thing as doing this ‘wrong.’',
  'You’re allowed to choose what feels good, not just what looks good.',
  'A calm decision is still a good decision.',
  'This doesn’t have to be perfect to be meaningful.',
  'You’re planning a day, not proving a point.',
  'It’s okay if your wedding looks like you, not the internet.',
  'You’re allowed to change your mind.',
  'One thoughtful choice beats ten rushed ones.',
  'You don’t need to earn your own wedding.',
  'This is allowed to feel simple.',
  'The right pace is the one that keeps you steady.',
  'You’re building a day, not passing a test.',
  'Your wedding can be soft and strong at the same time.',
  'You’re doing better than you think.',
  'There’s room for joy here, even in the planning.',
  'You don’t need permission to do this your way.',
  'A wedding made with care is already enough.',
  'Nothing about this needs to be rushed.',
  'You’re allowed to enjoy this.',
];

const getOrdinalSuffix = (day) => {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return 'th';
  }
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

const parseStoredWeddingDate = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const iso = Date.parse(trimmed);
  if (!Number.isNaN(iso)) {
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  const normalized = trimmed.replace(/\s/g, '');
  const match = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const parsed = new Date(year, month, day);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
};

const formatOrdinalDate = (date) => {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${day}${suffix} ${month} ${date.getFullYear()}`;
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(Date.now());
  const [dailyQuote, setDailyQuote] = useState(QUOTES[0]);
  const [firstName, setFirstName] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    partnerName: '',
    weddingDate: '',
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setDailyQuote((current) => {
      if (QUOTES.length <= 1) {
        return current;
      }
      let nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      while (nextQuote === current) {
        nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      }
      return nextQuote;
    });
  }, []);

  const hydrateProfile = useCallback(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const [first, partner, wedding] = await Promise.all([
          AsyncStorage.getItem(FIRST_NAME_KEY),
          AsyncStorage.getItem(PARTNER_NAME_KEY),
          AsyncStorage.getItem(WEDDING_DATE_KEY),
        ]);
        if (mounted) {
          const trimmedFirst = (first ?? '').trim();
          const trimmedPartner = (partner ?? '').trim();
          setProfile({
            firstName: trimmedFirst,
            partnerName: trimmedPartner,
            weddingDate: wedding ?? '',
          });
          setFirstName(trimmedFirst);
        }
      } catch (error) {
        console.warn('Unable to load onboarding profile', error);
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(hydrateProfile);

  const firstNameValue = firstName?.trim() ?? '';
  const partnerNameValue = profile.partnerName?.trim() ?? '';
  const hasFirstName = firstNameValue.length > 0;
  const hasPartnerName = partnerNameValue.length > 0;
  const heroPhotoUri = null;
  const initials =
    (firstNameValue ? firstNameValue[0].toUpperCase() : '') +
    (hasPartnerName ? partnerNameValue[0].toUpperCase() : '');

  const parsedWeddingDate = useMemo(
    () => parseStoredWeddingDate(profile.weddingDate),
    [profile.weddingDate],
  );

  const countdownTarget = useMemo(() => {
    if (!parsedWeddingDate) return null;
    const copy = new Date(parsedWeddingDate);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }, [parsedWeddingDate]);
  const nowDate = useMemo(() => new Date(now), [now]);

  const isWeddingDateMissing = !parsedWeddingDate;
  const countdownDateDisplay = parsedWeddingDate ? formatOrdinalDate(parsedWeddingDate) : 'Add your wedding date';
  const weddingDayState = useMemo(() => {
    if (!countdownTarget) {
      return 'unknown';
    }
    const dayEnd = new Date(countdownTarget);
    dayEnd.setHours(23, 59, 59, 999);
    if (nowDate < countdownTarget) {
      return 'before';
    }
    if (nowDate > dayEnd) {
      return 'after';
    }
    return 'today';
  }, [countdownTarget, nowDate]);
  const hasCountdownTarget = Boolean(countdownTarget);
  const countdownBreakdown = useMemo(() => {
    if (!countdownTarget) {
      return null;
    }
    const diffMs = Math.max(0, countdownTarget.getTime() - nowDate.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }, [countdownTarget, nowDate]);
  const countdownUnits = countdownBreakdown
    ? [
        {
          key: 'days',
          label: countdownBreakdown.days === 1 ? 'day' : 'days',
          value: countdownBreakdown.days,
          pad: false,
        },
        {
          key: 'hours',
          label: countdownBreakdown.hours === 1 ? 'hour' : 'hours',
          value: countdownBreakdown.hours,
          pad: true,
        },
        {
          key: 'minutes',
          label: countdownBreakdown.minutes === 1 ? 'minute' : 'minutes',
          value: countdownBreakdown.minutes,
          pad: true,
        },
        {
          key: 'seconds',
          label: countdownBreakdown.seconds === 1 ? 'second' : 'seconds',
          value: countdownBreakdown.seconds,
          pad: true,
        },
      ]
    : [];
  const daypartGreeting = useMemo(() => {
    const hour = nowDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    if (hour < 22) return 'Good evening';
    return 'Slow night';
  }, [nowDate]);
  const heroGreetingLine = hasFirstName
    ? `${daypartGreeting}, ${firstNameValue}`
    : 'Today starts gently.';
  const heroSupportLine = hasPartnerName
    ? `${firstNameValue} & ${partnerNameValue}`
    : 'Your wedding, your pace.';
  const countdownIntroLine = useMemo(() => {
    if (!hasCountdownTarget) {
      return 'Add your wedding date to start the countdown.';
    }
    if (weddingDayState === 'today') {
      return 'Today is your big day.';
    }
    if (weddingDayState === 'after') {
      return 'Already celebrated with love.';
    }
    const daysRemaining = countdownBreakdown?.days ?? 0;
    const label = daysRemaining === 1 ? 'day' : 'days';
    return `${daysRemaining} ${label} until your big day.`;
  }, [countdownBreakdown, hasCountdownTarget, weddingDayState]);
  const countdownCaption = useMemo(() => {
    if (!hasCountdownTarget) {
      return 'Add your date to unlock your calm countdown.';
    }
    if (weddingDayState === 'today') {
      return 'We’re right here with you — breathe, enjoy, be present.';
    }
    if (weddingDayState === 'after') {
      return 'Hope today was everything you wanted and more.';
    }
    const hour = nowDate.getHours();
    if (hour < 12) {
      return 'One calm step at a time.';
    }
    if (hour < 18) {
      return 'You’re doing enough today.';
    }
    if (hour < 22) {
      return 'Let the evening stay gentle.';
    }
    return 'Nothing needs deciding right now.';
  }, [hasCountdownTarget, nowDate, weddingDayState]);

  const handleNavigate = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
      return;
    }
    console.log('[Home] navigate ->', route);
  };

  const heroTopPadding = Math.max(0, insets.top - 20);

  return (
    <Screen scroll>
      <View style={styles.dashboardColumn}>
        <View style={[styles.heroSection, { paddingTop: heroTopPadding }]}>
          <View style={styles.heroImageWrap}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.avatarWrap}>
                {heroPhotoUri ? (
                  <Image source={{ uri: heroPhotoUri }} style={styles.avatarImage} />
                ) : (
                  <AppText variant="h3" color="textMuted">
                    {initials || '?'}
                  </AppText>
                )}
              </View>
              <View style={styles.heroIdentityText}>
                <AppText variant="bodySmall" style={styles.heroGreetingText}>
                  {heroGreetingLine}
                </AppText>
                <AppText variant="h2" style={styles.heroNamesText} numberOfLines={1} ellipsizeMode="tail">
                  {heroSupportLine}
                </AppText>
              </View>
              <Pressable
                onPress={() => navigation?.navigate?.('Account')}
                style={styles.heroSettingsButton}
                hitSlop={10}
              >
                <Ionicons name="settings-outline" size={18} color={colors.text} />
              </Pressable>
            </View>
            <View style={styles.countdownCard}>
              <View pointerEvents="none" style={styles.countdownAccent} />
              <Pressable
                onPress={() => navigation?.navigate?.('Account')}
                hitSlop={{ top: spacing.xs, bottom: spacing.xs, left: spacing.xs, right: spacing.xs }}
                style={styles.countdownHeaderCard}
              >
                <View style={styles.countdownHeaderLeft}>
                  <View style={styles.countdownHeaderIcon}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text} />
                  </View>
                  <View style={styles.countdownHeaderText}>
                    <AppText variant="body" style={styles.countdownDateText}>
                      {countdownDateDisplay}
                    </AppText>
                    <AppText variant="bodySmall" color="textMuted" style={styles.countdownIntroText}>
                      {countdownIntroLine}
                    </AppText>
                  </View>
                </View>
                <View style={styles.countdownEditButton}>
                  <Ionicons name="pencil" size={14} color={colors.text} />
                </View>
              </Pressable>
              {hasCountdownTarget ? (
                <>
                  <View style={styles.countdownGrid}>
                    {countdownUnits.map((unit) => (
                      <View key={unit.key} style={styles.countdownGridItem}>
                        <AppText variant="h2" style={styles.countdownGridValue}>
                          {unit.pad ? String(unit.value).padStart(2, '0') : unit.value}
                        </AppText>
                        <AppText variant="caption" color="textMuted" style={styles.countdownGridLabel}>
                          {unit.label}
                        </AppText>
                      </View>
                    ))}
                  </View>
                  <AppText variant="bodySmall" color="textMuted" style={styles.countdownFooterText}>
                    {countdownCaption}
                  </AppText>
                </>
              ) : (
                <AppText variant="bodySmall" color="textMuted" style={styles.countdownFooterText}>
                  {countdownCaption}
                </AppText>
              )}
            </View>
          </View>
        </View>
        <View style={styles.contentColumn}>
          <Pressable
            style={styles.roadmapCard}
            onPress={() => navigation?.navigate?.('WeddingRoadmap', { state: 'progress' })}
          >
            <View pointerEvents="none" style={styles.roadmapAccent} />
            <View style={styles.roadmapHeader}>
              <View style={styles.roadmapIcon}>
                <Ionicons name="map-outline" size={20} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="h3">Your Wedding Roadmap</AppText>
                <AppText variant="bodySmall" color="textMuted">
                  Ready when you are
                </AppText>
              </View>
              <AppText variant="bodySmall" color="accent" style={styles.roadmapLink}>
                Continue ›
              </AppText>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </Pressable>

        <View style={styles.sectionWrapper}>
          <AppText variant="labelSmall" color="textMuted">
            YOUR SPACES
          </AppText>
        </View>
        <View style={styles.tilesRow}>
          {featureTiles.map((tile) => (
            <Pressable
              key={tile.id}
              style={[
                styles.largeTile,
                { backgroundColor: tile.tint },
                tile.primary && styles.largeTilePrimary,
              ]}
              onPress={() =>
                tile.id === 'hub'
                  ? navigation.navigate('WeddingHub')
                  : handleNavigate(tile.route)
              }
            >
              {tile.primary && <View pointerEvents="none" style={styles.tileAccent} />}
              <View
                style={[
                  styles.tileIconBadge,
                  tile.primary && styles.tileIconBadgePrimary,
                ]}
              >
                <Ionicons
                  name={tile.icon}
                  size={22}
                  color={tile.primary ? '#FFF' : colors.text}
                />
              </View>
              <AppText
                variant="h3"
                style={[styles.tileTitle, tile.primary && styles.tileTitlePrimary]}
              >
                {tile.title}
              </AppText>
              <AppText
                variant="bodySmall"
                color={tile.primary ? 'text' : 'textMuted'}
                style={tile.primary && styles.tileSubtitlePrimary}
              >
                {tile.subtitle}
              </AppText>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionWrapper}>
          <AppText variant="labelSmall" color="textMuted">
            QUICK TOOLS
          </AppText>
          <View style={styles.quickGrid}>
            {quickTools.map((tool) => (
              <Pressable
                key={tool.id}
                style={[styles.quickCard, tool.suggested && styles.quickCardSuggested]}
              >
                {tool.suggested ? (
                  <View style={styles.quickTag}>
                    <AppText variant="caption" color="text">
                      Suggested
                    </AppText>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.quickIconBadge,
                    tool.suggested && styles.quickIconBadgeSuggested,
                  ]}
                >
                  {tool.id === 'budget' ? (
                    <BudgetJarIcon color={tool.suggested ? colors.warning : ICON_ACCENT_COLOR} />
                  ) : (
                    <Ionicons name={tool.icon} size={20} color={colors.text} />
                  )}
                </View>
                <AppText variant="h3" style={styles.quickTitle}>
                  {tool.title}
                </AppText>
                <AppText variant="bodySmall" color="textMuted">
                  {tool.subtitle}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionWrapper}>
          <AppText variant="labelSmall" color="textMuted">
            WELLNESS & SUPPORT
          </AppText>
          <View style={styles.wellnessRow}>
            {wellnessTiles.map((card) => (
              <View
                key={card.id}
                style={[
                  styles.wellnessCard,
                  { backgroundColor: card.tint },
                  card.id === 'calm' ? styles.wellnessCardCool : styles.wellnessCardWarm,
                ]}
              >
                <View
                  style={[
                    styles.wellnessIconBadge,
                    card.id === 'calm' ? styles.wellnessIconBadgeCool : styles.wellnessIconBadgeWarm,
                  ]}
                >
                  <Ionicons
                    name={card.icon ?? 'sparkles-outline'}
                    size={20}
                    color={card.accent ?? card.linkColor}
                  />
                </View>
                <AppText variant="h3" style={styles.wellnessTitle}>
                  {card.title}
                </AppText>
                <AppText variant="bodySmall" color="textMuted">
                  {card.subtitle}
                </AppText>
                <View style={styles.wellnessDivider} />
                <AppText variant="bodySmall" style={[styles.wellnessLink, { color: card.linkColor }]}>
                  {card.linkLabel}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.vendorsCard}>
          <View style={styles.vendorsHeader}>
            <View style={styles.vendorsIcon}>
              <Ionicons name="pricetag-outline" size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Vendors</AppText>
              <AppText variant="bodySmall" color="textMuted">
                Explore lovely vendors
              </AppText>
            </View>
          </View>
          <View style={styles.vendorRow}>
            {vendorCards.map((vendor) => (
              <View key={vendor.id} style={styles.vendorTile}>
                <View style={styles.vendorImageWrap}>
                  <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
                </View>
                <AppText variant="body" style={styles.vendorName}>
                  {vendor.name}
                </AppText>
                <AppText variant="caption">{vendor.category}</AppText>
              </View>
            ))}
          </View>
          <Pressable hitSlop={6}>
            <AppText variant="bodySmall" color="accent">
              View All Vendors →
            </AppText>
          </Pressable>
        </View>

        <View style={styles.quoteCard}>
          <AppText variant="body" align="center">
            {dailyQuote}
          </AppText>
        </View>
      </View>
    </View>
  </Screen>
  );
}

const styles = StyleSheet.create({
  dashboardColumn: {
    width: '100%',
    alignSelf: 'stretch',
  },
  contentColumn: {
    width: '100%',
    alignSelf: 'stretch',
  },
  heroSection: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFF7F2',
    marginBottom: 36,
  },
  heroBleed: {
    marginHorizontal: 0,
  },
  pageGutter: {
    paddingHorizontal: 4,
  },
  heroImageWrap: {
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#FDF5F1',
    paddingVertical: 24,
    paddingHorizontal: 24,
    gap: 18,
    shadowColor: 'rgba(16, 8, 0, 0.05)',
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
  },
  heroSettingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIdentityText: {
    flex: 1,
    minWidth: 0,
  },
  heroGreetingText: {
    fontSize: 14,
    color: '#8C7A72',
    marginBottom: 2,
  },
  heroNamesText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: '#2B2B2B',
    lineHeight: 32,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,155,133,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    color: '#2B2B2B',
    opacity: 0.75,
  },
  countdownCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 20,
    minHeight: 130,
    shadowColor: '#F5B7A3',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    overflow: 'hidden',
  },
  countdownAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,155,133,0.5)',
  },
  countdownHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    zIndex: 2,
  },
  countdownHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  countdownHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  countdownDateText: {
    marginLeft: 0,
    color: '#B4614D',
    fontWeight: '600',
  },
  countdownIntroText: {
    marginTop: 2,
    color: '#A07A6D',
  },
  countdownEditButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  countdownGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  countdownGridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  countdownGridValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    color: '#F26855',
    lineHeight: 40,
  },
  countdownGridLabel: {
    marginTop: 2,
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'none',
    color: '#A98274',
  },
  countdownFooterText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    color: '#B87F71',
    fontFamily: 'Outfit_500Medium',
  },
  roadmapCard: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,155,133,0.16)',
    paddingVertical: 26,
    paddingHorizontal: 24,
    marginBottom: 18,
    shadowColor: '#F1E3DA',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    position: 'relative',
    overflow: 'hidden',
  },
  roadmapAccent: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 6,
    borderRadius: 4,
    backgroundColor: '#FF9B85',
    opacity: 0.85,
  },
  roadmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roadmapIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE9E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  roadmapTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: '#2F2925',
  },
  roadmapSubtitle: {
    color: '#9B8B82',
    marginTop: 4,
  },
  roadmapLink: {
    color: '#F28F79',
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#F2D4C5',
    overflow: 'hidden',
    marginTop: 18,
  },
  progressFill: {
    width: '0%',
    height: '100%',
    backgroundColor: '#F05F40',
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  largeTile: {
    width: '48%',
    borderRadius: 26,
    padding: 20,
    shadowColor: '#E8E2DB',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  largeTilePrimary: {
    shadowColor: '#F3C6B6',
    shadowOpacity: 0.48,
    shadowRadius: 20,
  },
  tileAccent: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderRadius: 4,
    backgroundColor: '#FF9B85',
    opacity: 0.9,
  },
  tileIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  tileIconText: {
    color: ICON_ACCENT_COLOR,
  },
  tileIconTextPrimary: {
    color: '#F05F40',
  },
  tileIconBadgePrimary: {
    backgroundColor: '#FFE3D8',
  },
  tileTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: '#2F2925',
    textAlign: 'center',
  },
  tileTitlePrimary: {
    fontSize: 19,
    color: '#1B1510',
  },
  tileSubtitle: {
    marginTop: 6,
    color: '#8F8078',
    textAlign: 'center',
  },
  tileSubtitlePrimary: {
    color: '#6F5C55',
    fontWeight: '500',
  },
  sectionWrapper: {
    marginTop: 34,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8F8F8F',
    marginBottom: 18,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.25)',
    shadowColor: '#F3E6DD',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  quickCardSuggested: {
    borderColor: '#FF9B85',
    backgroundColor: 'rgba(255,155,133,0.18)',
    borderWidth: 2,
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  quickIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF4F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickIconText: {
    color: ICON_ACCENT_COLOR,
  },
  quickIconBadgeSuggested: {
    backgroundColor: '#FFD6CC',
    transform: [{ scale: 1.05 }],
  },
  quickTitle: {
    fontWeight: '600',
    color: '#2F2925',
    textAlign: 'center',
  },
  quickSubtitle: {
    marginTop: 4,
    color: '#9D8F86',
    fontSize: 13,
    textAlign: 'center',
  },
  quickTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF9B85',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  quickTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  wellnessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wellnessCard: {
    width: '48%',
    borderRadius: 26,
    padding: 22,
    shadowColor: '#E8E2DB',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  wellnessCardCool: {
    borderWidth: 1,
    borderColor: 'rgba(126,156,132,0.25)',
  },
  wellnessCardWarm: {
    borderWidth: 1,
    borderColor: 'rgba(242,143,121,0.25)',
  },
  wellnessIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessIconBadgeCool: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  wellnessIconBadgeWarm: {
    backgroundColor: '#FFE4DB',
  },
  wellnessTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: '#2F2925',
  },
  wellnessSubtitle: {
    marginTop: 6,
    color: '#8F8078',
  },
  wellnessDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 12,
  },
  wellnessLink: {
    fontWeight: '600',
  },
  vendorsCard: {
    marginTop: 44,
    borderRadius: 28,
    backgroundColor: '#FFEFE7',
    padding: 24,
    shadowColor: '#F0D6CA',
    shadowOpacity: 0.4,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: 'rgba(242,143,121,0.25)',
    marginBottom: 24,
  },
  vendorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  vendorsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE1D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  vendorsTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: '#2B1F1A',
  },
  vendorsSubtitle: {
    color: '#9D8F86',
  },
  vendorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  vendorTile: {
    width: '48%',
  },
  vendorImageWrap: {
    height: 130,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  vendorImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  vendorName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    color: '#2F2925',
  },
  vendorCategory: {
    color: '#9D8F86',
    marginTop: 2,
  },
  vendorsLink: {
    marginTop: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    backgroundColor: '#F28F79',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'center',
  },
  quoteCard: {
    marginTop: 20,
    borderRadius: 26,
    backgroundColor: '#FFF8F2',
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#EADFD6',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 4,
  },
  quoteText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: '#6A5149',
    textAlign: 'center',
  },
});
