import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_GUEST_NEST_STATE, loadGuestNest } from './guestNestStorage';
import {
  addGuest,
  updateGuest,
  deleteGuest,
  bulkAddGuests,
  addGroup,
  deleteGroup,
  addMealOption,
  updateMealOption,
  deleteMealOption,
  addTable,
  updateTable,
  deleteTable,
  assignGuestToTable,
  unassignGuestFromTable,
  setGuestMealChoice,
} from './guestNestStore';
import { subscribeToGuestNestChanges } from './guestNestEvents';

const GuestNestContext = createContext(null);

const buildIdMap = (items = []) =>
  (items || []).reduce((acc, item) => {
    if (item?.id) acc[item.id] = item;
    return acc;
  }, {});

export function GuestNestProvider({ children }) {
  const [state, setState] = useState(DEFAULT_GUEST_NEST_STATE);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const next = await loadGuestNest();
    setState(next);
    setHydrated(true);
    return next;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = subscribeToGuestNestChanges((next) => {
      if (!next) return;
      setState(next);
      setHydrated(true);
    });
    return unsubscribe;
  }, []);

  const groupById = useMemo(() => buildIdMap(state.groups), [state.groups]);
  const mealOptionById = useMemo(() => buildIdMap(state.mealOptions), [state.mealOptions]);
  const tableById = useMemo(() => buildIdMap(state.tables), [state.tables]);

  const actions = useMemo(
    () => ({
      refresh,
      addGuest,
      updateGuest,
      deleteGuest,
      bulkAddGuests,
      addGroup,
      deleteGroup,
      addMealOption,
      updateMealOption,
      deleteMealOption,
      addTable,
      updateTable,
      deleteTable,
      assignGuestToTable,
      unassignGuestFromTable,
      setGuestMealChoice,
    }),
    [refresh],
  );

  const value = useMemo(
    () => ({
      state,
      hydrated,
      groupById,
      mealOptionById,
      tableById,
      actions,
    }),
    [actions, groupById, hydrated, mealOptionById, state, tableById],
  );

  return <GuestNestContext.Provider value={value}>{children}</GuestNestContext.Provider>;
}

export function useGuestNest() {
  const ctx = useContext(GuestNestContext);
  if (ctx) return ctx;
  return {
    state: DEFAULT_GUEST_NEST_STATE,
    hydrated: false,
    groupById: {},
    mealOptionById: {},
    tableById: {},
    actions: {
      refresh: async () => DEFAULT_GUEST_NEST_STATE,
    },
  };
}
