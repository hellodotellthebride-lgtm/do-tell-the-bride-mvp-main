import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'onboardingState.v1';

const defaultState = {
  selectedConcerns: [],
  primaryFocus: null,
  completedOnboarding: false,
  isPro: false,
};

const OnboardingContext = createContext(null);

const readFromStorage = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
    };
  } catch (error) {
    console.warn('Unable to hydrate onboarding state', error);
    return defaultState;
  }
};

const writeToStorage = async (state) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to persist onboarding state', error);
  }
};

export function OnboardingProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    readFromStorage().then((saved) => {
      if (!mounted) return;
      setState(saved);
      setHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeToStorage(state);
  }, [state, hydrated]);

  const updateSlice = useCallback((key, updater) => {
    setState((prev) => {
      const nextValue =
        typeof updater === 'function' ? updater(prev[key], prev) : updater;
      if (nextValue === prev[key]) {
        return prev;
      }
      return {
        ...prev,
        [key]: nextValue,
      };
    });
  }, []);

  const actions = useMemo(
    () => ({
      setSelectedConcerns: (valueOrUpdater) =>
        updateSlice('selectedConcerns', (prevValue, prevState) => {
          if (typeof valueOrUpdater === 'function') {
            return valueOrUpdater(prevValue, prevState);
          }
          return Array.isArray(valueOrUpdater) ? valueOrUpdater : prevValue;
        }),
      setPrimaryFocus: (valueOrUpdater) =>
        updateSlice('primaryFocus', (prevValue, prevState) => {
          if (typeof valueOrUpdater === 'function') {
            return valueOrUpdater(prevValue, prevState);
          }
          return valueOrUpdater ?? prevValue;
        }),
      setCompletedOnboarding: (flag) =>
        updateSlice('completedOnboarding', Boolean(flag)),
      setIsPro: (flag) => updateSlice('isPro', Boolean(flag)),
      reset: () => setState(defaultState),
    }),
    [updateSlice],
  );

  const value = useMemo(
    () => ({
      state,
      actions,
      hydrated,
    }),
    [state, actions, hydrated],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
