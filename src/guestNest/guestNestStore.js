import { emitGuestNestChange } from './guestNestEvents';
import { loadGuestNest, saveGuestNest } from './guestNestStorage';

const nowMs = () => Date.now();
const createId = (prefix) => `${prefix}-${nowMs()}-${Math.round(Math.random() * 1000)}`;

const optionalTrimmedString = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeRsvpStatus = (value) => (value === 'Yes' || value === 'No' ? value : 'Pending');
const normalizeGuestCategory = (value) =>
  value === 'Day' || value === 'Evening' || value === 'Both' ? value : null;
const normalizeMealCourse = (value) =>
  value === 'Starter' || value === 'Main' || value === 'Dessert' ? value : 'Other';

let writeQueue = Promise.resolve();
const enqueueWrite = (task) => {
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
};

const updateState = (recipe, meta = {}) =>
  enqueueWrite(async () => {
    const prev = await loadGuestNest();
    const next = recipe(prev);
    await saveGuestNest(next);
    emitGuestNestChange(next, meta);
    return next;
  });

export const addGuest = async (data = {}) => {
  const fullName = (data.fullName ?? '').toString().trim();
  if (!fullName) {
    return loadGuestNest();
  }
  const createdAt = nowMs();
  const guest = {
    id: createId('guest'),
    fullName,
    groupId: optionalTrimmedString(data.groupId),
    rsvpStatus: normalizeRsvpStatus(data.rsvpStatus),
    guestCategory: data.guestCategory === null ? null : normalizeGuestCategory(data.guestCategory),
    plusOneAllowed: Boolean(data.plusOneAllowed),
    mealChoiceId: optionalTrimmedString(data.mealChoiceId),
    dietaryNotes: optionalTrimmedString(data.dietaryNotes),
    email: optionalTrimmedString(data.email),
    phone: optionalTrimmedString(data.phone),
    address: optionalTrimmedString(data.address),
    tableId: optionalTrimmedString(data.tableId),
    seatLabel: optionalTrimmedString(data.seatLabel),
    notes: optionalTrimmedString(data.notes),
    createdAt,
    updatedAt: createdAt,
  };
  return updateState(
    (state) => ({
      ...state,
      guests: [guest, ...(state.guests || [])],
    }),
    { action: 'addGuest', guestId: guest.id },
  );
};

export const updateGuest = async (guestId, updates = {}) => {
  const targetId = optionalTrimmedString(guestId);
  if (!targetId) return loadGuestNest();

  const patch = {
    fullName:
      updates.fullName !== undefined ? updates.fullName?.toString?.().trim?.() : undefined,
    groupId:
      updates.groupId === null
        ? undefined
        : updates.groupId !== undefined
          ? optionalTrimmedString(updates.groupId)
          : undefined,
    rsvpStatus: updates.rsvpStatus !== undefined ? normalizeRsvpStatus(updates.rsvpStatus) : undefined,
    guestCategory:
      updates.guestCategory !== undefined
        ? updates.guestCategory === null
          ? null
          : normalizeGuestCategory(updates.guestCategory)
        : undefined,
    plusOneAllowed:
      updates.plusOneAllowed !== undefined ? Boolean(updates.plusOneAllowed) : undefined,
    mealChoiceId:
      updates.mealChoiceId === null
        ? undefined
        : updates.mealChoiceId !== undefined
          ? optionalTrimmedString(updates.mealChoiceId)
          : undefined,
    dietaryNotes:
      updates.dietaryNotes === null
        ? undefined
        : updates.dietaryNotes !== undefined
          ? optionalTrimmedString(updates.dietaryNotes)
          : undefined,
    email:
      updates.email === null
        ? undefined
        : updates.email !== undefined
          ? optionalTrimmedString(updates.email)
          : undefined,
    phone:
      updates.phone === null
        ? undefined
        : updates.phone !== undefined
          ? optionalTrimmedString(updates.phone)
          : undefined,
    address:
      updates.address === null
        ? undefined
        : updates.address !== undefined
          ? optionalTrimmedString(updates.address)
          : undefined,
    tableId:
      updates.tableId === null
        ? undefined
        : updates.tableId !== undefined
          ? optionalTrimmedString(updates.tableId)
          : undefined,
    seatLabel:
      updates.seatLabel === null
        ? undefined
        : updates.seatLabel !== undefined
          ? optionalTrimmedString(updates.seatLabel)
          : undefined,
    notes:
      updates.notes === null
        ? undefined
        : updates.notes !== undefined
          ? optionalTrimmedString(updates.notes)
          : undefined,
  };

  return updateState(
    (state) => {
      let didUpdate = false;
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.id !== targetId) return guest;
        didUpdate = true;
        const next = {
          ...guest,
          updatedAt: nowMs(),
        };
        Object.entries(patch).forEach(([key, value]) => {
          if (value === undefined) return;
          next[key] = value;
        });
        if (patch.fullName !== undefined) {
          next.fullName = (patch.fullName || '').trim();
        }
        return next;
      });
      if (!didUpdate) return state;
      return { ...state, guests: nextGuests };
    },
    { action: 'updateGuest', guestId: targetId },
  );
};

export const deleteGuest = async (guestId) => {
  const targetId = optionalTrimmedString(guestId);
  if (!targetId) return loadGuestNest();
  return updateState(
    (state) => ({
      ...state,
      guests: (state.guests || []).filter((guest) => guest.id !== targetId),
    }),
    { action: 'deleteGuest', guestId: targetId },
  );
};

export const bulkAddGuests = async (names = [], defaults = {}) => {
  const incoming = Array.isArray(names) ? names : [];
  const fullNames = incoming
    .map((n) => (n ?? '').toString().trim())
    .filter(Boolean);
  if (fullNames.length === 0) return loadGuestNest();

  const createdAt = nowMs();
  const groupId = optionalTrimmedString(defaults.groupId);
  const rsvpStatus = normalizeRsvpStatus(defaults.rsvpStatus);
  const guestCategory =
    defaults.guestCategory === null || defaults.guestCategory === undefined
      ? null
      : normalizeGuestCategory(defaults.guestCategory);

  const additions = fullNames.map((fullName) => ({
    id: createId('guest'),
    fullName,
    groupId,
    rsvpStatus,
    guestCategory,
    plusOneAllowed: Boolean(defaults.plusOneAllowed),
    mealChoiceId: optionalTrimmedString(defaults.mealChoiceId),
    dietaryNotes: optionalTrimmedString(defaults.dietaryNotes),
    email: undefined,
    phone: undefined,
    address: undefined,
    tableId: undefined,
    seatLabel: undefined,
    notes: undefined,
    createdAt,
    updatedAt: createdAt,
  }));

  return updateState(
    (state) => ({
      ...state,
      guests: [...additions, ...(state.guests || [])],
    }),
    { action: 'bulkAddGuests', count: additions.length },
  );
};

export const addGroup = async (name) => {
  const trimmed = (name ?? '').toString().trim();
  if (!trimmed) return loadGuestNest();
  const createdAt = nowMs();
  const group = { id: createId('group'), name: trimmed, createdAt };
  return updateState(
    (state) => {
      const existingLower = (state.groups || []).map((g) => (g.name || '').toLowerCase());
      if (existingLower.includes(trimmed.toLowerCase())) {
        return state;
      }
      return { ...state, groups: [...(state.groups || []), group] };
    },
    { action: 'addGroup', groupId: group.id },
  );
};

export const deleteGroup = async (groupId) => {
  const targetId = optionalTrimmedString(groupId);
  if (!targetId) return loadGuestNest();
  return updateState(
    (state) => {
      const nextGroups = (state.groups || []).filter((g) => g.id !== targetId);
      const now = nowMs();
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.groupId !== targetId) return guest;
        return { ...guest, groupId: undefined, updatedAt: now };
      });
      return { ...state, groups: nextGroups, guests: nextGuests };
    },
    { action: 'deleteGroup', groupId: targetId },
  );
};

export const addMealOption = async (data = {}) => {
  const dishName = (data.dishName ?? '').toString().trim();
  if (!dishName) return loadGuestNest();
  const createdAt = nowMs();
  const option = {
    id: createId('meal'),
    course: normalizeMealCourse(data.course),
    dishName,
    createdAt,
  };
  return updateState(
    (state) => {
      const existingLower = (state.mealOptions || []).map((m) => (m.dishName || '').toLowerCase());
      if (existingLower.includes(dishName.toLowerCase())) {
        return state;
      }
      return { ...state, mealOptions: [...(state.mealOptions || []), option] };
    },
    { action: 'addMealOption', mealOptionId: option.id },
  );
};

export const updateMealOption = async (mealOptionId, updates = {}) => {
  const targetId = optionalTrimmedString(mealOptionId);
  if (!targetId) return loadGuestNest();
  const nextDishName =
    updates.dishName !== undefined ? (updates.dishName ?? '').toString().trim() : undefined;
  const nextCourse = updates.course !== undefined ? normalizeMealCourse(updates.course) : undefined;
  if (nextDishName !== undefined && !nextDishName) {
    return loadGuestNest();
  }
  return updateState(
    (state) => {
      let didUpdate = false;
      const nextMealOptions = (state.mealOptions || []).map((opt) => {
        if (opt.id !== targetId) return opt;
        didUpdate = true;
        return {
          ...opt,
          dishName: nextDishName !== undefined ? nextDishName : opt.dishName,
          course: nextCourse !== undefined ? nextCourse : opt.course,
        };
      });
      if (!didUpdate) return state;
      return { ...state, mealOptions: nextMealOptions };
    },
    { action: 'updateMealOption', mealOptionId: targetId },
  );
};

export const deleteMealOption = async (mealOptionId) => {
  const targetId = optionalTrimmedString(mealOptionId);
  if (!targetId) return loadGuestNest();
  return updateState(
    (state) => {
      const nextMealOptions = (state.mealOptions || []).filter((m) => m.id !== targetId);
      const now = nowMs();
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.mealChoiceId !== targetId) return guest;
        return { ...guest, mealChoiceId: undefined, updatedAt: now };
      });
      return { ...state, mealOptions: nextMealOptions, guests: nextGuests };
    },
    { action: 'deleteMealOption', mealOptionId: targetId },
  );
};

export const addTable = async (data = {}) => {
  const name = (data.name ?? '').toString().trim();
  if (!name) return loadGuestNest();
  const createdAt = nowMs();
  const isTopTable = Boolean(data.isTopTable);
  const table = {
    id: createId('table'),
    name,
    numberOfSeats: Math.max(0, Number(data.numberOfSeats) || 0),
    type: optionalTrimmedString(data.type),
    isTopTable,
    createdAt,
  };
  return updateState(
    (state) => {
      const existing = state.tables || [];
      const nextTables = isTopTable
        ? existing.map((t) => (t.isTopTable ? { ...t, isTopTable: false } : t))
        : existing;
      return { ...state, tables: [...nextTables, table] };
    },
    { action: 'addTable', tableId: table.id },
  );
};

export const updateTable = async (tableId, updates = {}) => {
  const targetId = optionalTrimmedString(tableId);
  if (!targetId) return loadGuestNest();
  return updateState(
    (state) => {
      let didUpdate = false;
      const nextTables = (state.tables || []).map((table) => {
        if (table.id !== targetId) return table;
        didUpdate = true;
        return {
          ...table,
          name: updates.name !== undefined ? (updates.name ?? '').toString().trim() : table.name,
          numberOfSeats:
            updates.numberOfSeats !== undefined
              ? Math.max(0, Number(updates.numberOfSeats) || 0)
              : table.numberOfSeats,
          type:
            updates.type === null
              ? undefined
              : updates.type !== undefined
                ? optionalTrimmedString(updates.type)
                : table.type,
          isTopTable: updates.isTopTable !== undefined ? Boolean(updates.isTopTable) : Boolean(table.isTopTable),
        };
      });
      if (!didUpdate) return state;
      if (updates.isTopTable === true) {
        const normalized = nextTables.map((table) =>
          table.id === targetId ? { ...table, isTopTable: true } : { ...table, isTopTable: false },
        );
        return { ...state, tables: normalized };
      }
      return { ...state, tables: nextTables };
    },
    { action: 'updateTable', tableId: targetId },
  );
};

export const deleteTable = async (tableId) => {
  const targetId = optionalTrimmedString(tableId);
  if (!targetId) return loadGuestNest();
  return updateState(
    (state) => {
      const nextTables = (state.tables || []).filter((t) => t.id !== targetId);
      const now = nowMs();
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.tableId !== targetId) return guest;
        return { ...guest, tableId: undefined, seatLabel: undefined, updatedAt: now };
      });
      return { ...state, tables: nextTables, guests: nextGuests };
    },
    { action: 'deleteTable', tableId: targetId },
  );
};

export const assignGuestToTable = async (guestId, tableId, seatLabel) => {
  const targetGuestId = optionalTrimmedString(guestId);
  const targetTableId = optionalTrimmedString(tableId);
  if (!targetGuestId || !targetTableId) return loadGuestNest();

  const seat = optionalTrimmedString(seatLabel);
  return updateState(
    (state) => {
      const now = nowMs();
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.id !== targetGuestId) return guest;
        const isSameTable = guest.tableId === targetTableId;
        return {
          ...guest,
          tableId: targetTableId,
          seatLabel: seat ? seat : isSameTable ? guest.seatLabel : undefined,
          updatedAt: now,
        };
      });
      return { ...state, guests: nextGuests };
    },
    { action: 'assignGuestToTable', guestId: targetGuestId, tableId: targetTableId },
  );
};

export const unassignGuestFromTable = async (guestId) => {
  const targetGuestId = optionalTrimmedString(guestId);
  if (!targetGuestId) return loadGuestNest();
  return updateState(
    (state) => {
      const now = nowMs();
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.id !== targetGuestId) return guest;
        if (!guest.tableId) return guest;
        return { ...guest, tableId: undefined, seatLabel: undefined, updatedAt: now };
      });
      return { ...state, guests: nextGuests };
    },
    { action: 'unassignGuestFromTable', guestId: targetGuestId },
  );
};

export const setGuestMealChoice = async (guestId, mealChoiceId, dietaryNotes) => {
  const targetGuestId = optionalTrimmedString(guestId);
  if (!targetGuestId) return loadGuestNest();
  const mealId = mealChoiceId === null ? undefined : optionalTrimmedString(mealChoiceId);
  const notes =
    dietaryNotes === undefined
      ? undefined
      : dietaryNotes === null
        ? undefined
        : optionalTrimmedString(dietaryNotes);
  return updateState(
    (state) => {
      const now = nowMs();
      const nextGuests = (state.guests || []).map((guest) => {
        if (guest.id !== targetGuestId) return guest;
        const next = { ...guest, updatedAt: now };
        next.mealChoiceId = mealId;
        if (dietaryNotes !== undefined) {
          next.dietaryNotes = notes;
        }
        return next;
      });
      return { ...state, guests: nextGuests };
    },
    { action: 'setGuestMealChoice', guestId: targetGuestId, mealChoiceId: mealId },
  );
};
