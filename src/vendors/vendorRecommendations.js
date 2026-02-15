import { VENDOR_DIRECTORY } from './vendorData';

const normalize = (value) => (value ?? '').toString().trim().toLowerCase();

const tokenize = (value) =>
  normalize(value)
    .split(/[\s,]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

const includesAnyToken = (haystack, tokens) => {
  if (!haystack || tokens.length === 0) return false;
  return tokens.some((token) => haystack.includes(token));
};

const scoreVendor = ({ vendor, locationTokens, weddingType }) => {
  let score = 0;
  const vendorRegions = Array.isArray(vendor.regions) ? vendor.regions : [];
  const vendorTypes = Array.isArray(vendor.weddingTypes) ? vendor.weddingTypes : [];

  if (vendorRegions.includes('any')) score += 1;
  if (weddingType) {
    const typeMatch = vendorTypes.some((t) => normalize(t).includes(weddingType));
    if (typeMatch) score += 3;
  }

  if (locationTokens.length > 0) {
    const regionText = vendorRegions.map(normalize).join(' ');
    if (includesAnyToken(regionText, locationTokens)) score += 4;
  }

  return score;
};

export const getRecommendedVendors = (userLocation, weddingType, options = {}) => {
  const limit = Number.isFinite(options.limit) ? options.limit : 8;
  const locationTokens = tokenize(userLocation).slice(0, 3);
  const normalizedWeddingType = normalize(weddingType);

  const scored = VENDOR_DIRECTORY.map((vendor, index) => ({
    vendor,
    score: scoreVendor({ vendor, locationTokens, weddingType: normalizedWeddingType }),
    index,
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  return scored.slice(0, Math.max(0, limit)).map((entry) => entry.vendor);
};

