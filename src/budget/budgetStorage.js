import AsyncStorage from '@react-native-async-storage/async-storage';
import { emitCategoryChange } from './budgetEvents';

const STORAGE_KEY = 'BUDGET_BUDDY_STATE';

export const COMMON_CATEGORY_OPTIONS = [
  { id: 'venue', label: 'Venue' },
  { id: 'catering', label: 'Catering' },
  { id: 'photography', label: 'Photography' },
  { id: 'videography', label: 'Videography' },
  { id: 'attire', label: 'Attire' },
  { id: 'hair-makeup', label: 'Hair & Makeup' },
  { id: 'flowers', label: 'Flowers' },
  { id: 'music', label: 'Music / Entertainment' },
  { id: 'transport', label: 'Transport' },
  { id: 'stationery', label: 'Stationery' },
  { id: 'cake', label: 'Cake' },
  { id: 'decor', label: 'Decor' },
  { id: 'rings', label: 'Rings' },
];

const buildAllocationsFromCategories = (categories) =>
  categories.reduce((acc, cat) => {
    acc[cat.id] = acc[cat.id] ?? 0;
    return acc;
  }, {});

const DEFAULT_STATE = {
  totalBudget: null,
  categories: [],
  allocations: {},
  quotes: [],
  payments: [],
};

const normalizeCategory = (category) => {
  const hasManualFlag = category.createdManually !== undefined && category.createdManually !== null;
  return {
    id: category.id,
    label: category.label,
    vendorName: category.vendorName ?? '',
    notes: category.notes ?? '',
    createdManually: hasManualFlag ? Boolean(category.createdManually) : true,
  };
};

const ensureCategories = (storedCategories) =>
  Array.isArray(storedCategories) ? storedCategories.map(normalizeCategory) : [];

const createQuoteId = () => `quote-${Date.now()}-${Math.round(Math.random() * 1000)}`;
const createPaymentId = () => `payment-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const normalizeQuote = (quote) => ({
  id: quote.id || createQuoteId(),
  vendorName: quote.vendorName ?? '',
  categoryId: quote.categoryId ?? null,
  amount: Number(quote.amount) || 0,
  status: quote.status ?? 'considering',
  phone: quote.phone ?? '',
  email: quote.email ?? '',
  notes: quote.notes ?? '',
});

const ensureQuotes = (storedQuotes) =>
  Array.isArray(storedQuotes) ? storedQuotes.map(normalizeQuote) : [];

const normalizePayment = (payment) => ({
  id: payment.id || createPaymentId(),
  categoryId: payment.categoryId ?? null,
  categoryName: payment.categoryName ?? '',
  vendorName: payment.vendorName ?? '',
  amount: Number(payment.amount) || 0,
  dueDate: payment.dueDate ?? null,
  paymentType: payment.paymentType ?? 'deposit',
  status: payment.status === 'paid' ? 'paid' : 'pending',
  createdAt: payment.createdAt ?? new Date().toISOString(),
  updatedAt: payment.updatedAt ?? new Date().toISOString(),
});

const ensurePayments = (storedPayments) =>
  Array.isArray(storedPayments) ? storedPayments.map(normalizePayment) : [];

const ensureAllocations = (categories, storedAllocations = {}) => {
  const allocations = { ...storedAllocations };
  categories.forEach((cat) => {
    if (allocations[cat.id] === undefined) {
      allocations[cat.id] = 0;
    }
  });
  return allocations;
};

export const loadBudgetState = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(stored);
    const categories = ensureCategories(parsed.categories);
    const allocations = ensureAllocations(categories, parsed.allocations);
    const quotes = ensureQuotes(parsed.quotes);
    return {
      totalBudget: parsed.totalBudget ?? null,
      categories,
      allocations,
      quotes,
      payments: ensurePayments(parsed.payments),
    };
  } catch (error) {
    console.warn('[budget] unable to load budget state', error);
    return DEFAULT_STATE;
  }
};

export const saveBudgetState = async (state) => {
  try {
    const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    const nextState = {
      ...existing,
      ...state,
    };
    if (state.quotes === undefined && existing.quotes === undefined) {
      nextState.quotes = [];
    }
    if (state.payments === undefined && existing.payments === undefined) {
      nextState.payments = [];
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch (error) {
    console.warn('[budget] unable to save budget state', error);
  }
};

const slugify = (label) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `cat-${Date.now()}`;

const ensureUniqueId = (baseId, existingIds) => {
  if (!existingIds.includes(baseId)) return baseId;
  let suffix = 2;
  let candidate = `${baseId}-${suffix}`;
  while (existingIds.includes(candidate)) {
    suffix += 1;
    candidate = `${baseId}-${suffix}`;
  }
  return candidate;
};

export const addBudgetCategories = async (labels = []) => {
  const state = await loadBudgetState();
  const existing = state.categories || [];
  const existingIds = existing.map((cat) => cat.id);
  const existingLabels = existing.map((cat) => cat.label.toLowerCase());

  const additions = [];
  labels.forEach((raw) => {
    const trimmed = raw?.trim();
    if (!trimmed) return;
    if (existingLabels.includes(trimmed.toLowerCase())) {
      return;
    }
    const baseId = slugify(trimmed);
    const uniqueId = ensureUniqueId(baseId, [...existingIds, ...additions.map((cat) => cat.id)]);
    additions.push({ id: uniqueId, label: trimmed, vendorName: '', notes: '', createdManually: true });
  });

  if (additions.length === 0) {
    return { state, addedCategories: [] };
  }

  const categories = [...existing, ...additions];
  const allocations = ensureAllocations(categories, state.allocations);
  const nextState = {
    ...state,
    categories,
    allocations,
  };
  await saveBudgetState(nextState);
  emitCategoryChange(nextState.categories || [], {
    added: additions.map((cat) => cat.id),
  });
  return { state: nextState, addedCategories: additions };
};

export const updateBudgetCategory = async (categoryId, updates = {}) => {
  const state = await loadBudgetState();
  const { categories = [], allocations = {} } = state;
  let updated = false;
  const nextCategories = categories.map((cat) => {
    if (cat.id !== categoryId) return cat;
    updated = true;
    return {
      ...cat,
      label: updates.label ?? cat.label,
      vendorName: updates.vendorName ?? cat.vendorName ?? '',
      notes: updates.notes ?? cat.notes ?? '',
      createdManually: true,
    };
  });
  if (!updated) {
    return state;
  }
  const nextAllocations = { ...allocations };
  if (updates.allocation !== undefined && updates.allocation !== null) {
    nextAllocations[categoryId] = updates.allocation;
  }
  const nextState = {
    ...state,
    categories: nextCategories,
    allocations: nextAllocations,
  };
  await saveBudgetState(nextState);
  emitCategoryChange(nextState.categories || [], {
    updated: categoryId,
  });
  return nextState;
};

export const deleteBudgetCategory = async (categoryId) => {
  const state = await loadBudgetState();
  const categories = (state.categories || []).filter((cat) => cat.id !== categoryId);
  if (categories.length === (state.categories || []).length) {
    return state;
  }
  const allocations = { ...(state.allocations || {}) };
  delete allocations[categoryId];
  const nextState = {
    ...state,
    categories,
    allocations,
  };
  await saveBudgetState(nextState);
  emitCategoryChange(nextState.categories || [], {
    deleted: categoryId,
  });
  return nextState;
};

export const QUOTE_STATUSES = [
  { id: 'considering', label: 'Considering' },
  { id: 'booked', label: 'Booked' },
  { id: 'declined', label: 'Declined' },
];

export const addQuote = async (data) => {
  const state = await loadBudgetState();
  const quote = normalizeQuote({
    ...data,
    id: createQuoteId(),
  });
  const nextQuotes = [quote, ...(state.quotes || [])];
  const nextState = {
    ...state,
    quotes: nextQuotes,
  };
  await saveBudgetState(nextState);
  return nextState;
};

export const updateQuote = async (quoteId, updates = {}) => {
  const state = await loadBudgetState();
  const quotes = state.quotes || [];
  let updated = false;
  const nextQuotes = quotes.map((quote) => {
    if (quote.id !== quoteId) return quote;
    updated = true;
    return normalizeQuote({
      ...quote,
      ...updates,
      id: quote.id,
    });
  });
  if (!updated) {
    return state;
  }
  const nextState = {
    ...state,
    quotes: nextQuotes,
  };
  await saveBudgetState(nextState);
  return nextState;
};

export const deleteQuote = async (quoteId) => {
  const state = await loadBudgetState();
  const quotes = state.quotes || [];
  const nextQuotes = quotes.filter((quote) => quote.id !== quoteId);
  if (nextQuotes.length === quotes.length) {
    return state;
  }
  const nextState = {
    ...state,
    quotes: nextQuotes,
  };
  await saveBudgetState(nextState);
  return nextState;
};

export const PAYMENT_TYPES = [
  { id: 'deposit', label: 'Deposit' },
  { id: 'instalment', label: 'Instalment' },
  { id: 'final', label: 'Final Balance' },
  { id: 'other', label: 'Other' },
];

export const addPayment = async (data) => {
  const state = await loadBudgetState();
  const payment = normalizePayment({
    ...data,
    id: createPaymentId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const payments = [payment, ...(state.payments || [])];
  const nextState = {
    ...state,
    payments,
  };
  await saveBudgetState(nextState);
  return nextState;
};

export const updatePayment = async (paymentId, updates = {}) => {
  const state = await loadBudgetState();
  const payments = state.payments || [];
  let updated = false;
  const nextPayments = payments.map((payment) => {
    if (payment.id !== paymentId) return payment;
    updated = true;
    return normalizePayment({
      ...payment,
      ...updates,
      id: payment.id,
      updatedAt: new Date().toISOString(),
    });
  });
  if (!updated) {
    return state;
  }
  const nextState = {
    ...state,
    payments: nextPayments,
  };
  await saveBudgetState(nextState);
  return nextState;
};

export const deletePayment = async (paymentId) => {
  const state = await loadBudgetState();
  const payments = state.payments || [];
  const nextPayments = payments.filter((payment) => payment.id !== paymentId);
  if (nextPayments.length === payments.length) {
    return state;
  }
  const nextState = {
    ...state,
    payments: nextPayments,
  };
  await saveBudgetState(nextState);
  return nextState;
};
