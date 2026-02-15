import AsyncStorage from '@react-native-async-storage/async-storage';

export const ROADMAP_OUTPUTS_KEY = 'ROADMAP_OUTPUTS';

export type RoadmapOutputs = Record<string, any>;

const isPlainObject = (value: any) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const deepMerge = (base: any, patch: any): any => {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return patch;
  }
  const next: Record<string, any> = { ...base };
  Object.keys(patch).forEach((key) => {
    if (key in base) {
      next[key] = deepMerge(base[key], patch[key]);
      return;
    }
    next[key] = patch[key];
  });
  return next;
};

export const setAtPath = (obj: Record<string, any>, path: string, value: any) => {
  const parts = String(path || '')
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return obj;

  let cursor: any = obj;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }
    if (!isPlainObject(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  });
  return obj;
};

export const loadRoadmapOutputs = async (): Promise<RoadmapOutputs> => {
  try {
    const raw = await AsyncStorage.getItem(ROADMAP_OUTPUTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : {};
  } catch (error) {
    console.warn('[roadmapOutputs] unable to load outputs', error);
    return {};
  }
};

export const saveRoadmapOutputs = async (outputs: RoadmapOutputs) => {
  try {
    await AsyncStorage.setItem(ROADMAP_OUTPUTS_KEY, JSON.stringify(outputs ?? {}));
  } catch (error) {
    console.warn('[roadmapOutputs] unable to save outputs', error);
  }
};

export const mergeRoadmapOutputs = async (patch: RoadmapOutputs) => {
  const existing = await loadRoadmapOutputs();
  const next = deepMerge(existing, patch ?? {});
  await saveRoadmapOutputs(next);
  return next;
};

