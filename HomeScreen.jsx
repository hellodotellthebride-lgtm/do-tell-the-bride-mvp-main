import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from './src/components/Screen';
import IvyHelpFab from './src/components/ui/IvyHelpFab';
import AppText from './src/components/AppText';
import TodayStepCard from './src/components/TodayStepCard';
import PlanSnapshot from './src/components/PlanSnapshot';
import QuickToolPill from './src/components/QuickToolPill';
import WellnessPanel from './src/components/WellnessPanel';
import VendorCarousel from './src/components/VendorCarousel';
import { loadBudgetState } from './src/budget/budgetStorage';
import { loadGuestNest } from './src/guestNest/guestNestStorage';
import { computeOverallProgress, loadChecklistState, loadCompletionState } from './src/roadmap/progressStorage';
import { getChecklistItems } from './src/roadmap/checklists';
import { getRecommendedVendors } from './src/vendors/vendorRecommendations';
import { colors, spacing } from './src/theme';

const FIRST_NAME_KEY = 'ONBOARDING_FIRST_NAME';
const PARTNER_NAME_KEY = 'ONBOARDING_PARTNER_NAME';
const WEDDING_DATE_KEY = 'ONBOARDING_WEDDING_DATE';
const WEDDING_LOCATION_KEY = 'ACCOUNT_WEDDING_LOCATION';
const WEDDING_TYPE_KEY = 'ACCOUNT_WEDDING_TYPE';
const GUEST_ESTIMATE_KEY = 'ACCOUNT_GUEST_ESTIMATE';
const HOME_LAST_RSVP_REMINDER_AT_KEY = 'HOME_LAST_RSVP_REMINDER_AT';
const HOME_LAST_ACTIVE_AT_KEY = 'HOME_LAST_ACTIVE_AT';
const HOME_LAST_TODAY_STEP_PRESS_AT_KEY = 'HOME_LAST_TODAY_STEP_PRESS_AT';
const GUEST_NEST_LAST_OPEN_AT_KEY = 'GUEST_NEST_LAST_OPEN_AT';
const HOME_NUDGE_LAST_SHOWN_GUEST_KEY = 'HOME_NUDGE_LAST_SHOWN_GUEST';
const HOME_NUDGE_LAST_SHOWN_TODAY_KEY = 'HOME_NUDGE_LAST_SHOWN_TODAY';
const HOME_NUDGE_LAST_SHOWN_VENDOR_KEY = 'HOME_NUDGE_LAST_SHOWN_VENDOR';

const HOME_COLORS = {
  background: colors.background,
  backgroundTop: colors.muted,
  card: colors.surface,
  text: colors.text,
  textBody: colors.textSecondary,
  textSoft: colors.textSecondary,
  coral: colors.primary,
  coralSoft: colors.accentChip,
  peachTint: colors.accentChip,
  green: '#3F7F63',
  greenTint: '#EAF6EF',
};

const DEFAULT_TODAY_STEP = {
  id: 'budget',
  title: 'Set your starting budget',
  subtitle: 'A calm number to anchor decisions.',
  ctaLabel: 'Open Budget Buddy',
  type: 'money',
  badgeIcon: '💸',
  routeName: 'Budget Buddy',
  params: undefined,
};

const DAY_MS = 24 * 60 * 60 * 1000;

const getDaysSince = (timestamp) => {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;
  const ms = Date.now() - timestamp;
  if (!Number.isFinite(ms) || ms < 0) return null;
  return Math.floor(ms / DAY_MS);
};

const isSameLocalDay = (a, b) => {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

const isProgressTightForTimeline = ({ weddingDayState, daysUntilWedding, overallProgress }) => {
  if (weddingDayState !== 'before') return false;
  if (typeof daysUntilWedding !== 'number') return false;
  if (!Number.isFinite(overallProgress)) return false;

  if (daysUntilWedding <= 14) return overallProgress < 60;
  if (daysUntilWedding <= 45) return overallProgress < 40;
  if (daysUntilWedding <= 120) return overallProgress < 20;
  return false;
};

const formatDaysSince = (msSince) => {
  if (!Number.isFinite(msSince) || msSince < 0) return null;
  const days = Math.floor(msSince / DAY_MS);
  if (days <= 0) return 'Reminder sent today';
  return `Reminder sent ${days}d ago`;
};

const parseGuestCap = (raw) => {
  if (raw === null || raw === undefined) return Number.NaN;
  if (typeof raw === 'number') return raw;
  const text = String(raw).trim();
  if (!text) return Number.NaN;
  const matches = text.match(/\d+(\.\d+)?/g);
  if (!matches) return Number.NaN;
  const numbers = matches.map((m) => Number(m)).filter((n) => Number.isFinite(n));
  if (numbers.length === 0) return Number.NaN;
  return Math.max(...numbers);
};

const getFirstName = (fullName) => {
  if (typeof fullName !== 'string') return null;
  const trimmed = fullName.trim();
  if (!trimmed) return null;
  const firstToken = trimmed.split(/\s+/g).filter(Boolean)[0];
  if (!firstToken) return null;
  const asciiCleaned = firstToken.replace(/^[^A-Za-z0-9]+/, '').replace(/[^A-Za-z0-9]+$/, '');
  return asciiCleaned || firstToken;
};

const ROADMAP_STAGE_ORDER = [
  'stage-1',
  'stage-2',
  'stage-3',
  'stage-4',
  'stage-5',
  'stage-6',
  'stage-7',
  'stage-8',
];

const ROADMAP_STAGE_ROUTE_MAP = {
  'stage-1': 'Stage1Overview',
  'stage-2': 'Stage2EarlyDecisions',
  'stage-3': 'Stage3DreamTeam',
  'stage-4': 'Stage4GuestsInvitations',
  'stage-5': 'Stage5Style',
  'stage-6': 'Stage6FinalDetails',
  'stage-7': 'Stage7WeddingWeek',
  'stage-8': 'Stage8WrapUp',
};

const getContinuePlanTarget = (roadmapFocus) => {
  if (!roadmapFocus?.stageId) return null;
  const stageRoute = ROADMAP_STAGE_ROUTE_MAP[roadmapFocus.stageId] || 'WeddingRoadmap';
  const params =
    stageRoute === 'WeddingRoadmap'
      ? { state: 'progress' }
      : { autoStart: true, focusItemId: roadmapFocus.itemId };

  return {
    stageId: roadmapFocus.stageId,
    itemId: roadmapFocus.itemId,
    label: roadmapFocus.label,
    routeName: stageRoute,
    params,
  };
};

const getRoadmapNextFocusInStages = (checklistState, stageIds) => {
  for (const stageId of stageIds) {
    const items = getChecklistItems(stageId);
    if (items.length === 0) continue;
    const stageMap = checklistState?.[stageId] ?? {};
    const nextItem = items.find((item) => !stageMap[item.id]);
    if (nextItem) {
      const routeName = ROADMAP_STAGE_ROUTE_MAP[stageId] || 'WeddingRoadmap';
      return {
        stageId,
        itemId: nextItem.id,
        label: nextItem.label,
        routeName,
        params: routeName === 'WeddingRoadmap' ? { state: 'progress' } : { focusItemId: nextItem.id },
      };
    }
  }
  return null;
};

const getRoadmapNextFocus = (checklistState) =>
  getRoadmapNextFocusInStages(checklistState, ROADMAP_STAGE_ORDER);

const getRoadmapNextFocusByTiming = ({ checklistState, weddingDayState, daysUntilWedding }) => {
  if (weddingDayState === 'after') {
    return getRoadmapNextFocusInStages(checklistState, ['stage-8']) || getRoadmapNextFocus(checklistState);
  }

  if (typeof daysUntilWedding === 'number') {
    if (daysUntilWedding <= 14) {
      return (
        getRoadmapNextFocusInStages(checklistState, ['stage-7', 'stage-6', 'stage-4', 'stage-3']) ||
        getRoadmapNextFocus(checklistState)
      );
    }
    if (daysUntilWedding <= 45) {
      return (
        getRoadmapNextFocusInStages(checklistState, ['stage-6', 'stage-4', 'stage-5', 'stage-3', 'stage-2']) ||
        getRoadmapNextFocus(checklistState)
      );
    }
    if (daysUntilWedding <= 120) {
      return (
        getRoadmapNextFocusInStages(checklistState, ['stage-4', 'stage-3', 'stage-5', 'stage-2', 'stage-1']) ||
        getRoadmapNextFocus(checklistState)
      );
    }
  }

  return getRoadmapNextFocus(checklistState);
};

const getPhaseSubtitle = ({ overallProgress, weddingDayState, daysUntilWedding }) => {
  if (weddingDayState === 'today') return 'Today is for presence, not pressure.';
  if (weddingDayState === 'after') return 'Wrap-up, gently — only what feels right.';
  if (typeof daysUntilWedding === 'number' && daysUntilWedding <= 14) {
    return 'Final stretch. Reduce, don’t add.';
  }
  if (overallProgress >= 80) return 'You’re nearly done.';
  if (overallProgress >= 40) return 'Momentum phase. Keep it simple.';
  return 'Foundation phase. Big decisions, slow pace.';
};

const clamp01 = (value) => Math.min(1, Math.max(0, Number(value) || 0));

const pickTodayStep = ({
  weddingDayState,
  daysUntilWedding,
  overallProgress,
  hasBudget,
  pendingRsvps,
  guestCount,
  guestCap,
  roadmapFocus,
  rsvpReminderLine,
}) => {
  if (daysUntilWedding === null && weddingDayState === 'unknown') {
    return {
      id: 'date',
      title: 'Add your wedding date',
      subtitle: 'So we can tailor timing and next steps.',
      ctaLabel: 'Add Date',
      type: 'date',
      badgeIcon: '📅',
      routeName: 'Account',
      params: undefined,
      metaLines: [],
    };
  }

  if (!hasBudget) {
    return {
      ...DEFAULT_TODAY_STEP,
      metaLines: [],
    };
  }

  if (pendingRsvps > 0 && roadmapFocus?.stageId === 'stage-4') {
    const followUps = Math.min(2, pendingRsvps);
    const pendingLine = pendingRsvps === 1 ? '1 unconfirmed' : `${pendingRsvps} unconfirmed`;
    const reminderLine = rsvpReminderLine || 'No reminder logged yet';
    const metaLines = [pendingLine, reminderLine];
    return {
      id: 'guest',
      title: `Send a gentle reminder to ${followUps} ${followUps === 1 ? 'guest' : 'guests'}`,
      subtitle: 'Doing this now makes seating plans easier later.',
      ctaLabel: 'Open Guest List',
      type: 'guest',
      badgeIcon: '👥',
      routeName: 'Guest Nest',
      params: { screen: 'GuestList' },
      metaLines,
    };
  }

  if (roadmapFocus?.label) {
    const stageNumber = Number(String(roadmapFocus?.stageId || '').replace('stage-', ''));
    const subtitle = Number.isFinite(stageNumber)
      ? `Stage ${stageNumber} · Next recommended step`
      : 'Next recommended step';
    return {
      id: 'roadmap',
      title: roadmapFocus.label,
      subtitle,
      ctaLabel: 'Open Next Step',
      type: 'roadmap',
      badgeIcon: '🗺️',
      routeName: roadmapFocus.routeName || 'WeddingRoadmap',
      params: roadmapFocus.params || { state: 'progress' },
      metaLines: [],
    };
  }

  return {
    id: 'steady',
    title: 'Nothing urgent today',
    subtitle: 'If you want a gentle nudge, ask Ivy what to do next.',
    ctaLabel: 'Ask Ivy',
    type: 'roadmap',
    badgeIcon: '🌿',
    routeName: 'AskIvy',
    params: undefined,
    metaLines: [],
  };
};

const quickTools = [
  {
    id: 'vendor',
    title: 'Vendors',
    subtitle: 'A few great matches waiting',
    icon: 'storefront-outline',
    routeName: 'WeddingHub',
    params: undefined,
  },
  {
    id: 'budget',
    title: 'Budget Buddy',
    subtitle: 'All on track — beautifully handled ♡',
    icon: 'wallet-outline',
    routeName: 'Budget Buddy',
    params: undefined,
  },
  {
    id: 'guests',
    title: 'Guest Nest',
    subtitle: 'See who’s coming',
    icon: 'people-outline',
    routeName: 'Guest Nest',
    params: { screen: 'GuestList' },
  },
  {
    id: 'notes',
    title: 'Notes',
    subtitle: 'Ready when you are',
    icon: 'document-text-outline',
    routeName: 'WeddingHub',
    params: undefined,
  },
];

const ICON_ACCENT_COLOR = '#FF9B85';

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

const getSeasonLabel = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  const month = date.getMonth(); // 0-based
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [now, setNow] = useState(Date.now());
  const [dailyQuote, setDailyQuote] = useState(QUOTES[0]);
  const [firstName, setFirstName] = useState('');
  const [todayStep, setTodayStep] = useState(DEFAULT_TODAY_STEP);
  const [inertiaNudges, setInertiaNudges] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [continuePlanTarget, setContinuePlanTarget] = useState(null);
  const [planStats, setPlanStats] = useState({ budgetPct: 0, guestsPct: 0, vendorsPct: 0 });
  const [guestConfirmedThisWeek, setGuestConfirmedThisWeek] = useState(0);
  const [recentWinNote, setRecentWinNote] = useState(null);
  const [welcomeBackPrompt, setWelcomeBackPrompt] = useState(null);
  const [quickToolSignals, setQuickToolSignals] = useState({
    focusStageId: null,
    vendorsBooked: false,
    hasBudget: false,
    pendingRsvps: 0,
    guestCap: null,
  });
  const [wellnessSignals, setWellnessSignals] = useState({
    needsBoost: false,
    progressTight: false,
  });
  const [profile, setProfile] = useState({
    firstName: '',
    partnerName: '',
    weddingDate: '',
    weddingLocation: '',
    weddingType: '',
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
        const [first, partner, wedding, weddingLocation, weddingType] = await Promise.all([
          AsyncStorage.getItem(FIRST_NAME_KEY),
          AsyncStorage.getItem(PARTNER_NAME_KEY),
          AsyncStorage.getItem(WEDDING_DATE_KEY),
          AsyncStorage.getItem(WEDDING_LOCATION_KEY),
          AsyncStorage.getItem(WEDDING_TYPE_KEY),
        ]);
        if (mounted) {
          const trimmedFirst = (first ?? '').trim();
          const trimmedPartner = (partner ?? '').trim();
          setProfile({
            firstName: trimmedFirst,
            partnerName: trimmedPartner,
            weddingDate: wedding ?? '',
            weddingLocation: (weddingLocation ?? '').trim(),
            weddingType: (weddingType ?? '').trim(),
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

	  const hydrateTodayFocus = useCallback(() => {
	    let mounted = true;
	    const hydrate = async () => {
	      try {
	        const [
	          budgetState,
	          guestNestState,
	          checklistState,
	          completionState,
	          guestEstimateRaw,
	          lastRsvpReminderRaw,
	          storedWeddingDate,
	          lastActiveAtRaw,
	          lastTodayStepPressAtRaw,
	          lastGuestNestOpenAtRaw,
	          lastGuestNudgeShownAtRaw,
	          lastTodayNudgeShownAtRaw,
	          lastVendorNudgeShownAtRaw,
	        ] = await Promise.all([
	          loadBudgetState(),
	          loadGuestNest(),
	          loadChecklistState(),
	          loadCompletionState(),
	          AsyncStorage.getItem(GUEST_ESTIMATE_KEY),
	          AsyncStorage.getItem(HOME_LAST_RSVP_REMINDER_AT_KEY),
	          AsyncStorage.getItem(WEDDING_DATE_KEY),
	          AsyncStorage.getItem(HOME_LAST_ACTIVE_AT_KEY),
	          AsyncStorage.getItem(HOME_LAST_TODAY_STEP_PRESS_AT_KEY),
	          AsyncStorage.getItem(GUEST_NEST_LAST_OPEN_AT_KEY),
	          AsyncStorage.getItem(HOME_NUDGE_LAST_SHOWN_GUEST_KEY),
	          AsyncStorage.getItem(HOME_NUDGE_LAST_SHOWN_TODAY_KEY),
	          AsyncStorage.getItem(HOME_NUDGE_LAST_SHOWN_VENDOR_KEY),
	        ]);

        const totalBudget = Number(budgetState?.totalBudget);
        const hasBudget = Number.isFinite(totalBudget) && totalBudget > 0;

        const categories = Array.isArray(budgetState?.categories) ? budgetState.categories : [];
        const allocations =
          budgetState?.allocations && typeof budgetState.allocations === 'object'
            ? budgetState.allocations
            : {};

        const visibleCategories = categories.filter((category) => category?.createdManually);
        const totalCategoryCount = visibleCategories.length;
        const allocatedCategoryCount = visibleCategories.filter(
          (category) => Number(allocations?.[category.id] || 0) > 0,
        ).length;
        const budgetPct = totalCategoryCount > 0 ? allocatedCategoryCount / totalCategoryCount : 0;

        const quotes = Array.isArray(budgetState?.quotes) ? budgetState.quotes : [];
        const bookedQuotes = quotes.filter((quote) => quote.status === 'booked');

        const categoryLabelById = categories.reduce((acc, cat) => {
          if (cat?.id) acc[cat.id] = cat.label || '';
          return acc;
        }, {});

        const coreBooked = new Set();
        bookedQuotes.forEach((quote) => {
          const text = `${quote?.categoryId || ''} ${
            categoryLabelById[quote?.categoryId] || ''
          }`.toLowerCase();
          if (text.includes('venue')) coreBooked.add('venue');
          if (text.includes('photo')) coreBooked.add('photography');
          if (text.includes('cater') || text.includes('food')) coreBooked.add('catering');
          if (
            text.includes('music') ||
            text.includes('dj') ||
            text.includes('band') ||
            text.includes('entertain')
          ) {
            coreBooked.add('music');
          }
        });
        const CORE_VENDOR_RECOMMENDED_TOTAL = 4;
        const vendorsPct =
          CORE_VENDOR_RECOMMENDED_TOTAL > 0
            ? coreBooked.size / CORE_VENDOR_RECOMMENDED_TOTAL
            : 0;

        const guests = Array.isArray(guestNestState?.guests) ? guestNestState.guests : [];
        const guestCount = guests.length;
        const pendingRsvps = guests.filter((guest) => guest.rsvpStatus === 'Pending').length;
        const confirmedThisWeekCount = guests.filter((guest) => {
          if (guest?.rsvpStatus !== 'Yes') return false;
          const updatedAt = Number(guest?.updatedAt);
          if (!Number.isFinite(updatedAt) || updatedAt <= 0) return false;
          return Date.now() - updatedAt <= 7 * DAY_MS;
        }).length;

        const overallProgress = computeOverallProgress(checklistState || {});
        const nextRoadmapFocus = getRoadmapNextFocus(checklistState || {});

        const guestCap = parseGuestCap(guestEstimateRaw);
        const hasGuestCap = Number.isFinite(guestCap) && guestCap > 0;
        const guestDenom = hasGuestCap ? guestCap : guestCount;
        const contactCapturedCount = guests.filter((g) =>
          Boolean(g.email || g.phone || g.address),
        ).length;
        const guestsPct = guestDenom > 0 ? contactCapturedCount / guestDenom : 0;
        const lastRsvpReminderAt = Number(lastRsvpReminderRaw);
        const rsvpReminderLine = Number.isFinite(lastRsvpReminderAt) && lastRsvpReminderAt > 0
          ? formatDaysSince(Date.now() - lastRsvpReminderAt)
          : null;

        const parsedWeddingDate = parseStoredWeddingDate(storedWeddingDate || '');
        const weddingDayState = (() => {
          if (!parsedWeddingDate) return 'unknown';
          const target = new Date(parsedWeddingDate);
          target.setHours(0, 0, 0, 0);
          const dayEnd = new Date(target);
          dayEnd.setHours(23, 59, 59, 999);
          const nowMs = Date.now();
          if (nowMs < target.getTime()) return 'before';
          if (nowMs > dayEnd.getTime()) return 'after';
          return 'today';
        })();
        const daysUntilWedding = (() => {
          if (!parsedWeddingDate) return null;
          const target = new Date(parsedWeddingDate);
          target.setHours(0, 0, 0, 0);
          const diffMs = Math.max(0, target.getTime() - Date.now());
          return Math.floor(diffMs / DAY_MS);
        })();

	        const timedRoadmapFocus = getRoadmapNextFocusByTiming({
	          checklistState: checklistState || {},
	          weddingDayState,
	          daysUntilWedding,
	        });

        const step = pickTodayStep({
          weddingDayState,
          daysUntilWedding,
          overallProgress,
          hasBudget,
          pendingRsvps,
          guestCount,
          guestCap: hasGuestCap ? guestCap : null,
          roadmapFocus: timedRoadmapFocus,
          rsvpReminderLine,
        });

		        if (mounted) {
		          const buildRecentWinNote = () => {
		            const state = completionState && typeof completionState === 'object' ? completionState : {};
		            let best = null;
		            Object.keys(state).forEach((stageId) => {
		              const stageMap = state[stageId];
		              if (!stageMap || typeof stageMap !== 'object') return;
		              Object.keys(stageMap).forEach((itemId) => {
		                const at = Number(stageMap[itemId]);
		                if (!Number.isFinite(at) || at <= 0) return;
		                if (!best || at > best.at) best = { stageId, itemId, at };
		              });
		            });
		            if (!best) return null;

		            const ageMs = Date.now() - best.at;
		            const maxAgeMs = 48 * 60 * 60 * 1000;
		            if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > maxAgeMs) return null;

		            const items = getChecklistItems(best.stageId);
		            const label = items.find((i) => i?.id === best.itemId)?.label;

		            const yesterdayMs = 24 * 60 * 60 * 1000;
		            const base =
		              ageMs < 6 * 60 * 60 * 1000
		                ? 'Done earlier — amazing.'
		                : ageMs < yesterdayMs && isSameLocalDay(best.at, Date.now())
		                  ? 'You sorted this today 🤍'
		                  : 'You sorted this yesterday 🤍';

		            const withLabel = label ? `${base} “${label}”` : base;
		            return `${withLabel} Shall we line up the next lovely win?`;
		          };

		          const lastActiveAt = Number(lastActiveAtRaw);
		          const daysSinceActive = getDaysSince(lastActiveAt);
		          const needsBoost = typeof daysSinceActive === 'number' && daysSinceActive >= 7;
		          const progressTight = isProgressTightForTimeline({
		            weddingDayState,
		            daysUntilWedding,
		            overallProgress,
		          });
	          const lastTodayStepPressAt = Number(lastTodayStepPressAtRaw);
	          const todayStepPressedToday = isSameLocalDay(lastTodayStepPressAt, Date.now());
	          const daysSinceTodayStepPress = getDaysSince(lastTodayStepPressAt);
	          const lastGuestNestOpenAt = Number(lastGuestNestOpenAtRaw);
	          const daysSinceGuestNest = getDaysSince(lastGuestNestOpenAt);
	          const lastGuestNudgeShownAt = Number(lastGuestNudgeShownAtRaw);
	          const lastTodayNudgeShownAt = Number(lastTodayNudgeShownAtRaw);
	          const lastVendorNudgeShownAt = Number(lastVendorNudgeShownAtRaw);

	          const nextWelcomeBackPrompt = (() => {
	            const returning =
	              (typeof daysSinceActive === 'number' && daysSinceActive >= 1) ||
	              (Number.isFinite(lastActiveAt) && Date.now() - lastActiveAt >= 6 * 60 * 60 * 1000);
	            if (!returning) return null;

	            const startedRecently =
	              (typeof daysSinceTodayStepPress === 'number' && daysSinceTodayStepPress <= 7) ||
	              (typeof daysSinceGuestNest === 'number' && daysSinceGuestNest <= 7);
	            if (!startedRecently) return null;

	            if (step?.id === 'steady') return null;
	            return 'Welcome back — ready to continue?';
	          })();

	          const nudges = [];
	          const vendorWrapComplete = Boolean(checklistState?.['stage-8']?.['vendor-wrap']);
	          if (
	            weddingDayState === 'after' &&
	            !vendorWrapComplete &&
	            !isSameLocalDay(lastVendorNudgeShownAt, Date.now())
	          ) {
	            nudges.push({
	              id: 'vendor-feedback',
	              type: 'vendor',
	              message: '1 vendor feedback request pending.',
	              ctaLabel: 'Wrap up vendors',
	              routeName: 'Stage8VendorWrap',
	              params: undefined,
	              suggested: true,
	              accessibilityLabel: 'Open vendor wrap-up',
	            });
	          }

	          if (
	            typeof daysSinceGuestNest === 'number' &&
	            daysSinceGuestNest >= 3 &&
	            (pendingRsvps > 0 || timedRoadmapFocus?.stageId === 'stage-4')
	            && !isSameLocalDay(lastGuestNudgeShownAt, Date.now())
	          ) {
	            nudges.push({
	              id: 'guest-inertia',
	              type: 'guest',
	              message: `It’s been ${daysSinceGuestNest} days — want to revisit your guest list?`,
	              ctaLabel: 'Open Guest List',
	              routeName: 'Guest Nest',
	              params: { screen: 'GuestList' },
	              suggested: true,
	              accessibilityLabel: 'Open Guest Nest guest list',
	            });
	          }

	          if (
	            typeof daysSinceActive === 'number' &&
	            daysSinceActive >= 1 &&
	            !todayStepPressedToday &&
	            !isSameLocalDay(lastTodayNudgeShownAt, Date.now())
	          ) {
	            nudges.push({
	              id: 'today-step',
	              type: 'today',
	              message: 'Today’s Focus is ready.',
	              ctaLabel: 'Open today’s focus',
	              routeName: step?.routeName,
	              params: step?.params,
	              suggested: false,
	              accessibilityLabel: 'Open today’s focus',
	            });
	          }

	          const continuityLine = (() => {
	            if (!step) return null;
	            if (step.id === 'guest' && pendingRsvps > 0) {
	              const pendingGuest = guests.find(
	                (g) => g?.rsvpStatus === 'Pending' && typeof g?.fullName === 'string' && g.fullName.trim().length > 0,
	              );
	              const name = getFirstName(pendingGuest?.fullName);
	              if (name) return `${name} hasn’t replied — a gentle nudge should do it.`;
	              return 'Still waiting on a reply — a gentle nudge should do it.';
	            }

	            const daysSinceTodayPress = getDaysSince(lastTodayStepPressAt);
	            if (daysSinceTodayPress === 1 && step.id !== 'steady') {
	              return 'You started this yesterday — let’s finish it.';
	            }
	            if (daysSinceTodayPress === 2 && step.id !== 'steady') {
	              return 'You started this two days ago — want to pick it back up?';
	            }
	            return null;
	          })();

		          const nextNudges = nudges.filter((n) => n?.routeName).slice(0, 3);

		          setRoadmapProgress(overallProgress);
		          setContinuePlanTarget(getContinuePlanTarget(nextRoadmapFocus));
		          setTodayStep({ ...step, continuityLine });
		          setRecentWinNote(buildRecentWinNote());
		          setWelcomeBackPrompt(nextWelcomeBackPrompt);
		          setInertiaNudges(nextNudges);
		          setPlanStats({
		            budgetPct: clamp01(budgetPct),
		            guestsPct: clamp01(guestsPct),
		            vendorsPct: clamp01(vendorsPct),
		          });
              setGuestConfirmedThisWeek(confirmedThisWeekCount);
		          setQuickToolSignals({
		            focusStageId: timedRoadmapFocus?.stageId ?? nextRoadmapFocus?.stageId ?? null,
		            vendorsBooked: bookedQuotes.length > 0,
		            hasBudget,
		            pendingRsvps,
                guestCap: hasGuestCap ? guestCap : null,
		          });
		          setWellnessSignals({
		            needsBoost,
		            progressTight,
		          });
		
		          const shownKeys = [];
		          const nowValue = String(Date.now());
		          nextNudges.forEach((nudge) => {
		            if (nudge.id === 'guest-inertia') shownKeys.push([HOME_NUDGE_LAST_SHOWN_GUEST_KEY, nowValue]);
		            if (nudge.id === 'today-step') shownKeys.push([HOME_NUDGE_LAST_SHOWN_TODAY_KEY, nowValue]);
		            if (nudge.id === 'vendor-feedback') shownKeys.push([HOME_NUDGE_LAST_SHOWN_VENDOR_KEY, nowValue]);
		          });
		          if (shownKeys.length > 0) {
		            try {
		              await AsyncStorage.multiSet(shownKeys);
		            } catch (error) {
		              console.warn('[Home] unable to store nudge shown timestamps', error);
		            }
		          }
		        }

		        try {
		          await AsyncStorage.setItem(HOME_LAST_ACTIVE_AT_KEY, String(Date.now()));
		        } catch (error) {
		          console.warn('[Home] unable to store last active timestamp', error);
	        }
	      } catch (error) {
	        console.warn('Unable to load today focus', error);
	      }
	    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(hydrateTodayFocus);

  const firstNameValue = firstName?.trim() ?? '';
  const partnerNameValue = profile.partnerName?.trim() ?? '';
  const hasFirstName = firstNameValue.length > 0;
  const hasPartnerName = partnerNameValue.length > 0;
  const coupleName = hasFirstName && hasPartnerName
    ? `${firstNameValue} & ${partnerNameValue}`
    : hasFirstName
      ? firstNameValue
      : 'Your wedding plan';

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

  const todayPhaseLine = useMemo(() => {
    const daysRemaining = countdownBreakdown?.days;
    const phaseName = (() => {
      if (weddingDayState === 'after') return 'Wrap-Up Phase';
      if (weddingDayState === 'today') return 'Protection Phase';
      if (typeof daysRemaining === 'number' && daysRemaining <= 14) return 'Protection Phase';
      if (roadmapProgress >= 67) return 'Protection Phase';
      if (roadmapProgress >= 34) return 'Momentum Phase';
      return 'Foundation Phase';
    })();
    return `You’re in the ${phaseName}`;
  }, [countdownBreakdown, roadmapProgress, weddingDayState]);

  const dashboardPhaseLabel = useMemo(() => {
    const stripped = String(todayPhaseLine || '')
      .replace(/^You’re in the\s+/i, '')
      .trim();
    if (!stripped) return null;
    return stripped.replace(/\bPhase\b/i, 'phase');
  }, [todayPhaseLine]);

  const recommendedVendors = useMemo(
    () => getRecommendedVendors(profile.weddingLocation, profile.weddingType),
    [profile.weddingLocation, profile.weddingType],
  );

  const vendorSpotlightSubtitle = useMemo(() => {
    const month = parsedWeddingDate
      ? parsedWeddingDate.toLocaleString('en-US', { month: 'long' })
      : null;
    const cap = Number(quickToolSignals?.guestCap);
    const capLabel = Number.isFinite(cap) && cap > 0 ? `${Math.round(cap)}+ guests` : null;

    if (month && capLabel) {
      return `For ${month} celebrations with ${capLabel} — these are our top picks`;
    }
    if (month) {
      return `For ${month} celebrations — these are our top picks`;
    }
    return 'Curated for your wedding — let’s find the right fit';
  }, [parsedWeddingDate, quickToolSignals?.guestCap]);

  const suggestedQuickToolId = useMemo(() => {
    if (quickToolSignals.focusStageId === 'stage-4' && quickToolSignals.pendingRsvps > 0) {
      return 'guests';
    }
    if (quickToolSignals.focusStageId === 'stage-2' && !quickToolSignals.vendorsBooked) {
      return 'vendor';
    }
    if (quickToolSignals.focusStageId === 'stage-1' && !quickToolSignals.hasBudget) {
      return 'budget';
    }
    return null;
  }, [quickToolSignals]);

  const wellnessModel = useMemo(() => {
    const stuck = wellnessSignals.needsBoost || wellnessSignals.progressTight;
    const userEmotionalState = stuck ? 'stuck' : 'steady';
    const tipOption = stuck ? 'What to say when someone’s upset' : 'Breathing exercise';
    const subtitle = wellnessSignals.needsBoost
      ? 'Welcome back — start with a tiny reset.'
      : wellnessSignals.progressTight
        ? 'If planning feels like too much, keep it tiny today.'
        : 'For when planning feels like too much.';

    return {
      userEmotionalState,
      tipOption,
      subtitle,
      suggested: stuck,
    };
  }, [wellnessSignals]);

  const handleNavigate = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
      return;
    }
    console.log('[Home] navigate ->', route);
  };

  const topDaysLine = useMemo(() => {
    if (!hasCountdownTarget) return 'Add your wedding date — we’ll keep it calm. Want to set it now?';
    if (weddingDayState === 'today') return 'Today is here — breathe and enjoy it. We’ll handle one small thing at a time.';
    if (weddingDayState === 'after') return 'You did it — take this part gently. When you’re ready, we’ll help you wrap up.';
    const daysRemaining = countdownBreakdown?.days ?? 0;
    const dayWord = daysRemaining === 1 ? 'day' : 'days';
    return `${daysRemaining} beautiful ${dayWord} to go — you’re doing wonderfully.`;
  }, [countdownBreakdown, hasCountdownTarget, weddingDayState]);

  const handleTodayFocusPress = async () => {
    const target = todayStep;
    if (!target?.routeName) return;
    try {
      await AsyncStorage.setItem(HOME_LAST_TODAY_STEP_PRESS_AT_KEY, String(Date.now()));
    } catch (error) {
      console.warn('[Home] unable to store today step press timestamp', error);
    }
    if (target?.id === 'guest') {
      try {
        await AsyncStorage.setItem(HOME_LAST_RSVP_REMINDER_AT_KEY, String(Date.now()));
      } catch (error) {
        console.warn('[Home] unable to store RSVP reminder timestamp', error);
      }
    }
    navigation?.navigate?.(target.routeName, target.params);
  };

  const handleInertiaNudgePress = (nudge) => {
    if (!nudge?.routeName) return;
    navigation?.navigate?.(nudge.routeName, nudge.params);
  };

  const handleContinuePlanPress = () => {
    if (!continuePlanTarget?.routeName) {
      navigation?.navigate?.('WeddingRoadmap', { state: 'progress' });
      return;
    }
    navigation?.navigate?.(continuePlanTarget.routeName, continuePlanTarget.params);
  };

  const handleWelcomeBackPress = () => {
    if (todayStep?.routeName && todayStep?.id !== 'steady') {
      handleTodayFocusPress();
      return;
    }
    handleContinuePlanPress();
  };

  const dashboardDaysLeftValue = useMemo(() => {
    if (!hasCountdownTarget) return 'Add';
    if (weddingDayState === 'today') return 'Today';
    if (weddingDayState === 'after') return 'Done';
    const daysRemaining = countdownBreakdown?.days ?? 0;
    return String(daysRemaining);
  }, [countdownBreakdown, hasCountdownTarget, weddingDayState]);

  const weddingSizeExpertNote = useMemo(() => {
    const cap = Number(quickToolSignals?.guestCap);
    if (Number.isFinite(cap) && cap > 0) {
      if (cap <= 60) return 'Couples planning smaller weddings often do this around now.';
      if (cap <= 120) return 'Couples planning mid-size weddings often do this around now.';
      return 'Couples planning larger weddings often do this around now.';
    }
    return 'Couples in your planning phase often do this around now.';
  }, [quickToolSignals?.guestCap]);

  const todayFootnote = useMemo(() => {
    const stepId = todayStep?.id;
    if (stepId === 'guest') {
      const season = parsedWeddingDate ? getSeasonLabel(parsedWeddingDate) : null;
      if (season) {
        return `For a ${season.toLowerCase()} wedding your size, this unlocks table plans.`;
      }
      return 'For a wedding your size, this unlocks table plans.';
    }
    if (stepId === 'budget') {
      return 'Planner note: couples who set a budget range early tend to feel calmer later. Shall we make it simple?';
    }
    if (stepId === 'date') {
      return 'Planner note: couples who choose a month or season early find everything else gets easier. Want to add yours?';
    }
    if (stepId === 'roadmap') {
      return `${weddingSizeExpertNote} This step tends to unlock a lot of clarity.`;
    }
    if (stepId === 'steady') {
      return 'Planner note: it’s normal to have quieter days. Want a gentle nudge from Ivy?';
    }
    return `${weddingSizeExpertNote} Shall we keep it simple?`;
  }, [parsedWeddingDate, todayStep?.id, weddingSizeExpertNote]);

  const vendorExpertLine = useMemo(() => {
    const weddingType = (profile?.weddingType ?? '').trim();
    if (weddingType) {
      return `Most couples planning a ${weddingType.toLowerCase()} wedding shortlist vendors around now. Want to pick two calm options?`;
    }
    return 'Most couples sort vendors around now. Want to pick two calm options?';
  }, [profile?.weddingType]);

  const todayCtaLabel = useMemo(() => {
    if (!todayStep) return 'Let’s do this';
    if (todayStep.id === 'steady') return 'Ask Ivy';
    if (todayStep.type === 'roadmap') return 'Take me there';
    return 'Let’s do this';
  }, [todayStep]);

  const welcomeHeading = useMemo(() => {
    if (welcomeBackPrompt) return welcomeBackPrompt;
    if (firstNameValue) return `Welcome back, ${firstNameValue} — ready to keep going?`;
    return 'Welcome back — ready to keep going?';
  }, [firstNameValue, welcomeBackPrompt]);

  const postHeroNote = useMemo(() => {
    if (guestConfirmedThisWeek > 0) {
      const word = guestConfirmedThisWeek === 1 ? 'guest' : 'guests';
      return `You confirmed ${guestConfirmedThisWeek} ${word} this week. One more keeps the rhythm going.`;
    }
    if (todayStep?.id === 'steady') {
      return 'Nothing urgent tonight — shall we line up one lovely win for tomorrow?';
    }
    return 'You’re doing enough today. One small step keeps the rhythm going.';
  }, [guestConfirmedThisWeek, todayStep?.id]);

  return (
    <Screen
      scroll={false}
      ivyHelp={false}
      backgroundColor={HOME_COLORS.background}
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      edges={['top', 'left', 'right']}
    >
      <LinearGradient
        colors={[HOME_COLORS.backgroundTop, HOME_COLORS.background]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarHeight + insets.bottom + 48 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topLineRow}>
            <AppText variant="bodySmall" style={styles.topLineText}>
              {topDaysLine}
            </AppText>
            <Pressable
              onPress={() => navigation?.navigate?.('Account')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="settings-outline" size={18} color="rgba(43,43,43,0.72)" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleWelcomeBackPress}
            accessibilityRole="button"
            accessibilityLabel={welcomeHeading}
            hitSlop={8}
            style={({ pressed }) => [styles.welcomeHeadingPressable, pressed && styles.pressed]}
          >
            <AppText variant="h3" style={styles.welcomeHeadingText}>
              {welcomeHeading}
            </AppText>
          </Pressable>

          <View style={styles.heroBlock}>
            <TodayStepCard
              title={todayStep.title}
              subtitle={todayStep.subtitle}
              continuityLine={todayStep.continuityLine}
              ctaLabel={todayCtaLabel}
              type={todayStep.type}
              badgeIcon={todayStep.badgeIcon}
              phaseLine={todayPhaseLine}
              metaLines={todayStep.metaLines}
              onPress={handleTodayFocusPress}
              footnote={todayFootnote}
            />

            <View style={styles.postHeroNote}>
              <View style={styles.postHeroNoteIconBadge}>
                <Ionicons name="checkmark" size={18} color="#2F6D52" />
              </View>
              <AppText variant="bodySmall" style={styles.postHeroNoteText}>
                {postHeroNote}
              </AppText>
            </View>
          </View>

          <View style={styles.sectionStack}>
            <AppText variant="labelSmall" style={styles.sectionLabel}>
              LET’S LOOK AT WHERE YOU ARE
            </AppText>

            <PlanSnapshot
              coupleName={coupleName}
              weddingDateLabel={countdownDateDisplay}
              daysLeftValue={dashboardDaysLeftValue}
              daysLeftMeta={dashboardPhaseLabel}
              roadmapValue={`${roadmapProgress}%`}
              budgetValue={`${Math.round(planStats.budgetPct * 100)}%`}
              guestsValue={`${Math.round(planStats.guestsPct * 100)}%`}
              onPressDaysLeft={() => navigation?.navigate?.('Account')}
              onPressRoadmap={() => navigation?.navigate?.('WeddingRoadmap', { state: 'progress' })}
              onPressBudget={() => navigation?.navigate?.('Budget Buddy')}
              onPressGuests={() => navigation?.navigate?.('Guest Nest', { screen: 'GuestList' })}
              onPressContinue={handleContinuePlanPress}
              continueLabel="Show me what’s next"
              statusLabel="Nothing urgent tonight — tomorrow we’ll look at table settings"
            />

            <AppText variant="bodySmall" align="center" style={styles.centerAffirmation}>
              Everything essential is in hand. Nothing to worry about.
            </AppText>
          </View>

          <View style={styles.sectionStack}>
            <AppText variant="bodySmall" style={styles.toolsIntro}>
              While you’re here, there’s a small win waiting…
            </AppText>
            <View style={styles.quickToolsGrid}>
              {quickTools.map((tool) => {
                const suggested = suggestedQuickToolId === tool.id;
                const variant = tool.id === 'budget' || tool.id === 'guests' ? 'safe' : 'neutral';
                const completed =
                  tool.id === 'budget'
                    ? planStats.budgetPct >= 0.8
                    : tool.id === 'guests'
                      ? planStats.guestsPct >= 0.6
                      : false;
                const headline =
                  tool.id === 'budget'
                    ? completed
                      ? 'All on track — you sorted this recently ♡'
                      : 'A calm number to anchor decisions'
                    : tool.id === 'guests'
                      ? guestConfirmedThisWeek > 0
                        ? `${guestConfirmedThisWeek} new replies — already coming along ♡`
                        : tool.subtitle
                      : tool.subtitle;

                const iconColor = variant === 'safe' ? HOME_COLORS.green : HOME_COLORS.coral;
                const icon = tool.id === 'budget' ? (
                  <BudgetJarIcon size={22} color={iconColor} />
                ) : (
                  <Ionicons name={tool.icon} size={22} color={iconColor} />
                );
                return (
                  <QuickToolPill
                    key={tool.id}
                    headline={headline}
                    title={tool.title}
                    icon={icon}
                    suggested={suggested}
                    variant={variant}
                    completed={completed}
                    onPress={() => navigation?.navigate?.(tool.routeName, tool.params)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.sectionStack}>
            <VendorCarousel
              vendors={recommendedVendors}
              subtitle={vendorSpotlightSubtitle}
              weddingType={profile.weddingType}
              location={profile.weddingLocation}
              onPressVendor={() => navigation?.navigate?.('WeddingHub')}
              onViewAll={() => navigation?.navigate?.('WeddingHub')}
              style={styles.vendorSection}
            />

            <AppText variant="bodySmall" align="center" style={styles.vendorFootnote}>
              {vendorExpertLine}
            </AppText>
          </View>

          <View style={styles.sectionStack}>
            <AppText variant="labelSmall" style={styles.wellbeingLabel}>
              AND WHENEVER YOU NEED A MOMENT…
            </AppText>
            <WellnessPanel
              subtitle={wellnessModel.subtitle}
              resetOption="2-minute reset"
              tipOption={wellnessModel.tipOption}
              suggested={wellnessModel.suggested}
              extraOption="Journal a thought"
              onPressReset={() => navigation?.navigate?.('CalmBreathing')}
              onPressTip={() =>
                navigation?.navigate?.(
                  wellnessModel.userEmotionalState === 'stuck' ? 'CalmScripts' : 'CalmBreathing',
                )
              }
              onPressExtra={() => navigation?.navigate?.('CalmCorner')}
              onExplore={() => navigation?.navigate?.('CalmCorner')}
            />

            <AppText variant="bodySmall" align="center" style={styles.footerLine}>
              I’ll have your next step ready in the morning.
            </AppText>
          </View>
        </ScrollView>

        <IvyHelpFab
          insetRight={18}
          insetBottom={tabBarHeight + insets.bottom + 18}
          style={styles.ivyFab}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  screenContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 28,
  },
  ivyFab: {
    zIndex: 999,
    elevation: 20,
  },
  sectionStack: {
    width: '100%',
    gap: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  topLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  topLineText: {
    flex: 1,
    minWidth: 0,
    color: HOME_COLORS.textBody,
    fontFamily: 'Outfit_400Regular',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  welcomeHeadingPressable: {
    width: '100%',
  },
  welcomeHeadingText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    color: '#6F6A63',
  },
  heroBlock: {
    width: '100%',
  },
  postHeroNote: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E6F3EC',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(120,170,145,0.25)',
  },
  postHeroNoteIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D7EEE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postHeroNoteText: {
    flex: 1,
    minWidth: 0,
    color: '#2F6D52',
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  welcomeBackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.18)',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  welcomeBackText: {
    flex: 1,
    minWidth: 0,
    fontFamily: 'Outfit_500Medium',
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#A09A92',
    fontFamily: 'Outfit_500Medium',
  },
  sectionLabelGuidance: {
    color: '#FF9B85',
  },
  sectionLabelConfidence: {
    color: '#6F8A75',
  },
  sectionLabelSpacing: {
    marginTop: 8,
  },
  centerAffirmation: {
    color: HOME_COLORS.textSoft,
    opacity: 0.92,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  toolsIntro: {
    color: HOME_COLORS.textBody,
    marginTop: 0,
  },
  expertLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,155,133,0.15)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,155,133,0.18)',
  },
  expertLineText: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    color: 'rgba(43,43,43,0.72)',
    fontFamily: 'Outfit_500Medium',
  },
  quickToolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  vendorSection: {
    marginTop: 0,
  },
  vendorFootnote: {
    color: HOME_COLORS.textSoft,
    opacity: 0.9,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  wellbeingLabel: {
    letterSpacing: 2,
    fontSize: 11,
    color: HOME_COLORS.green,
    opacity: 0.9,
    marginLeft: 0,
    marginTop: 0,
    fontFamily: 'Outfit_500Medium',
  },
  footerLine: {
    color: HOME_COLORS.textSoft,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontStyle: 'italic',
    opacity: 0.85,
    marginTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
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
    backgroundColor: HOME_COLORS.background,
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
    backgroundColor: 'rgba(255,155,133,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  countdownDateText: {
    marginLeft: 0,
    color: '#FF9B85',
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
    color: colors.primary,
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
  ivyHeroCard: {
    backgroundColor: 'rgba(255,155,133,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(242,143,121,0.18)',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#E8E2DB',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 16,
  },
  ivyHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ivyIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(242,143,121,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ivyHeroTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    color: '#2F2925',
  },
  ivyHeroDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 8,
  },
  ivyHeroLink: {
    fontFamily: 'Outfit_500Medium',
    color: colors.accent,
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
    color: colors.primary,
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
    fontSize: 11,
    letterSpacing: 2,
    color: '#A09A92',
    fontFamily: 'Outfit_500Medium',
  },
  quickPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickPillItem: {
    width: '48%',
    marginBottom: 16,
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
    textAlign: 'center',
    marginTop: spacing.xs,
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
    width: '100%',
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
  wellnessCardPressed: {
    opacity: 0.92,
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
  wellnessQuickRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wellnessQuickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(126,156,132,0.25)',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  wellnessQuickChipPressed: {
    opacity: 0.9,
  },
  wellnessQuickText: {
    color: '#2F2925',
    fontFamily: 'Outfit_500Medium',
  },
  wellnessLink: {
    fontWeight: '600',
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
