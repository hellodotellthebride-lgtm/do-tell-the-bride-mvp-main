import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ROADMAP_GUIDES_V1';

export const loadGuideState = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }
    return parsed;
  } catch (error) {
    console.warn('[roadmap] unable to load guide state', error);
    return {};
  }
};

export const saveGuideState = async (state) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[roadmap] unable to save guide state', error);
  }
};

export const getGuideProgress = (state, stageId, guideId) =>
  state?.[stageId]?.[guideId] ?? null;

export const updateGuideProgress = async (stageId, guideId, patch) => {
  const state = await loadGuideState();
  const stageState = state[stageId] ?? {};
  const previous = stageState[guideId] ?? {};
  const nextGuide = { ...previous, ...patch };
  const nextState = {
    ...state,
    [stageId]: {
      ...stageState,
      [guideId]: nextGuide,
    },
  };
  await saveGuideState(nextState);
  return nextGuide;
};

export const markGuideCompleted = async (stageId, guideId) =>
  updateGuideProgress(stageId, guideId, {
    completed: true,
    completedAt: Date.now(),
  });

