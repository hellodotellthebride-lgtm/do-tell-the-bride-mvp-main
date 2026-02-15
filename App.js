import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OnboardingProvider, useOnboarding } from './onboardingState';
import HomeScreen from './HomeScreen';
import WeddingRoadmapScreen from './src/screens/WeddingRoadmapScreen';
import AccountScreen from './src/screens/AccountScreen';
import Stage1OverviewScreen from './src/screens/roadmap/stage1/Stage1OverviewScreen';
import Stage2EarlyDecisionsScreen from './src/screens/roadmap/stage2/Stage2EarlyDecisionsScreen';
import Stage2GuestCountScreen from './src/screens/roadmap/stage2/Stage2GuestCountScreen';
import Stage2WeddingPartyScreen from './src/screens/roadmap/stage2/Stage2WeddingPartyScreen';
import Stage2LogisticsScreen from './src/screens/roadmap/stage2/Stage2LogisticsScreen';
import Stage2CeremonyReceptionScreen from './src/screens/roadmap/stage2/Stage2CeremonyReceptionScreen';
import Stage2BudgetLogisticsScreen from './src/screens/roadmap/stage2/Stage2BudgetLogisticsScreen';
import Stage2EarlyAdminWinsScreen from './src/screens/roadmap/stage2/Stage2EarlyAdminWinsScreen';
import Stage3DreamTeamScreen from './src/screens/roadmap/stage3/Stage3DreamTeamScreen';
import Stage3WhereToStartScreen from './src/screens/roadmap/stage3/Stage3WhereToStartScreen';
import Stage3VendorTimelineScreen from './src/screens/roadmap/stage3/Stage3VendorTimelineScreen';
import Stage3TransportPlanScreen from './src/screens/roadmap/stage3/Stage3TransportPlanScreen';
import Stage3VendorCheatSheetLibraryScreen from './src/screens/roadmap/stage3/Stage3VendorCheatSheetLibraryScreen';
import Stage3VendorCheatSheetScreen from './src/screens/roadmap/stage3/Stage3VendorCheatSheetScreen';
import Stage3MeetingPrepLibraryScreen from './src/screens/roadmap/stage3/Stage3MeetingPrepLibraryScreen';
import Stage3MeetingPrepDetailScreen from './src/screens/roadmap/stage3/Stage3MeetingPrepDetailScreen';
import Stage3LegalCeremonyScreen from './src/screens/roadmap/stage3/Stage3LegalCeremonyScreen';
import Stage3EcoFriendlyGuideScreen from './src/screens/roadmap/stage3/Stage3EcoFriendlyGuideScreen';
import Stage3DIYorHireScreen from './src/screens/roadmap/stage3/Stage3DIYorHireScreen';
import Stage4GuestsInvitationsScreen from './src/screens/roadmap/stage4/Stage4GuestsInvitationsScreen';
import Stage4PlanGuestListScreen from './src/screens/roadmap/stage4/Stage4PlanGuestListScreen';
import Stage4CollectContactsScreen from './src/screens/roadmap/stage4/Stage4CollectContactsScreen';
import Stage4CreateInvitationsScreen from './src/screens/roadmap/stage4/Stage4CreateInvitationsScreen';
import Stage4SaveTheDatesScreen from './src/screens/roadmap/stage4/Stage4SaveTheDatesScreen';
import Stage4ManageRSVPScreen from './src/screens/roadmap/stage4/Stage4ManageRSVPScreen';
import Stage4AccessibilityComfortScreen from './src/screens/roadmap/stage4/Stage4AccessibilityComfortScreen';
import Stage4KidsFamilyScreen from './src/screens/roadmap/stage4/Stage4KidsFamilyScreen';
import Stage4WeddingWebsiteScreen from './src/screens/roadmap/stage4/Stage4WeddingWebsiteScreen';
import GuideDetailScreen from './src/screens/roadmap/guides/GuideDetailScreen';
import RoadmapJourneyScreen from './src/screens/roadmap/RoadmapJourneyScreen';
import RoadmapTipScreen from './src/screens/roadmap/RoadmapTipScreen';
import RoadmapCardFlowScreen from './src/screens/roadmap/RoadmapCardFlowScreen';
import RoadmapCardDeckScreen from './src/screens/roadmap/RoadmapCardDeckScreen';
import Stage5StyleScreen from './src/screens/roadmap/stage5/Stage5StyleScreen';
import Stage5WeddingDressScreen from './src/screens/roadmap/stage5/Stage5WeddingDressScreen';
import Stage5BridesmaidPlannerScreen from './src/screens/roadmap/stage5/Stage5BridesmaidPlannerScreen';
import Stage5GroomStyleScreen from './src/screens/roadmap/stage5/Stage5GroomStyleScreen';
import Stage5SustainableFashionScreen from './src/screens/roadmap/stage5/Stage5SustainableFashionScreen';
import Stage5StagHenScreen from './src/screens/roadmap/stage5/Stage5StagHenScreen';
import Stage5PhotoVideoScreen from './src/screens/roadmap/stage5/Stage5PhotoVideoScreen';
import Stage5CulturalTraditionsScreen from './src/screens/roadmap/stage5/Stage5CulturalTraditionsScreen';
import Stage6FinalDetailsScreen from './src/screens/roadmap/stage6/Stage6FinalDetailsScreen';
import Stage6FinalInvitationsScreen from './src/screens/roadmap/stage6/Stage6FinalInvitationsScreen';
import Stage6SeatingPlanScreen from './src/screens/roadmap/stage6/Stage6SeatingPlanScreen';
import Stage6RingsJewelleryScreen from './src/screens/roadmap/stage6/Stage6RingsJewelleryScreen';
import Stage6PreCeremonyScreen from './src/screens/roadmap/stage6/Stage6PreCeremonyScreen';
import Stage6ToastsVowsScreen from './src/screens/roadmap/stage6/Stage6ToastsVowsScreen';
import Stage6FavoursGiftsScreen from './src/screens/roadmap/stage6/Stage6FavoursGiftsScreen';
import Stage6MusicPlanScreen from './src/screens/roadmap/stage6/Stage6MusicPlanScreen';
import Stage6SpeechesScreen from './src/screens/roadmap/stage6/Stage6SpeechesScreen';
import Stage6DecorPlanScreen from './src/screens/roadmap/stage6/Stage6DecorPlanScreen';
import Stage7WeddingWeekScreen from './src/screens/roadmap/stage7/Stage7WeddingWeekScreen';
import Stage7FinalWeekChecklistScreen from './src/screens/roadmap/stage7/Stage7FinalWeekChecklistScreen';
import Stage7MorningPrepScreen from './src/screens/roadmap/stage7/Stage7MorningPrepScreen';
import Stage7RainPlanScreen from './src/screens/roadmap/stage7/Stage7RainPlanScreen';
import Stage7LettersMomentsScreen from './src/screens/roadmap/stage7/Stage7LettersMomentsScreen';
import Stage7MorningBoundariesScreen from './src/screens/roadmap/stage7/Stage7MorningBoundariesScreen';
import Stage7DelegationScreen from './src/screens/roadmap/stage7/Stage7DelegationScreen';
import Stage7TimelineCardsScreen from './src/screens/roadmap/stage7/Stage7TimelineCardsScreen';
import Stage7HoneymoonPrepScreen from './src/screens/roadmap/stage7/Stage7HoneymoonPrepScreen';
import Stage8WrapUpScreen from './src/screens/roadmap/stage8/Stage8WrapUpScreen';
import Stage8ThankYousScreen from './src/screens/roadmap/stage8/Stage8ThankYousScreen';
import Stage8GiftsMoneyScreen from './src/screens/roadmap/stage8/Stage8GiftsMoneyScreen';
import Stage8NameChangeScreen from './src/screens/roadmap/stage8/Stage8NameChangeScreen';
import Stage8MemoriesScreen from './src/screens/roadmap/stage8/Stage8MemoriesScreen';
import Stage8DecorItemsScreen from './src/screens/roadmap/stage8/Stage8DecorItemsScreen';
import Stage8VendorWrapScreen from './src/screens/roadmap/stage8/Stage8VendorWrapScreen';
import Stage8EmotionalClosureScreen from './src/screens/roadmap/stage8/Stage8EmotionalClosureScreen';
import SetYourBudgetScreen from './src/screens/roadmap/stage1/SetYourBudgetScreen';
import BudgetBufferScreen from './src/screens/roadmap/stage1/BudgetBufferScreen';
import DefineWeddingVibeScreen from './src/screens/roadmap/stage1/DefineWeddingVibeScreen';
import FirstFiveThingsScreen from './src/screens/roadmap/stage1/FirstFiveThingsScreen';
import MonthByMonthTimelineScreen from './src/screens/roadmap/stage1/MonthByMonthTimelineScreen';
import NoStressMasterChecklistScreen from './src/screens/roadmap/stage1/NoStressMasterChecklistScreen';
import CalmCornerScreen from './src/calmCorner/CalmCornerScreen';
import CalmBreathingScreen from './src/calmCorner/CalmBreathingScreen';
import CalmMeditationsScreen from './src/calmCorner/CalmMeditationsScreen';
import CalmScriptsScreen from './src/calmCorner/CalmScriptsScreen';
import CalmSleepScreen from './src/calmCorner/CalmSleepScreen';
import AskIvyScreen from './src/askIvy/AskIvyScreen';
import IvyHelpFab from './src/components/ui/IvyHelpFab';
import {
  ONBOARDING_CONCERNS,
  getConcernLabel,
  getRecommendation,
} from './onboardingConcerns';
import { trackEvent } from './analytics';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeProvider, colors, navigationTheme } from './src/theme';

const Tab = createBottomTabNavigator();
const BudgetBuddyStack = createNativeStackNavigator();
const TAB_ACTIVE_COLOR = colors.primary;
const TAB_INACTIVE_COLOR = colors.textSecondary;
const TAB_BAR_STYLE = {
  backgroundColor: colors.surface,
  borderTopWidth: 0,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: -4 },
  elevation: 12,
  height: 64,
  paddingBottom: 10,
  paddingTop: 6,
};
const HIDDEN_TAB_OPTIONS = {
  tabBarButton: () => null,
  tabBarItemStyle: { display: 'none' },
};

const HERO_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1551468307-8c1e3c78013c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};
const INSPIRATION_IMAGE =
  'https://images.unsplash.com/photo-1758810743752-c496cb015b25?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const STEPS = {
  INTRO: 'intro',
  BEFORE: 'before',
  ACCOUNT: 'account',
  NAME: 'name',
  DATE: 'date',
  CONCERNS: 'concerns',
  PRIMARY_FOCUS: 'primary_focus',
  START_HERE: 'start_here',
  TRIAL: 'trial',
  MODULE: 'module',
  DASHBOARD: 'dashboard',
};

const todayMidnight = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

const parseDate = (value) => {
  if (!value) {
    return null;
  }
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length !== 8) {
    return null;
  }
  const day = Number(digitsOnly.slice(0, 2));
  const month = Number(digitsOnly.slice(2, 4));
  const year = Number(digitsOnly.slice(4));
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < MIN_YEAR ||
    year > MAX_YEAR
  ) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
};

const formatDateInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  const day = digits.slice(0, 2);
  if (digits.length <= 4) {
    const month = digits.slice(2);
    return `${day}${month ? ' / ' + month : ''}`;
  }
  const month = digits.slice(2, 4);
  const year = digits.slice(4);
  return `${day} / ${month}${year ? ' / ' + year : ''}`;
};

function AppContent({ navigation, route }) {
  const { height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });
  const {
    state: onboardingState,
    actions: onboardingActions,
    hydrated: onboardingHydrated,
  } = useOnboarding();
  const [step, setStep] = useState(STEPS.INTRO);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [dateNotSet, setDateNotSet] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [editIntent, setEditIntent] = useState(null);

  useEffect(() => {
    let mounted = true;
    const hydrateProfileFields = async () => {
      try {
        const [storedFirstName, storedPartnerName] = await Promise.all([
          AsyncStorage.getItem(PROFILE_STORAGE_KEYS.firstName),
          AsyncStorage.getItem(PROFILE_STORAGE_KEYS.partnerName),
        ]);
        if (!mounted) return;
        if (storedFirstName) {
          setName(storedFirstName);
        }
        if (storedPartnerName) {
          setPartnerName(storedPartnerName);
        }
      } catch (error) {
        console.warn('Unable to hydrate profile fields', error);
      }
    };
    hydrateProfileFields();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const requestedStep = route?.params?.step;
    if (!requestedStep) {
      return;
    }
    if (requestedStep === 'firstName' || requestedStep === 'partnerName') {
      setEditIntent(requestedStep);
      setStep(STEPS.NAME);
    } else if (requestedStep === 'weddingDate') {
      setStep(STEPS.DATE);
    }
  }, [route?.params?.step]);

  const selectedConcerns = onboardingState.selectedConcerns;
  const primaryFocus = onboardingState.primaryFocus;
  const recommendation = getRecommendation(primaryFocus);

  useEffect(() => {
    if (!onboardingHydrated) return;
    if (onboardingState.completedOnboarding) {
      setStep(STEPS.DASHBOARD);
    }
  }, [onboardingHydrated, onboardingState.completedOnboarding]);

  const passwordMatch = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  );
  const exitEditMode = useCallback(() => {
    if (navigation?.setParams) {
      navigation.setParams({ step: undefined });
    }
    setEditIntent(null);
  }, [navigation]);

  const returnToDashboard = useCallback(() => {
    exitEditMode();
    setStep(STEPS.DASHBOARD);
  }, [exitEditMode]);

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    passwordMatch;

  if (!fontsLoaded || !onboardingHydrated) {
    return null;
  }

  const isEditingName = editIntent === 'firstName' || editIntent === 'partnerName';
  const nameAutoFocusField = editIntent === 'partnerName' ? 'partner' : 'name';

  const persistJourney = async (overrides = {}) => {
    const payload = {
      name,
      partnerName,
      timeline: dateNotSet ? null : weddingDate,
      selectedConcerns,
      primaryFocus,
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
    try {
      await AsyncStorage.setItem('journeyProfile', JSON.stringify(payload));
    } catch (error) {
      console.warn('Unable to save journey profile', error);
    }
  };

  const handleToggleConcern = (concernId) => {
    onboardingActions.setSelectedConcerns((prev = []) => {
      if (prev.includes(concernId)) {
        const updated = prev.filter((item) => item !== concernId);
        if (primaryFocus === concernId) {
          onboardingActions.setPrimaryFocus(null);
        }
        return updated;
      }
      return [...prev, concernId];
    });
  };

  const handleConcernsComplete = async () => {
    const total = selectedConcerns.length;
    if (total === 0) {
      return;
    }
    trackEvent('onboarding_concerns_selected', {
      count: total,
      ids: selectedConcerns,
    });
    if (total === 1) {
      const focus = selectedConcerns[0];
      onboardingActions.setPrimaryFocus(focus);
      trackEvent('onboarding_primary_focus_set', { id: focus });
      setStep(STEPS.START_HERE);
      return;
    }
    onboardingActions.setPrimaryFocus(null);
    setStep(STEPS.PRIMARY_FOCUS);
  };

  const handlePrimaryFocusComplete = (focusId) => {
    if (!focusId) {
      return;
    }
    onboardingActions.setPrimaryFocus(focusId);
    trackEvent('onboarding_primary_focus_set', { id: focusId });
    setStep(STEPS.START_HERE);
  };

  const handleTakeMeThere = async () => {
    trackEvent('start_here_take_me_there', {
      destination: recommendation.destination,
      focus: primaryFocus,
    });
    onboardingActions.setCompletedOnboarding(true);
    await persistJourney({ completedOnboarding: true });
    setActiveModule(recommendation);
    setStep(STEPS.MODULE);
  };

  const handleExploreOnMyOwn = async () => {
    trackEvent('start_here_explore_own', { focus: primaryFocus });
    onboardingActions.setCompletedOnboarding(true);
    await persistJourney({ completedOnboarding: true });
    setActiveModule(null);
    setStep(STEPS.DASHBOARD);
  };

  const handleModuleComplete = () => {
    setActiveModule(null);
    setStep(STEPS.DASHBOARD);
  };

  const handleResetOnboarding = () => {
    onboardingActions.reset();
    setActiveModule(null);
    setStep(STEPS.INTRO);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPartnerName('');
    setWeddingDate('');
    setDateNotSet(false);
  };

  const handleNameBack = () => {
    if (isEditingName) {
      returnToDashboard();
      return;
    }
    setStep(STEPS.ACCOUNT);
  };

  const handleNameNext = async () => {
    const trimmedFirst = name.trim();
    const trimmedPartner = partnerName.trim();
    setName(trimmedFirst);
    setPartnerName(trimmedPartner);
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEYS.firstName, trimmedFirst);
      if (trimmedPartner) {
        await AsyncStorage.setItem(PROFILE_STORAGE_KEYS.partnerName, trimmedPartner);
      } else {
        await AsyncStorage.removeItem(PROFILE_STORAGE_KEYS.partnerName);
      }
    } catch (error) {
      console.warn('Unable to save names', error);
    }
    await persistJourney();
    if (isEditingName) {
      returnToDashboard();
    } else {
      setStep(STEPS.DATE);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.flowShell,
          { minHeight: height - 32 },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {step === STEPS.INTRO && (
          <IntroScreen onNext={() => setStep(STEPS.BEFORE)} />
        )}
        {step === STEPS.BEFORE && (
          <BeforeWeBeginScreen
            onBack={() => setStep(STEPS.INTRO)}
            onNext={() => setStep(STEPS.ACCOUNT)}
          />
        )}
        {step === STEPS.ACCOUNT && (
          <CreateAccountScreen
            onBack={() => setStep(STEPS.BEFORE)}
            onNext={() => setStep(STEPS.NAME)}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirmPassword}
            canSubmit={canSubmit}
            passwordMatch={passwordMatch}
          />
        )}
        {step === STEPS.NAME && (
          <NameSetupScreen
            onBack={handleNameBack}
            onNext={handleNameNext}
            name={name}
            partnerName={partnerName}
            onChangeName={setName}
            onChangePartner={setPartnerName}
            autoFocusField={nameAutoFocusField}
          />
        )}
        {step === STEPS.DATE && (
          <WeddingDateScreen
            onBack={() => setStep(STEPS.NAME)}
            onNext={() => setStep(STEPS.CONCERNS)}
            weddingDate={weddingDate}
            onChangeDate={(value) => {
              const formatted = formatDateInput(value);
              setWeddingDate(formatted);
              if (formatted.trim().length > 0 && dateNotSet) {
                setDateNotSet(false);
              }
            }}
            notSet={dateNotSet}
            onToggleNotSet={() => {
              setDateNotSet((prev) => !prev);
              if (!dateNotSet) {
                setWeddingDate('');
              }
            }}
          />
        )}
        {step === STEPS.CONCERNS && (
          <StressSelectorScreen
            onBack={() => setStep(STEPS.DATE)}
            selections={selectedConcerns}
            onToggleOption={handleToggleConcern}
            onComplete={handleConcernsComplete}
          />
        )}
        {step === STEPS.PRIMARY_FOCUS && (
          <PrimaryFocusScreen
            onBack={() => setStep(STEPS.CONCERNS)}
            options={selectedConcerns}
            currentValue={primaryFocus}
            onContinue={handlePrimaryFocusComplete}
          />
        )}
        {step === STEPS.START_HERE && (
          <StartHereScreen
            onBack={() =>
              setStep(selectedConcerns.length > 1 ? STEPS.PRIMARY_FOCUS : STEPS.CONCERNS)
            }
            recommendation={recommendation}
            onPrimaryAction={handleTakeMeThere}
            onSkip={handleExploreOnMyOwn}
            selectedConcerns={selectedConcerns}
          />
        )}
        {step === STEPS.MODULE && (
          <ModuleScreen
            module={activeModule}
            onBack={() => setStep(STEPS.START_HERE)}
            onContinue={handleModuleComplete}
          />
        )}
        {step === STEPS.DASHBOARD && (
          <DashboardScreen
            onReset={handleResetOnboarding}
            navigation={navigation}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const PlaceholderScreen = ({ label }) => (
  <View style={styles.placeholderScreen}>
    <Text style={styles.placeholderText}>{label}</Text>
  </View>
);

const PROFILE_STORAGE_KEYS = {
  firstName: 'ONBOARDING_FIRST_NAME',
  partnerName: 'ONBOARDING_PARTNER_NAME',
  weddingDate: 'ONBOARDING_WEDDING_DATE',
};

const NAME_PLACEHOLDERS = {
  first: 'Tell us your name',
  partner: 'Tell us your partner’s name',
};

const DATE_PLACEHOLDER = 'Add your wedding date';

const getProfileOrdinalSuffix = (day) => {
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

const parseStoredWeddingDateValue = (value) => {
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

const formatWeddingHubDate = (date) => {
  const day = date.getDate();
  const suffix = getProfileOrdinalSuffix(day);
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${day}${suffix} ${month} ${date.getFullYear()}`;
};

const WeddingHubScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const heroTopPadding = Math.max(0, insets.top - 40);
  const quickActions = [
    { id: 'inspiration', label: 'Inspiration', icon: 'sparkles-outline' },
    { id: 'budget', label: 'Budget', icon: 'wallet-outline' },
    { id: 'guests', label: 'Guests', icon: 'people-outline' },
  ];
  const guestSummary = [
    '76 RSVPs received',
    '58 attending',
    '18 not attending',
    '36 haven’t replied',
  ];
  const [profile, setProfile] = useState({
    firstName: '',
    partnerName: '',
    weddingDate: '',
  });

  useEffect(() => {
    let mounted = true;
    const hydrateProfile = async () => {
      try {
        const [first, partner, wedding] = await Promise.all([
          AsyncStorage.getItem(PROFILE_STORAGE_KEYS.firstName),
          AsyncStorage.getItem(PROFILE_STORAGE_KEYS.partnerName),
          AsyncStorage.getItem(PROFILE_STORAGE_KEYS.weddingDate),
        ]);
        if (mounted) {
          setProfile({
            firstName: first ?? '',
            partnerName: partner ?? '',
            weddingDate: wedding ?? '',
          });
        }
      } catch (error) {
        console.warn('Unable to load onboarding profile', error);
      }
    };
    hydrateProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const firstNameValue = profile.firstName?.trim() ?? '';
  const partnerNameValue = profile.partnerName?.trim() ?? '';
  const hasFirstName = firstNameValue.length > 0;
  const hasPartnerName = partnerNameValue.length > 0;
  const displayFirstName = hasFirstName ? firstNameValue : NAME_PLACEHOLDERS.first;
  const displayPartnerName = hasPartnerName ? partnerNameValue : NAME_PLACEHOLDERS.partner;
  const parsedWeddingDate = useMemo(
    () => parseStoredWeddingDateValue(profile.weddingDate),
    [profile.weddingDate],
  );
  const weddingDateDisplay = parsedWeddingDate ? formatWeddingHubDate(parsedWeddingDate) : DATE_PLACEHOLDER;
  const countdownDays = useMemo(() => {
    if (!parsedWeddingDate) {
      return 0;
    }
    const now = new Date();
    const diffMs = Math.max(0, parsedWeddingDate.getTime() - now.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }, [parsedWeddingDate]);
  const countdownLabel =
    countdownDays > 0
      ? `${countdownDays} ${countdownDays === 1 ? 'day' : 'days'}`
      : "Today’s the day 🤍";

  return (
    <SafeAreaView style={styles.weddingHubScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.weddingHubContent,
          {
            paddingTop: heroTopPadding + 12,
            paddingBottom: Math.max(48, insets.bottom + 32),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.weddingHubHeader}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={styles.weddingHubBack}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color="#8e867e" />
          </TouchableOpacity>
          <View style={styles.weddingHubHeaderText}>
            <Text style={styles.weddingHubTitle}>Your Wedding Hub</Text>
            <Text style={styles.weddingHubSubtitle}>
              All your plans in one place
            </Text>
          </View>
        </View>

        <View style={styles.coupleCard}>
          <View style={styles.coupleNameRow}>
            <Text style={styles.coupleNames}>
              {displayFirstName} & {displayPartnerName}
            </Text>
          </View>
          <Text style={styles.coupleDate}>Wedding Day: {weddingDateDisplay}</Text>
          <Text style={styles.coupleCountdown}>{countdownLabel}</Text>
          <Text style={styles.coupleCaption}>It’s getting close…</Text>
        </View>

        <View style={styles.nextStepCard}>
          <View style={styles.nextStepIcon}>
            <Ionicons name="map-outline" size={18} color={TAB_ACTIVE_COLOR} />
          </View>
          <View style={styles.nextStepContent}>
            <View style={styles.nextStepHeader}>
              <Text style={styles.nextStepTitle}>Your Wedding Roadmap</Text>
              <TouchableOpacity activeOpacity={0.85}>
                <Text style={styles.nextStepLinkText}>Continue ›</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.nextStepSubtitle}>Ready when you are.</Text>
            <View style={styles.nextStepTrack}>
              <View style={styles.nextStepFill} />
            </View>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>At a Glance</Text>
          <View style={styles.glanceGrid}>
            <View style={[styles.glanceCard, styles.glanceCardTierOne]}>
              <Text style={styles.glanceLabel}>VENUE</Text>
              <Text style={styles.glanceValue}>Clearwell Castle</Text>
              <Text style={styles.glanceBody}>
                Ceremony & reception confirmed
              </Text>
              <View style={styles.glanceFooter}>
                <View style={[styles.statusPill, styles.statusPillSuccess]}>
                  <Text style={styles.statusPillText}>Booked</Text>
                </View>
                <Text style={styles.glanceLink}>View details →</Text>
              </View>
            </View>

            <View style={[styles.glanceCard, styles.glanceCardTierOne]}>
              <Text style={styles.glanceLabel}>THEME / COLOURS</Text>
              <Text style={styles.glanceValue}>Romantic Garden</Text>
              <Text style={[styles.glanceBody, styles.glanceBodyMuted]}>
                Blush • Champagne • Soft Sage
              </Text>
              <View style={styles.colorDots}>
                {['#F7D0CC', '#F3E5CE', '#C9DCCA'].map((color) => (
                  <View
                    key={color}
                    style={[styles.colorDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
              <Text style={[styles.glanceLink, styles.glanceLinkMuted]}>Edit vision →</Text>
            </View>

            <View style={[styles.glanceCard, styles.glanceCardTierOne, styles.glanceCardUrgent]}>
              <Text style={styles.glanceLabel}>BUDGET</Text>
              <Text style={styles.glanceValue}>
                <Text style={styles.glanceValueStrong}>£18,750</Text>
                <Text style={styles.glanceValueSecondary}> / £45,000</Text>
              </Text>
              <View style={styles.progressTrackSoft}>
                <View style={styles.progressFillSoft} />
              </View>
              <View style={styles.glanceFooter}>
                <View style={[styles.statusPill, styles.statusPillAlert, styles.statusPillBudget]}>
                  <Text style={styles.statusPillTextBudget}>Next payment due</Text>
                </View>
                <Text style={styles.glanceLink}>Open Budget Buddy →</Text>
              </View>
            </View>

            <View style={styles.glanceCard}>
              <Text style={styles.glanceLabel}>BRIDAL PARTY</Text>
              <Text style={styles.glanceValue}>6 attendants</Text>
              <Text style={[styles.glanceBody, styles.glanceBodyMuted]}>
                Mia, Isla, Theo, Noah, Ava, Jack
              </Text>
              <View style={styles.glanceFooter}>
                <View style={[styles.statusPill, styles.statusPillSuccess]}>
                  <Text style={styles.statusPillText}>All confirmed</Text>
                </View>
                <Text style={[styles.glanceLink, styles.glanceLinkSecondary]}>
                  Manage party →
                </Text>
              </View>
            </View>

            <View style={styles.glanceCard}>
              <Text style={styles.glanceLabel}>GUEST SUMMARY</Text>
              <Text style={styles.glanceValue}>112 invited</Text>
              <View style={styles.guestDivider} />
              {guestSummary.map((line, index) => (
                <View key={`${line}-${index}`} style={styles.guestLineGroup}>
                  <Text style={styles.guestLine}>{line}</Text>
                  {index !== guestSummary.length - 1 ? (
                    <View style={styles.guestLineSpacer} />
                  ) : null}
                </View>
              ))}
              <View style={styles.glanceFooter}>
                <View style={[styles.statusPill, styles.statusPillNeutral, styles.statusPillSubtle]}>
                  <Text style={styles.statusPillTextNeutral}>RSVPs open</Text>
                </View>
                <Text style={[styles.glanceLink, styles.glanceLinkSecondary]}>
                  View Guest Nest →
                </Text>
              </View>
            </View>

            <View style={styles.glanceCard}>
              <Text style={styles.glanceLabel}>NOTES</Text>
              <Text style={styles.glanceBody}>
                Save thoughts, reminders, and anything you don’t want to forget.
              </Text>
              <Text style={[styles.glanceLink, styles.glanceLinkSecondary]}>
                Open Notes →
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionBlock, styles.sectionBlockInspiration]}>
          <Text style={styles.inspirationHeading}>Inspiration Library</Text>
          <Text style={styles.sectionSubtitle}>
            Calm, curated ideas for your wedding day.
          </Text>
          <Pressable
            onPress={() => navigation?.navigate?.('InspirationStation')}
            style={styles.inspirationCard}
          >
            <ImageBackground
              source={{ uri: INSPIRATION_IMAGE }}
              style={StyleSheet.absoluteFill}
              imageStyle={styles.inspirationImage}
            >
              <View style={styles.inspirationOverlay} />
              <View style={styles.inspirationWash} />
              <View style={styles.inspirationTextBlock}>
                <Text style={styles.inspirationTitle}>Browse All Inspiration</Text>
                <Text style={styles.inspirationSubtitle}>
                  12 curated categories to explore
                </Text>
              </View>
              <View style={styles.sparkleButton}>
                <Ionicons name="sparkles-outline" size={18} color="#F3D4C8" />
              </View>
            </ImageBackground>
          </Pressable>
        </View>

        <View style={[styles.sectionBlock, styles.sectionBlockQuickActions]}>
          <Text style={styles.quickActionsHeading}>Jump Back In</Text>
          <View style={styles.quickActionRow}>
            {quickActions.map((action) => {
              const isPrimaryShortcut = action.id === 'inspiration';
              return (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.quickActionPill,
                    isPrimaryShortcut && styles.quickActionPillPrimary,
                  ]}
                >
                  <View style={styles.quickActionIconBubble}>
                    <Ionicons
                      name={action.icon}
                      size={18}
                      color={isPrimaryShortcut ? TAB_ACTIVE_COLOR : '#C3B8B0'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.quickActionText,
                      isPrimaryShortcut && styles.quickActionTextPrimary,
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <IvyHelpFab insetRight={20} insetBottom={20} />
    </SafeAreaView>
  );
};

import BudgetBuddyScreen from './src/screens/BudgetBuddyScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import PaymentScheduleScreen from './src/screens/PaymentScheduleScreen';
import AddPaymentScreen from './src/screens/AddPaymentScreen';
import PaymentDetailScreen from './src/screens/PaymentDetailScreen';
import GuestNestNavigator from './src/guestNest/GuestNestNavigator';
const GuestNestScreen = () => <GuestNestNavigator />;
const MoreScreen = () => <PlaceholderScreen label="More" />;

const BudgetBuddyNavigator = () => (
  <BudgetBuddyStack.Navigator screenOptions={{ headerShown: false }}>
    <BudgetBuddyStack.Screen name="BudgetBuddyHome" component={BudgetBuddyScreen} />
    <BudgetBuddyStack.Screen name="BudgetCategoryDetail" component={CategoryDetailScreen} />
    <BudgetBuddyStack.Screen name="PaymentSchedule" component={PaymentScheduleScreen} />
    <BudgetBuddyStack.Screen name="AddPayment" component={AddPaymentScreen} />
    <BudgetBuddyStack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
  </BudgetBuddyStack.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <ThemeProvider>
          <NavigationContainer theme={navigationTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => {
              let iconName = 'ellipse-outline';
              switch (route.name) {
                case 'Home':
                  iconName = 'home-outline';
                  break;
                case 'Budget Buddy':
                  iconName = 'logo-bitcoin';
                  break;
                case 'WeddingHub':
                  iconName = 'heart-outline';
                  break;
                case 'Guest Nest':
                  iconName = 'people-outline';
                  break;
                case 'More':
                  iconName = 'menu-outline';
                  break;
                default:
                  break;
              }
              return {
                tabBarIcon: ({ color, size }) => {
                  const adjustedSize = Math.max(size - 3, 14);
                  return <Ionicons name={iconName} size={adjustedSize} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: TAB_ACTIVE_COLOR,
                tabBarInactiveTintColor: TAB_INACTIVE_COLOR,
                tabBarStyle: TAB_BAR_STYLE,
                tabBarItemStyle: {
                  paddingHorizontal: 0,
                },
                tabBarLabelStyle: {
                  fontSize: 9,
                  fontWeight: '600',
                },
                tabBarHideOnKeyboard: true,
              };
            }}
          >
            <Tab.Screen name="Home" component={AppContent} />
            <Tab.Screen name="Budget Buddy" component={BudgetBuddyNavigator} />
            <Tab.Screen
              name="WeddingHub"
              component={WeddingHubScreen}
              options={{ tabBarLabel: 'Wedding Hub' }}
            />
            <Tab.Screen name="Guest Nest" component={GuestNestScreen} />
            <Tab.Screen name="More" component={MoreScreen} />
            <Tab.Screen
              name="WeddingRoadmap"
              component={WeddingRoadmapScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="CalmCorner"
              component={CalmCornerScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="CalmBreathing"
              component={CalmBreathingScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="CalmMeditations"
              component={CalmMeditationsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="CalmScripts"
              component={CalmScriptsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="CalmSleep"
              component={CalmSleepScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="AskIvy"
              component={AskIvyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Account"
              component={AccountScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1Overview"
              component={Stage1OverviewScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1SetYourBudget"
              component={SetYourBudgetScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1BudgetBuffer"
              component={BudgetBufferScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1DefineWeddingVibe"
              component={DefineWeddingVibeScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1FirstFiveThings"
              component={FirstFiveThingsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1Timeline"
              component={MonthByMonthTimelineScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage1NoStressMasterChecklist"
              component={NoStressMasterChecklistScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2EarlyDecisions"
              component={Stage2EarlyDecisionsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2GuestCount"
              component={Stage2GuestCountScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2WeddingParty"
              component={Stage2WeddingPartyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2Logistics"
              component={Stage2LogisticsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2CeremonySetup"
              component={Stage2CeremonyReceptionScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2BudgetLogistics"
              component={Stage2BudgetLogisticsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage2EarlyAdmin"
              component={Stage2EarlyAdminWinsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3DreamTeam"
              component={Stage3DreamTeamScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3WhereToStart"
              component={Stage3WhereToStartScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3VendorTimeline"
              component={Stage3VendorTimelineScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3TransportPlan"
              component={Stage3TransportPlanScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3VendorCheatSheets"
              component={Stage3VendorCheatSheetLibraryScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3VendorCheatSheetDetail"
              component={Stage3VendorCheatSheetScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3MeetingPrepLibrary"
              component={Stage3MeetingPrepLibraryScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3MeetingPrepDetail"
              component={Stage3MeetingPrepDetailScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3LegalCeremony"
              component={Stage3LegalCeremonyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3EcoFriendlyGuide"
              component={Stage3EcoFriendlyGuideScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage3DIYorHire"
              component={Stage3DIYorHireScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4GuestsInvitations"
              component={Stage4GuestsInvitationsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4PlanGuestList"
              component={Stage4PlanGuestListScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4CollectContacts"
              component={Stage4CollectContactsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4CreateInvitations"
              component={Stage4CreateInvitationsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4SaveTheDates"
              component={Stage4SaveTheDatesScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4ManageRSVPs"
              component={Stage4ManageRSVPScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4AccessibilityComfort"
              component={Stage4AccessibilityComfortScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4KidsFamily"
              component={Stage4KidsFamilyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage4WeddingWebsite"
              component={Stage4WeddingWebsiteScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="GuideDetail"
              component={GuideDetailScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="RoadmapJourney"
              component={RoadmapJourneyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="RoadmapTip"
              component={RoadmapTipScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="RoadmapCardDeck"
              component={RoadmapCardDeckScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="RoadmapCardFlow"
              component={RoadmapCardFlowScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5Style"
              component={Stage5StyleScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5WeddingDress"
              component={Stage5WeddingDressScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5BridesmaidPlanner"
              component={Stage5BridesmaidPlannerScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5GroomStyle"
              component={Stage5GroomStyleScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5SustainableFashion"
              component={Stage5SustainableFashionScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5StagHen"
              component={Stage5StagHenScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5PhotoVideo"
              component={Stage5PhotoVideoScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage5CulturalTraditions"
              component={Stage5CulturalTraditionsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6FinalDetails"
              component={Stage6FinalDetailsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6FinalInvitations"
              component={Stage6FinalInvitationsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6SeatingPlan"
              component={Stage6SeatingPlanScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6RingsJewellery"
              component={Stage6RingsJewelleryScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6PreCeremony"
              component={Stage6PreCeremonyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6ToastsVows"
              component={Stage6ToastsVowsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6FavoursGifts"
              component={Stage6FavoursGiftsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6MusicPlan"
              component={Stage6MusicPlanScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6Speeches"
              component={Stage6SpeechesScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage6DecorPlan"
              component={Stage6DecorPlanScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7WeddingWeek"
              component={Stage7WeddingWeekScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7FinalWeekChecklist"
              component={Stage7FinalWeekChecklistScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7MorningPrep"
              component={Stage7MorningPrepScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7RainPlan"
              component={Stage7RainPlanScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7LettersMoments"
              component={Stage7LettersMomentsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7MorningBoundaries"
              component={Stage7MorningBoundariesScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7Delegation"
              component={Stage7DelegationScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7TimelineCards"
              component={Stage7TimelineCardsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage7HoneymoonPrep"
              component={Stage7HoneymoonPrepScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8WrapUp"
              component={Stage8WrapUpScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8ThankYous"
              component={Stage8ThankYousScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8GiftsMoney"
              component={Stage8GiftsMoneyScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8NameChange"
              component={Stage8NameChangeScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8Memories"
              component={Stage8MemoriesScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8DecorItems"
              component={Stage8DecorItemsScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8VendorWrap"
              component={Stage8VendorWrapScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
            <Tab.Screen
              name="Stage8EmotionalClosure"
              component={Stage8EmotionalClosureScreen}
              options={HIDDEN_TAB_OPTIONS}
            />
          </Tab.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}

function IntroScreen({ onNext }) {
  return (
    <View style={styles.stage}>
      <View style={styles.brandWrap}>
        <Image
          source={require('./assets/hero-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandLabel}>DO TELL THE BRIDE</Text>
      </View>

      <View style={styles.introCopy}>
        <Text style={styles.heroTitle}>
          {`Calm, clear
wedding planning
- all in one place.`}
        </Text>
        <Text style={styles.subCopy}>
          {`Built to help you make confident
decisions without the overwhelm.`}
        </Text>
      </View>

      <View style={styles.heroShell}>
        <ImageBackground
          source={HERO_IMAGE}
          style={styles.heroImage}
          imageStyle={styles.heroImageRadius}
        >
          <LinearGradient
            colors={['rgba(251,246,241,1)', 'rgba(251,246,241,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.85 }}
            style={styles.heroGradient}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0.6 }}
            style={styles.heroGradientBottom}
          />
        </ImageBackground>
      </View>

      <PrimaryButton label="Get started" onPress={onNext} />
    </View>
  );
}

function BeforeWeBeginScreen({ onBack, onNext }) {
  return (
    <View style={styles.stage}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.beforeTitle}>
          {`Before we
begin...`}
        </Text>
        <Text style={styles.beforeBody}>
          {`There's no right order, no perfect
answers, and nothing you
choose here is final.`}
        </Text>
        <Text style={styles.beforeAccent}>You can change everything later.</Text>
      </View>
      <PrimaryButton label="Begin" onPress={onNext} />
    </View>
  );
}

function CreateAccountScreen({
  onBack,
  onNext,
  email,
  password,
  confirmPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmChange,
  canSubmit,
  passwordMatch,
}) {
  return (
    <View style={styles.stage}>
      <BackButton onPress={onBack} />

      <View style={styles.centerBlock}>
        <Text style={styles.createTitle}>
          {`Create your
`}
          <Text style={styles.underlineTitle}>account</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.appleButton}
        activeOpacity={0.9}
        onPress={onNext}
      >
        <Text style={styles.appleIcon}></Text>
        <Text style={styles.appleText}>Continue with Apple</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>or create an account with email</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.formStack}>
        <UnderlineInput
          label="Email"
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <UnderlineInput
          label="Password"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
        />
        <UnderlineInput
          label="Confirm password"
          value={confirmPassword}
          onChangeText={onConfirmChange}
          secureTextEntry
        />
        <Text style={styles.helperCopy}>We'll only use this to save your progress.</Text>
        {confirmPassword.length > 0 && !passwordMatch ? (
          <Text style={styles.mismatchCopy}>Passwords don’t match (annoying, but fixable).</Text>
        ) : null}
      </View>

      <PrimaryButton
        label="Create account"
        onPress={onNext}
        disabled={!canSubmit}
      />
    </View>
  );
}

/* --------------------------- Screen 4 --------------------------- */

function NameSetupScreen({
  onBack,
  onNext,
  name,
  partnerName,
  onChangeName,
  onChangePartner,
  autoFocusField = 'name',
}) {
  const nameInputRef = useRef(null);
  const partnerInputRef = useRef(null);

  useEffect(() => {
    if (autoFocusField === 'partner' && partnerInputRef.current) {
      partnerInputRef.current.focus();
    } else if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [autoFocusField]);

  const canContinue = name.trim().length > 0;
  return (
    <View style={styles.stage}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.nameTitle}>What should we call you?</Text>
        <Text style={styles.helperText}>
          So things feel a little more personal.
        </Text>
      </View>
      <View style={styles.formStack}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Name"
          placeholderTextColor="#b9b2aa"
          value={name}
          onChangeText={onChangeName}
          ref={nameInputRef}
        />
        <Text style={[styles.inputLabel, { marginTop: 18 }]}>
          Partner’s name (optional)
        </Text>
        <TextInput
          style={styles.inputField}
          placeholder="Partner’s name"
          placeholderTextColor="#b9b2aa"
          value={partnerName}
          onChangeText={onChangePartner}
          ref={partnerInputRef}
        />
      </View>
      <PrimaryButton label="Continue" onPress={onNext} disabled={!canContinue} />
    </View>
  );
}

/* --------------------------- Screen 5 --------------------------- */

function WeddingDateScreen({
  onBack,
  onNext,
  weddingDate,
  onChangeDate,
  notSet,
  onToggleNotSet,
}) {
  const digitsOnlyValue = weddingDate.replace(/\D/g, '');
  const parsedDate = parseDate(weddingDate);
  const isFuture =
    parsedDate && parsedDate.getTime() > todayMidnight().getTime();
  const hasInput = weddingDate.trim().length > 0;
  const isCompleteDate = digitsOnlyValue.length === 8;
  const invalidDate =
    !notSet && hasInput && isCompleteDate && !parsedDate;
  const isPastDate = !notSet && parsedDate && !isFuture;
  const errorMessage = invalidDate
    ? 'Enter a valid date (DD/MM/YYYY).'
    : isPastDate
      ? 'Please enter a future date.'
      : null;
  const canContinue = notSet || (parsedDate && isFuture);
  const handleDateInput = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    onChangeDate(digitsOnly);
  };
  return (
    <View style={styles.stage}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.nameTitle}>When’s the big day?</Text>
        <Text style={styles.helperText}>
          This helps us pace your planning — no rush.
        </Text>
      </View>
      <View style={styles.formStack}>
        <TextInput
          style={styles.inputField}
          placeholder="DD / MM / YYYY"
          placeholderTextColor="#b9b2aa"
          keyboardType="number-pad"
          inputMode="numeric"
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={14}
          value={weddingDate}
          onChangeText={handleDateInput}
          editable={!notSet}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            notSet && styles.secondaryButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={onToggleNotSet}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              notSet && styles.secondaryButtonTextActive,
            ]}
          >
            Not set yet
          </Text>
        </TouchableOpacity>
      </View>
      <PrimaryButton label="Next" onPress={onNext} disabled={!canContinue} />
    </View>
  );
}

/* --------------------------- Screen 6 --------------------------- */

function StressSelectorScreen({
  onBack,
  selections,
  onToggleOption,
  onComplete,
}) {
  const canContinue = selections.length > 0;
  return (
    <View style={styles.stage}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.nameTitle}>What’s been weighing on you the most?</Text>
        <Text style={styles.helperText}>
          Select anything that feels true right now.
        </Text>
      </View>
      <View style={styles.pillGrid}>
        {ONBOARDING_CONCERNS.map((option) => {
          const active = selections.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.pillGridItem, active && styles.pillActive]}
              activeOpacity={0.9}
              onPress={() => onToggleOption(option.id)}
            >
              <Text
                style={[styles.pillText, active && styles.pillTextActive]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!canContinue ? (
        <Text style={styles.helperText}>Select at least one to continue.</Text>
      ) : null}
      <PrimaryButton
        label="Next"
        onPress={onComplete}
        disabled={!canContinue}
      />
    </View>
  );
}

/* --------------------------- Screen 7 --------------------------- */

function PrimaryFocusScreen({
  onBack,
  options = [],
  currentValue,
  onContinue,
}) {
  const availableOptions = ONBOARDING_CONCERNS.filter((concern) =>
    options.includes(concern.id),
  );
  const optionsKey = options.join('|');
  const firstAvailable = availableOptions[0]?.id ?? null;
  const [selection, setSelection] = useState(
    currentValue && options.includes(currentValue)
      ? currentValue
      : firstAvailable,
  );

  useEffect(() => {
    if (currentValue && options.includes(currentValue)) {
      setSelection(currentValue);
      return;
    }
    setSelection((prev) => {
      if (prev && options.includes(prev)) {
        return prev;
      }
      return firstAvailable ?? null;
    });
  }, [currentValue, optionsKey, firstAvailable]);

  const canContinue = Boolean(selection);

  return (
    <View style={styles.stage}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.nameTitle}>Which one should we tackle first?</Text>
        <Text style={styles.helperText}>We’ll still remember the rest.</Text>
      </View>
      <View style={styles.pillGrid}>
        {availableOptions.map((option) => {
          const active = selection === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.pillGridItem, active && styles.pillActive]}
              activeOpacity={0.9}
              onPress={() => setSelection(option.id)}
            >
              <Text
                style={[styles.pillText, active && styles.pillTextActive]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <PrimaryButton
        label="Continue"
        onPress={() => onContinue(selection)}
        disabled={!canContinue}
      />
    </View>
  );
}

/* --------------------------- Screen 8 --------------------------- */

function StartHereScreen({
  onBack,
  recommendation,
  onPrimaryAction,
  onSkip,
}) {
  return (
    <View style={[styles.stage, styles.stageStretch]}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.nameTitle}>{recommendation.startHereTitle}</Text>
        <Text style={styles.helperText}>{recommendation.startHereSubtitle}</Text>
      </View>
      <View style={styles.recommendCard}>
        <Text style={styles.recommendEyebrow}>Based on what you told us</Text>
        <Text style={styles.recommendBody}>
          {recommendation.startHereCardBody}
        </Text>
      </View>
      <PrimaryButton label={recommendation.ctaLabel} onPress={onPrimaryAction} />
      <TouchableOpacity onPress={onSkip} activeOpacity={0.8}>
        <Text style={styles.secondaryLinkText}>I’ll explore on my own</Text>
      </TouchableOpacity>
    </View>
  );
}

/* --------------------------- Destinations --------------------------- */

function ModuleScreen({ module, onBack, onContinue }) {
  if (!module) {
    return null;
  }
  return (
    <View style={[styles.stage, styles.stageStretch]}>
      <BackButton onPress={onBack} />
      <View style={styles.centerBlock}>
        <Text style={styles.nameTitle}>{module.moduleName}</Text>
        <Text style={styles.helperText}>{module.description}</Text>
      </View>
      <View style={styles.moduleMeta}>
        <Text style={styles.helperCopy}>Destination: {module.destination}</Text>
      </View>
      <PrimaryButton label="Go to dashboard" onPress={onContinue} />
    </View>
  );
}

function DashboardScreen({ onReset, navigation }) {
  return <HomeScreen navigation={navigation} />;
}

function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton} activeOpacity={0.8}>
      <Text style={styles.backIcon}>‹</Text>
    </TouchableOpacity>
  );
}

function PrimaryButton({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function UnderlineInput({ label, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.underlineField}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.inputControl}
        placeholderTextColor="#b9b2aa"
      />
      <View style={styles.inputUnderline} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fbf6f1',
  },
  flowShell: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 36,
  },
  stage: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  stageStretch: {
    alignItems: 'stretch',
  },
  brandWrap: {
    alignItems: 'center',
    width: '100%',
    gap: 8,
    paddingTop: 16,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 16,
  },
  brandLabel: {
    textTransform: 'uppercase',
    letterSpacing: 6,
    fontSize: 12,
    color: '#b9b2aa',
    fontFamily: 'Outfit_500Medium',
  },
  introCopy: {
    alignItems: 'center',
    gap: 16,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
    color: '#2b2b2b',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  subCopy: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#b9b2aa',
    fontFamily: 'Outfit_400Regular',
  },
  heroShell: {
    width: '112%',
    alignSelf: 'center',
    backgroundColor: colors.muted,
    borderRadius: 42,
    padding: 8,
    shadowColor: '#e0d9d0',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 10,
    marginTop: 8,
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  heroImageRadius: {
    borderRadius: 34,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradientBottom: {
    ...StyleSheet.absoluteFillObject,
  },
  nameTitle: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#2b2b2b',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#8e867e',
    textAlign: 'center',
  },
  recommendCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: '#e0d9d0',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  recommendEyebrow: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#b9b2aa',
    fontFamily: 'Outfit_500Medium',
  },
  recommendBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4b403a',
    fontFamily: 'Outfit_400Regular',
  },
  recommendList: {
    marginTop: 4,
    gap: 6,
  },
  recommendListItem: {
    fontSize: 14,
    color: '#8e867e',
    fontFamily: 'Outfit_400Regular',
  },
  centerBlock: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 8,
  },
  beforeTitle: {
    fontSize: 44,
    lineHeight: 50,
    textAlign: 'center',
    color: '#2b2b2b',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  beforeBody: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#8e867e',
    fontFamily: 'Outfit_400Regular',
  },
  beforeAccent: {
    fontSize: 16,
    color: '#2b2b2b',
    fontFamily: 'Outfit_500Medium',
  },
  createTitle: {
    fontSize: 42,
    lineHeight: 48,
    textAlign: 'center',
    color: '#2b2b2b',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  underlineTitle: {
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(43,43,43,0.2)',
    textDecorationStyle: 'solid',
  },
  appleButton: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 16,
    backgroundColor: '#1c1b1f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1c1b1f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  appleIcon: {
    color: '#ffffff',
    fontSize: 18,
  },
  appleText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
  },
  dividerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d9d2ca',
  },
  dividerLabel: {
    fontSize: 12,
    color: '#b9b2aa',
    fontFamily: 'Outfit_400Regular',
  },
  formStack: {
    width: '100%',
    gap: 18,
    marginTop: 24,
  },
  underlineField: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#8e867e',
    marginBottom: 6,
    fontFamily: 'Outfit_500Medium',
  },
  inputField: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#efe4df',
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2d2320',
    backgroundColor: '#fff',
    fontFamily: 'Outfit_400Regular',
  },
  inputDisabled: {
    backgroundColor: '#f5eee8',
    color: '#b9b2aa',
  },
  errorText: {
    width: '100%',
    marginTop: 6,
    fontSize: 12,
    color: '#d0665f',
    fontFamily: 'Outfit_500Medium',
  },
  inputControl: {
    fontSize: 16,
    color: '#2b2b2b',
    paddingVertical: 4,
    fontFamily: 'Outfit_400Regular',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#d9d2ca',
    marginTop: 8,
  },
  helperCopy: {
    fontSize: 12,
    color: '#b9b2aa',
    fontFamily: 'Outfit_400Regular',
  },
  moduleMeta: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: colors.accentChip,
  },
  mismatchCopy: {
    fontSize: 12,
    color: 'rgba(43,43,43,0.7)',
    fontFamily: 'Outfit_400Regular',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonActive: {
    borderColor: TAB_ACTIVE_COLOR,
    backgroundColor: colors.accentChip,
  },
  secondaryButtonText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Outfit_500Medium',
  },
  secondaryButtonTextActive: {
    color: TAB_ACTIVE_COLOR,
  },
  secondaryLinkText: {
    marginTop: 16,
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Outfit_500Medium',
    textDecorationLine: 'underline',
  },
  pillColumn: {
    width: '100%',
    gap: 12,
    paddingBottom: 12,
  },
  pillGrid: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  pillGridItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: '48%',
  },
  pillActive: {
    borderColor: TAB_ACTIVE_COLOR,
    backgroundColor: colors.accentChip,
  },
  pillText: {
    fontSize: 15,
    color: colors.text,
    fontFamily: 'Outfit_400Regular',
  },
  pillTextActive: {
    color: TAB_ACTIVE_COLOR,
    fontFamily: 'Outfit_500Medium',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: TAB_ACTIVE_COLOR,
    shadowColor: TAB_ACTIVE_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 26,
    color: colors.textSecondary,
    fontFamily: 'PlayfairDisplay_500Medium',
  },
  weddingHubScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  weddingHubContent: {
    paddingHorizontal: 20,
  },
  weddingHubTitle: {
    fontSize: 34,
    color: '#2b2b2b',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  weddingHubSubtitle: {
    fontSize: 16,
    color: 'rgba(111,103,95,0.85)',
    fontFamily: 'Outfit_400Regular',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  weddingHubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  weddingHubBack: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4EDEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weddingHubHeaderText: {
    marginLeft: 12,
  },
  coupleCard: {
    backgroundColor: '#FFF5F1',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 14,
    alignSelf: 'stretch',
  },
  coupleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: 6,
  },
  coupleNames: {
    flex: 1,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 24,
    lineHeight: 28,
    color: '#1B1511',
    fontWeight: '700',
    textAlign: 'center',
  },
  coupleEditButton: {
    padding: 6,
    borderRadius: 16,
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  coupleDate: {
    fontSize: 16,
    color: '#4A403C',
    marginTop: 6,
    fontFamily: 'Outfit_500Medium',
    textAlign: 'center',
  },
  coupleCountdown: {
    fontSize: 30,
    lineHeight: 34,
    color: '#FF9B85',
    fontFamily: 'PlayfairDisplay_700Bold',
    marginTop: 12,
  },
  coupleCaption: {
    fontSize: 14,
    color: '#B87F71',
    marginTop: 6,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'center',
  },
  nextStepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFF5F1',
    marginBottom: 28,
    alignSelf: 'stretch',
  },
  nextStepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,155,133,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nextStepTitle: {
    fontSize: 18,
    color: '#2F2925',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginRight: 12,
  },
  nextStepLinkText: {
    fontSize: 14,
    color: '#FF9B85',
    fontFamily: 'Outfit_600SemiBold',
  },
  nextStepSubtitle: {
    fontSize: 14,
    color: '#9B8B82',
    fontFamily: 'Outfit_400Regular',
    marginBottom: 12,
  },
  nextStepTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  nextStepFill: {
    width: '0%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: TAB_ACTIVE_COLOR,
  },
  sectionBlock: {
    marginBottom: 28,
    width: '100%',
  },
  sectionBlockInspiration: {
    marginBottom: 36,
  },
  sectionBlockQuickActions: {
    marginTop: 16,
  },
  quickActionsHeading: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8F8F8F',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8F8F8F',
    marginBottom: 26,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#8e867e',
    fontFamily: 'Outfit_400Regular',
    marginBottom: 14,
  },
  inspirationHeading: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    color: '#2F2925',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  glanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  glanceCard: {
    width: '48%',
    backgroundColor: '#FFFCFA',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  glanceCardTierOne: {
    backgroundColor: 'rgba(255,155,133,0.08)',
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 4,
  },
  glanceCardUrgent: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  glanceLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#8F8F8F',
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 6,
  },
  glanceValue: {
    fontSize: 18,
    color: '#2F2925',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 6,
  },
  glanceValueStrong: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 19,
    color: '#2B2320',
  },
  glanceValueSecondary: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    color: '#8F8078',
  },
  glanceBody: {
    fontSize: 13,
    lineHeight: 17,
    color: '#A3978F',
    fontFamily: 'Outfit_400Regular',
    marginBottom: 8,
  },
  glanceBodyMuted: {
    color: 'rgba(163,151,143,0.7)',
  },
  glanceFooter: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusPillSuccess: {
    backgroundColor: '#E6F4EE',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusPillAlert: {
    backgroundColor: '#FFE8E1',
  },
  statusPillNeutral: {
    backgroundColor: '#F0F0F0',
  },
  statusPillSubtle: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillTextNeutral: {
    fontSize: 12,
    color: '#6f675f',
    fontFamily: 'Outfit_500Medium',
  },
  statusPillText: {
    fontSize: 12,
    color: '#5b534c',
    fontFamily: 'Outfit_500Medium',
  },
  glanceLink: {
    fontSize: 13,
    color: 'rgba(242,143,121,0.82)',
    fontFamily: 'Outfit_500Medium',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  glanceLinkSecondary: {
    color: 'rgba(140,128,119,0.85)',
  },
  glanceLinkMuted: {
    color: '#D9A89C',
  },
  colorDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressTrackSoft: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(239,231,223,0.55)',
    marginTop: 6,
    marginBottom: 12,
  },
  progressFillSoft: {
    width: '42%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: TAB_ACTIVE_COLOR,
  },
  statusPillBudget: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusPillTextBudget: {
    fontSize: 11,
    color: TAB_ACTIVE_COLOR,
    fontFamily: 'Outfit_600SemiBold',
  },
  guestLine: {
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(111,103,95,0.75)',
    fontFamily: 'Outfit_400Regular',
  },
  guestLineGroup: {
    width: '100%',
  },
  guestLineSpacer: {
    height: 4,
  },
  guestDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
  },
  inspirationCard: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 12,
    width: '100%',
  },
  inspirationImage: {
    borderRadius: 24,
  },
  inspirationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  inspirationWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,244,236,0.18)',
  },
  inspirationTextBlock: {
    position: 'absolute',
    left: 20,
    top: 24,
    right: 80,
  },
  inspirationTitle: {
    fontSize: 18,
    color: '#FFF8F2',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 6,
  },
  inspirationSubtitle: {
    fontSize: 14,
    color: 'rgba(255,248,242,0.85)',
    fontFamily: 'Outfit_400Regular',
  },
  sparkleButton: {
    position: 'absolute',
    right: 16,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionPill: {
    width: '31%',
    backgroundColor: '#F8F6F3',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  quickActionPillPrimary: {
    backgroundColor: 'rgba(255,155,133,0.18)',
  },
  quickActionIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Outfit_500Medium',
  },
  quickActionTextPrimary: {
    color: TAB_ACTIVE_COLOR,
    fontFamily: 'Outfit_600SemiBold',
  },
  placeholderScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  placeholderText: {
    fontSize: 18,
    color: '#2b2b2b',
    fontFamily: 'Outfit_500Medium',
  },
});
