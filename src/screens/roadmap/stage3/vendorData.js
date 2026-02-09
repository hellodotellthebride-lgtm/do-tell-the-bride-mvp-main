export const DREAM_TEAM_VENDORS = [
  { id: 'venue', label: 'Venue' },
  { id: 'caterer', label: 'Caterer' },
  { id: 'photographer', label: 'Photographer' },
  { id: 'florist', label: 'Florist' },
  { id: 'dj-band', label: 'DJ/Band' },
  { id: 'planner', label: 'Wedding Planner' },
  { id: 'hair-makeup', label: 'Hair & Makeup' },
];

export const getVendorById = (vendorId) =>
  DREAM_TEAM_VENDORS.find((vendor) => vendor.id === vendorId);
