export const trackEvent = (name, payload = {}) => {
  try {
    // Replace this console.log with a real analytics client when available.
    console.log(`[analytics] ${name}`, payload);
  } catch (error) {
    console.warn('Analytics event failed', name, error);
  }
};
