const guestNestListeners = new Set();

export const subscribeToGuestNestChanges = (listener) => {
  if (typeof listener !== 'function') return () => {};
  guestNestListeners.add(listener);
  return () => {
    guestNestListeners.delete(listener);
  };
};

export const emitGuestNestChange = (state, meta = {}) => {
  const snapshot = state ?? null;
  const metadata = meta || {};
  guestNestListeners.forEach((listener) => {
    try {
      listener(snapshot, metadata);
    } catch (error) {
      console.warn('[guestNest] listener error', error);
    }
  });
};

