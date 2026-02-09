const categoryListeners = new Set();

export const subscribeToCategoryChanges = (listener) => {
  if (typeof listener !== 'function') return () => {};
  categoryListeners.add(listener);
  return () => {
    categoryListeners.delete(listener);
  };
};

export const emitCategoryChange = (categories, meta = {}) => {
  const snapshot = Array.isArray(categories) ? categories : [];
  const metadata = meta || {};
  categoryListeners.forEach((listener) => {
    try {
      listener(snapshot, metadata);
    } catch (error) {
      console.warn('[budget] category listener error', error);
    }
  });
};
