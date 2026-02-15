import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChecklistItems, STAGE_CHECKLISTS } from './checklists';

const STORAGE_KEY = 'ROADMAP_STAGE_CHECKLISTS';
const COMPLETIONS_KEY = 'ROADMAP_STAGE_COMPLETIONS_V1';

export const loadChecklistState = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn('[roadmap] unable to load checklist state', error);
    return {};
  }
};

export const saveChecklistState = async (state) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[roadmap] unable to save checklist state', error);
  }
};

export const loadCompletionState = async () => {
  try {
    const stored = await AsyncStorage.getItem(COMPLETIONS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.warn('[roadmap] unable to load completion state', error);
    return {};
  }
};

const saveCompletionState = async (state) => {
  try {
    await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[roadmap] unable to save completion state', error);
  }
};

const trackChecklistDelta = async (stageId, prevMap, nextMap) => {
  try {
    const completionState = await loadCompletionState();
    const prevStage = prevMap && typeof prevMap === 'object' ? prevMap : {};
    const nextStage = nextMap && typeof nextMap === 'object' ? nextMap : {};
    const nextCompletionStage = {
      ...(completionState?.[stageId] && typeof completionState[stageId] === 'object'
        ? completionState[stageId]
        : {}),
    };

    const allIds = new Set([...Object.keys(prevStage), ...Object.keys(nextStage)]);
    const now = Date.now();
    allIds.forEach((itemId) => {
      const was = Boolean(prevStage[itemId]);
      const is = Boolean(nextStage[itemId]);
      if (!was && is) {
        nextCompletionStage[itemId] = now;
      }
      if (was && !is) {
        delete nextCompletionStage[itemId];
      }
    });

    const nextCompletionState = { ...(completionState || {}), [stageId]: nextCompletionStage };
    await saveCompletionState(nextCompletionState);
  } catch (error) {
    console.warn('[roadmap] unable to track completion delta', error);
  }
};

export const persistStageChecklist = async (stageId, checklistMap) => {
  const state = await loadChecklistState();
  const prevStage = state?.[stageId] ?? {};
  const nextState = {
    ...state,
    [stageId]: checklistMap,
  };
  await saveChecklistState(nextState);
  await trackChecklistDelta(stageId, prevStage, checklistMap);
  return nextState;
};

export const computeStageProgress = (stageId, checklistState) => {
  const items = getChecklistItems(stageId);
  const total = items.length;
  if (total === 0) {
    return { complete: 0, total: 0, percent: 0 };
  }
  const stageMap = checklistState[stageId] ?? {};
  const complete = items.reduce(
    (sum, item) => sum + (stageMap[item.id] ? 1 : 0),
    0,
  );
  const percent = Math.round((complete / total) * 100);
  return { complete, total, percent };
};

export const computeAllStageProgress = (checklistState) => {
  const stageIds = Object.keys(checklistState);
  const result = {};
  stageIds.forEach((stageId) => {
    result[stageId] = computeStageProgress(stageId, checklistState);
  });
  return result;
};

export const computeOverallProgress = (checklistState) => {
  let completeSum = 0;
  let totalSum = 0;
  Object.keys(STAGE_CHECKLISTS).forEach((stageId) => {
    const { complete, total } = computeStageProgress(stageId, checklistState);
    completeSum += complete;
    totalSum += total;
  });
  if (totalSum === 0) {
    return 0;
  }
  return Math.round((completeSum / totalSum) * 100);
};
