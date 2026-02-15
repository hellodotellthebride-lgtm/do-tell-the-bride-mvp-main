import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeScreen from './HomeScreen';
import { OnboardingProvider, useOnboarding } from './onboardingState';
import {
  ONBOARDING_CONCERNS,
  getRecommendation,
} from './onboardingConcerns';
import { trackEvent } from './analytics';
import { colors as themeColors } from './src/theme';

const SCREENS = {
  CONCERNS: 'CONCERNS',
  PRIMARY_FOCUS: 'PRIMARY_FOCUS',
  START_HERE: 'START_HERE',
  COMPLETE: 'COMPLETE',
};

const colors = {
  background: themeColors.background,
  text: themeColors.text,
  muted: themeColors.textSecondary,
  subtle: themeColors.sageGrey,
  accent: themeColors.primary,
  outline: themeColors.border,
  card: themeColors.surface,
};

export default function OnboardingFlow(props) {
  return (
    <OnboardingProvider>
      <OnboardingNavigator {...props} />
    </OnboardingProvider>
  );
}

function OnboardingNavigator({ navigation }) {
  const { state, actions, hydrated } = useOnboarding();
  const [screen, setScreen] = useState(SCREENS.CONCERNS);
  const [localCompleteRoute, setLocalCompleteRoute] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (
      state.selectedConcerns.length === 1 &&
      state.primaryFocus !== state.selectedConcerns[0]
    ) {
      actions.setPrimaryFocus(state.selectedConcerns[0]);
      return;
    }
    if (
      state.primaryFocus &&
      !state.selectedConcerns.includes(state.primaryFocus)
    ) {
      actions.setPrimaryFocus(null);
    }
  }, [hydrated, state.selectedConcerns, state.primaryFocus, actions]);

  useEffect(() => {
    if (!hydrated || bootstrapped || state.completedOnboarding) {
      return;
    }
    if (state.primaryFocus) {
      console.log('[onboarding] setScreen ->', SCREENS.START_HERE);
      setScreen(SCREENS.START_HERE);
    } else if (state.selectedConcerns.length > 1) {
      console.log('[onboarding] setScreen ->', SCREENS.PRIMARY_FOCUS);
      setScreen(SCREENS.PRIMARY_FOCUS);
    } else {
      console.log('[onboarding] setScreen ->', SCREENS.CONCERNS);
      setScreen(SCREENS.CONCERNS);
    }
    setBootstrapped(true);
  }, [
    hydrated,
    bootstrapped,
    state.completedOnboarding,
    state.primaryFocus,
    state.selectedConcerns,
  ]);

  const goToStartHere = useCallback(() => {
    console.log('[onboarding] setScreen ->', SCREENS.START_HERE);
    setScreen(SCREENS.START_HERE);
  }, []);
  const goToPrimaryFocus = useCallback(() => {
    console.log('[onboarding] setScreen ->', SCREENS.PRIMARY_FOCUS);
    setScreen(SCREENS.PRIMARY_FOCUS);
  }, []);
  const goToConcerns = useCallback(() => {
    console.log('[onboarding] setScreen ->', SCREENS.CONCERNS);
    setScreen(SCREENS.CONCERNS);
  }, []);

  const resetAfterComplete = useCallback(() => {
    actions.reset();
    console.log('[onboarding] setScreen ->', SCREENS.CONCERNS);
    setScreen(SCREENS.CONCERNS);
    setLocalCompleteRoute(null);
    setBootstrapped(false);
  }, [actions]);

  const completeNavigation = useCallback(
    (destination) => {
      actions.setCompletedOnboarding(true);
      setLocalCompleteRoute(destination?.route ?? 'WeddingHub');
      console.log('[onboarding] setScreen ->', SCREENS.COMPLETE);
      setScreen(SCREENS.COMPLETE);
    },
    [actions],
  );

  const requestDestination = useCallback(
    (destination) => {
      if (!destination) return;
      completeNavigation(destination);
    },
    [completeNavigation],
  );

  if (!hydrated) {
    return <LoadingState />;
  }

  if (hydrated && state.completedOnboarding) {
    console.log('[onboarding] rendering HomeScreen (completed)');
    return <HomeScreen navigation={navigation} />;
  }

  switch (screen) {
    case SCREENS.CONCERNS:
      return (
        <ConcernSelectScreen
          onNextSingle={goToStartHere}
          onNextMultiple={goToPrimaryFocus}
        />
      );
    case SCREENS.PRIMARY_FOCUS:
      return (
        <PrimaryFocusScreen
          onBack={goToConcerns}
          onContinue={goToStartHere}
        />
      );
    case SCREENS.START_HERE: {
      const backTarget =
        state.selectedConcerns.length > 1
          ? SCREENS.PRIMARY_FOCUS
          : SCREENS.CONCERNS;
      return (
        <StartHereScreen
          onBack={() => {
            console.log('[onboarding] setScreen ->', backTarget);
            setScreen(backTarget);
          }}
          onRequestDestination={requestDestination}
          onExploreDashboard={() =>
            completeNavigation({ route: 'WeddingHub', params: {} })
          }
        />
      );
    }
    case SCREENS.COMPLETE:
      console.log('[onboarding] rendering HomeScreen (complete screen)');
      return <HomeScreen navigation={navigation} />;
    default: {
      console.log('[onboarding] fell into default with screen =', screen);
      const normalizedRouteRaw = localCompleteRoute ?? 'WeddingHub';
      const normalizedRoute = String(normalizedRouteRaw).trim();
      const normalizedKey = normalizedRoute
        .toLowerCase()
        .replace(/\s|_/g, '');
      if (
        normalizedKey === 'weddinghub' ||
        normalizedKey === 'home' ||
        !normalizedKey
      ) {
        return <HomeScreen navigation={navigation} />;
      }
      return (
        <DestinationPlaceholder
          routeName={normalizedRoute}
          onReset={resetAfterComplete}
          navigation={navigation}
        />
      );
    }
  }
}

function ConcernSelectScreen({ onNextSingle, onNextMultiple }) {
  const { state, actions } = useOnboarding();
  const [selection, setSelection] = useState(state.selectedConcerns);

  useEffect(() => {
    setSelection(state.selectedConcerns);
  }, [state.selectedConcerns]);

  const toggleConcern = useCallback(
    (id) => {
      setSelection((prev) => {
        if (prev.includes(id)) {
          return prev.filter((value) => value !== id);
        }
        return [...prev, id];
      });
    },
    [setSelection],
  );

  const hasSelection = selection.length > 0;

  const handleNext = useCallback(() => {
    if (!hasSelection) return;
    actions.setSelectedConcerns(selection);
    trackEvent('onboarding_concerns_selected', {
      count: selection.length,
      ids: selection,
    });
    if (selection.length === 1) {
      const focus = selection[0];
      actions.setPrimaryFocus(focus);
      trackEvent('onboarding_primary_focus_set', {
        primaryFocus: focus,
        via: 'single_select',
      });
      onNextSingle();
      return;
    }
    onNextMultiple();
  }, [hasSelection, selection, actions, onNextSingle, onNextMultiple]);

  return (
    <ScreenWrapper>
      <TopBack disabled />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SerifTitle style={styles.largeTitle}>
          What's been weighing on you the most?
        </SerifTitle>
        <Text style={styles.bodyText}>
          Pick everything that applies. We will remember it all.
        </Text>

        <View style={styles.tileGrid}>
          {ONBOARDING_CONCERNS.map((concern) => (
            <ConcernTile
              key={concern.id}
              label={concern.label}
              selected={selection.includes(concern.id)}
              onPress={() => toggleConcern(concern.id)}
            />
          ))}
        </View>

        {!hasSelection ? (
          <Text style={styles.helperText}>
            Select at least one so we can tailor your starting point.
          </Text>
        ) : null}
      </ScrollView>

      <PrimaryButton disabled={!hasSelection} onPress={handleNext}>
        Next
      </PrimaryButton>
    </ScreenWrapper>
  );
}

function PrimaryFocusScreen({ onBack, onContinue }) {
  const { state, actions } = useOnboarding();
  const options = useMemo(
    () =>
      ONBOARDING_CONCERNS.filter((concern) =>
        state.selectedConcerns.includes(concern.id),
      ),
    [state.selectedConcerns],
  );

  const [choice, setChoice] = useState(() => {
    if (!state.primaryFocus) return null;
    return state.selectedConcerns.includes(state.primaryFocus)
      ? state.primaryFocus
      : null;
  });

  useEffect(() => {
    if (!state.primaryFocus) return;
    if (!state.selectedConcerns.includes(state.primaryFocus)) {
      setChoice(null);
      return;
    }
    setChoice(state.primaryFocus);
  }, [state.primaryFocus, state.selectedConcerns]);

  const handleContinue = () => {
    if (!choice) return;
    actions.setPrimaryFocus(choice);
    trackEvent('onboarding_primary_focus_set', {
      primaryFocus: choice,
      via: 'primary_focus_screen',
    });
    onContinue();
  };

  if (!options.length) {
    return (
      <ScreenWrapper>
        <TopBack onPress={onBack} />
        <View style={styles.emptyState}>
          <Text style={[styles.bodyText, styles.emptyStateText]}>
            Let's pick at least one concern first.
          </Text>
          <PrimaryButton onPress={onBack}>Go back</PrimaryButton>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <TopBack onPress={onBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SerifTitle style={styles.largeTitle}>
          Which one should we tackle first?
        </SerifTitle>
        <Text style={styles.bodyText}>We'll still remember the rest.</Text>

        <View style={styles.tileGrid}>
          {options.map((concern) => (
            <ConcernTile
              key={concern.id}
              label={concern.label}
              selected={choice === concern.id}
              onPress={() => setChoice(concern.id)}
            />
          ))}
        </View>
      </ScrollView>

      <PrimaryButton disabled={!choice} onPress={handleContinue}>
        Continue
      </PrimaryButton>
    </ScreenWrapper>
  );
}

function StartHereScreen({ onBack, onRequestDestination, onExploreDashboard }) {
  const { state } = useOnboarding();
  const recommendation = useMemo(
    () => getRecommendation(state.primaryFocus),
    [state.primaryFocus],
  );

  const handlePrimary = useCallback(() => {
    const destination = {
      route: recommendation.destinationRoute,
      params: { fromStartHere: true, primaryFocus: state.primaryFocus },
    };
    trackEvent('start_here_take_me_there', {
      destination: destination.route,
      primaryFocus: state.primaryFocus,
    });
    onRequestDestination(destination);
  }, [recommendation, onRequestDestination, state.primaryFocus]);

  const handleExplore = useCallback(() => {
    const destination = { route: 'WeddingHub', params: {} };
    trackEvent('start_here_explore_own', {
      destination: destination.route,
      primaryFocus: state.primaryFocus,
    });
    onExploreDashboard();
  }, [state.primaryFocus, onExploreDashboard]);

  return (
    <ScreenWrapper>
      <TopBack onPress={onBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SerifTitle style={styles.largeTitle}>
          {recommendation.startHereTitle}
        </SerifTitle>
        <Text style={[styles.bodyText, styles.subtitle]}>
          {recommendation.startHereSubtitle}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>BASED ON WHAT YOU TOLD US</Text>
          <Text style={styles.cardBody}>{recommendation.startHereCardBody}</Text>
        </View>
      </ScrollView>

      <PrimaryButton onPress={handlePrimary}>
        {recommendation.ctaLabel ?? 'Take me there'}
      </PrimaryButton>
      <TouchableOpacity onPress={handleExplore} style={styles.secondaryLink}>
        <Text style={styles.secondaryLinkText}>I'll explore on my own</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

function DestinationPlaceholder({ routeName, onReset, navigation }) {
  const raw = routeName ?? 'WeddingHub';
  const normalized = String(raw).trim();
  const key = normalized.toLowerCase().replace(/\s|_/g, '');
  if (key === 'weddinghub' || key === 'home' || !key) {
    return <HomeScreen navigation={navigation} />;
  }

  return (
    <ScreenWrapper>
      <View style={styles.centered}>
        <SerifTitle style={styles.largeTitle}>All set!</SerifTitle>
        <Text style={[styles.bodyText, styles.centeredBody]}>
          We'd normally navigate to <Text style={styles.bold}>{normalized}</Text>{' '}
          here. This placeholder exists because no navigation prop was provided.
          For now, explore the dashboard above or head back using your device controls.
        </Text>
      </View>
    </ScreenWrapper>
  );
}

function TopBack({ onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={styles.backButton}
    >
      <Text style={[styles.backIcon, disabled && styles.backIconDisabled]}>
        {'<'}
      </Text>
    </TouchableOpacity>
  );
}

function ConcernTile({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.concernTile,
        selected ? styles.concernTileSelected : null,
      ]}
    >
      <View style={styles.concernTileHeader}>
        <Text style={styles.concernTileText}>{label}</Text>
        <View
          style={[
            styles.checkDot,
            selected ? styles.checkDotSelected : null,
          ]}
        >
          {selected ? <View style={styles.checkDotInner} /> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PrimaryButton({ children, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryButton,
        disabled ? styles.primaryButtonDisabled : null,
      ]}
      accessibilityRole="button"
    >
      <Text style={styles.primaryButtonText}>{children}</Text>
    </TouchableOpacity>
  );
}

function SerifTitle({ children, style }) {
  return (
    <Text style={[styles.serifTitle, style]}>{children}</Text>
  );
}

function ScreenWrapper({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

function LoadingState() {
  return (
    <ScreenWrapper>
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
        <Text style={[styles.bodyText, styles.loadingText]}>
          Getting things ready...
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  serifTitle: {
    fontFamily: 'Playfair Display',
    color: colors.text,
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 36,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.muted,
  },
  subtitle: {
    marginBottom: 24,
  },
  tileGrid: {
    marginTop: 16,
  },
  helperText: {
    marginTop: 16,
    color: '#C05A5A',
  },
  emptyStateText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.subtle,
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  secondaryLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryLinkText: {
    color: colors.muted,
    textDecorationLine: 'underline',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centeredBody: {
    textAlign: 'center',
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
    color: colors.text,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.muted,
  },
  backIconDisabled: {
    opacity: 0.4,
  },
  concernTile: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  concernTileSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFEDE7',
  },
  concernTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  concernTileText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  checkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDotSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFE1D7',
  },
  checkDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
  },
});
