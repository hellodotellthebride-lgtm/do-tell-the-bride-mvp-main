import AsyncStorage from '@react-native-async-storage/async-storage';

export const GUEST_NEST_STORAGE_KEY = 'guestNest_v1';

export const DEFAULT_GUEST_NEST_STATE = {
  guests: [],
  groups: [],
  mealOptions: [],
  tables: [],
};

const RSVP_STATUSES = new Set(['Yes', 'No', 'Pending']);
const GUEST_CATEGORIES = new Set(['Day', 'Evening', 'Both']);
const MEAL_COURSES = new Set(['Starter', 'Main', 'Dessert', 'Other']);

const nowMs = () => Date.now();

const optionalTrimmedString = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const requiredString = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const normalizeCreatedAt = (value) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  return nowMs();
};

const normalizeUpdatedAt = (value, createdAt) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  return createdAt;
};

const normalizeGuestCategory = (value) => {
  if (value === null) return null;
  if (!value) return null;
  if (GUEST_CATEGORIES.has(value)) return value;
  return null;
};

const normalizeRsvpStatus = (value) => {
  if (RSVP_STATUSES.has(value)) return value;
  return 'Pending';
};

const normalizeMealCourse = (value) => {
  if (MEAL_COURSES.has(value)) return value;
  return 'Other';
};

const normalizeGuest = (guest, fallbackId) => {
  const createdAt = normalizeCreatedAt(guest?.createdAt);
  const updatedAt = normalizeUpdatedAt(guest?.updatedAt, createdAt);
  return {
    id: optionalTrimmedString(guest?.id) || fallbackId,
    fullName: requiredString(guest?.fullName, '').trim(),
    groupId: optionalTrimmedString(guest?.groupId),
    rsvpStatus: normalizeRsvpStatus(guest?.rsvpStatus),
    guestCategory: normalizeGuestCategory(guest?.guestCategory),
    plusOneAllowed: Boolean(guest?.plusOneAllowed),
    mealChoiceId: optionalTrimmedString(guest?.mealChoiceId),
    dietaryNotes: optionalTrimmedString(guest?.dietaryNotes),
    email: optionalTrimmedString(guest?.email),
    phone: optionalTrimmedString(guest?.phone),
    address: optionalTrimmedString(guest?.address),
    tableId: optionalTrimmedString(guest?.tableId),
    seatLabel: optionalTrimmedString(guest?.seatLabel),
    notes: optionalTrimmedString(guest?.notes),
    createdAt,
    updatedAt,
  };
};

const normalizeGroup = (group, fallbackId) => ({
  id: optionalTrimmedString(group?.id) || fallbackId,
  name: requiredString(group?.name, '').trim(),
  createdAt: normalizeCreatedAt(group?.createdAt),
});

const normalizeMealOption = (option, fallbackId) => ({
  id: optionalTrimmedString(option?.id) || fallbackId,
  course: normalizeMealCourse(option?.course),
  dishName: requiredString(option?.dishName, '').trim(),
  createdAt: normalizeCreatedAt(option?.createdAt),
});

const normalizeTable = (table, fallbackId) => ({
  id: optionalTrimmedString(table?.id) || fallbackId,
  name: requiredString(table?.name, '').trim(),
  numberOfSeats: Math.max(0, Number(table?.numberOfSeats) || 0),
  type: optionalTrimmedString(table?.type),
  isTopTable: Boolean(table?.isTopTable),
  createdAt: normalizeCreatedAt(table?.createdAt),
});

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const cleanDanglingReferences = (state) => {
  const groupIds = new Set((state.groups || []).map((g) => g.id));
  const mealIds = new Set((state.mealOptions || []).map((m) => m.id));
  const tableIds = new Set((state.tables || []).map((t) => t.id));

  const guests = (state.guests || []).map((guest) => {
    const next = { ...guest };
    if (next.groupId && !groupIds.has(next.groupId)) {
      next.groupId = undefined;
    }
    if (next.mealChoiceId && !mealIds.has(next.mealChoiceId)) {
      next.mealChoiceId = undefined;
    }
    if (next.tableId && !tableIds.has(next.tableId)) {
      next.tableId = undefined;
      next.seatLabel = undefined;
    }
    return next;
  });

  return { ...state, guests };
};

export const loadGuestNest = async () => {
  try {
    const stored = await AsyncStorage.getItem(GUEST_NEST_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_GUEST_NEST_STATE;
    }
    const parsed = JSON.parse(stored);
    const guestsRaw = ensureArray(parsed?.guests);
    const groupsRaw = ensureArray(parsed?.groups);
    const mealOptionsRaw = ensureArray(parsed?.mealOptions);
    const tablesRaw = ensureArray(parsed?.tables);

    const guests = guestsRaw.map((g, index) => normalizeGuest(g, `guest-${index}-${nowMs()}`));
    const groups = groupsRaw.map((g, index) => normalizeGroup(g, `group-${index}-${nowMs()}`));
    const mealOptions = mealOptionsRaw.map((m, index) =>
      normalizeMealOption(m, `meal-${index}-${nowMs()}`),
    );
    let tables = tablesRaw.map((t, index) => normalizeTable(t, `table-${index}-${nowMs()}`));
    const topTables = tables.filter((table) => Boolean(table.isTopTable));
    if (topTables.length > 1) {
      const chosen = topTables
        .slice()
        .sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0))[0];
      const chosenId = chosen?.id;
      if (chosenId) {
        tables = tables.map((table) =>
          table.isTopTable && table.id !== chosenId ? { ...table, isTopTable: false } : table,
        );
      }
    }

    return cleanDanglingReferences({
      guests,
      groups,
      mealOptions,
      tables,
    });
  } catch (error) {
    console.warn('[guestNest] unable to load state', error);
    return DEFAULT_GUEST_NEST_STATE;
  }
};

export const saveGuestNest = async (state) => {
  try {
    await AsyncStorage.setItem(GUEST_NEST_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[guestNest] unable to save state', error);
  }
};

export const GUEST_NEST_CONSTANTS = {
  RSVP_STATUSES: ['Pending', 'Yes', 'No'],
  GUEST_CATEGORIES: ['Day', 'Evening', 'Both'],
  MEAL_COURSES: ['Starter', 'Main', 'Dessert', 'Other'],
};
